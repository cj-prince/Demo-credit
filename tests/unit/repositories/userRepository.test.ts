import { expect } from "chai";
import sinon from "sinon";
import { beforeEach, describe, it, afterEach } from "mocha";
import userRepository, {
} from "../../../src/modules/users/repositories";
import * as dtos from "../../../src/modules/users/dto";
import { BadException } from "../../../src/shared/lib/errors";
import { connection } from "../../../src/config/knex";
import chaiAsPromised from "chai-as-promised"; 
chai.use(chaiAsPromised);


describe("UserRepository", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("accountFunding", () => {
    it("should fund account successfully", async () => {
      const payload: dtos.AccountFundingDto = {
        wallet_number: "123456",
        amount: 100,
      };
      const id = "user-id";

      sandbox.stub(connection("wallets"), "where").returnsThis();
      sandbox.stub(connection("wallets"), "increment").resolves(1);
      sandbox.stub(connection("transactions"), "insert").resolves(1);

      const result = await userRepository.accountFunding(payload, id);

      expect(result).to.equal("Account funded successfully");
    });

    it("should handle invalid amount", async () => {
      const payload: dtos.AccountFundingDto = {
        wallet_number: "123456",
        amount: -10,
      };
      const id = "user-id";

      await expect(
        userRepository.accountFunding(payload, id)
      ).to.be.rejectedWith(BadException, "Invalid amount provided for funding");
    });

  });

  describe("transferFunds", () => {
    it("should transfer funds successfully", async () => {
      const payload: dtos.TransferFundsDto = {
        wallet_number: "123456",
        amount: 50,
      };
      const id = "user-id";

      sandbox
        .stub(connection("wallets"), "wallet")
        .callsFake(async (trxCallback) => {
          await trxCallback({
            where: sandbox.stub().returnsThis(),
            first: sandbox
              .stub()
              .resolves({ id: "sender-wallet-id", balance: 100 }),
            decrement: sandbox.stub().resolves(1),
            increment: sandbox.stub().resolves(1),
          });
        });
      sandbox.stub(connection("transactions"), "insert").resolves(1);

      const result = await userRepository.transferFunds(payload, id);

      expect(result).to.equal("Fund Transfer successfully");
    });

    it("should handle insufficient funds", async () => {
      const payload: dtos.TransferFundsDto = {
        wallet_number: "123456",
        amount: 150, 
      };
      const id = "user-id";

      await expect(
        userRepository.transferFunds(payload, id)
      ).to.be.rejectedWith(Error, "Insufficient funds");
    });

  });

  describe("withdrawFunds", () => {
    it("should withdraw funds successfully", async () => {
      const payload: dtos.WithdrawFundsDto = {
        amount: 20,
      };
      const id = "user-id";

      sandbox
        .stub(connection("wallets"), "transaction")
        .callsFake(async (trxCallback) => {
          await trxCallback({
            where: sandbox.stub().returnsThis(),
            first: sandbox
              .stub()
              .resolves({ id: "user-wallet-id", balance: 50 }),
            decrement: sandbox.stub().resolves(1),
          });
        });
      sandbox.stub(connection("transactions"), "insert").resolves(1);

      const result = await userRepository.withdrawFunds(payload, id);

      expect(result).to.equal("Fund Withdrawal successfully");
    });

    it("should handle insufficient funds for withdrawal", async () => {
      const payload: dtos.WithdrawFundsDto = {
        amount: 100,
      };
      const id = "user-id";

      await expect(
        userRepository.withdrawFunds(payload, id)
      ).to.be.rejectedWith(Error, "Insufficient funds");
    });

  });
});
