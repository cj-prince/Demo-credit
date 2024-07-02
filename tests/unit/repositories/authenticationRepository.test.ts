import { expect } from "chai";
import sinon from "sinon";
import { connection } from "../../../src/config/knex";
import customerRepository, {
} from "../../../src/modules/authentication/repositories";
import * as dtos from "../../../src/modules/authentication/dto";
import { BadException } from "../../../src/shared/lib/errors";
import * as message from "../../../src/shared/lib/message";
import loggerWrapper from "../../../src/shared/log_wrapper";

describe("AuthenticationRepository", () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("createUserAccount", () => {
    it("should create user account successfully", async () => {
      const payload = new dtos.CreateUserAccountDto({
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        user_name: "johndoe",
        phone_number: "1234567890",
        terms_and_conditions: true,
      });
      const walletNumber = "123456";
      const walletName = "John's Wallet";

      const trxStub = {
        rollback: sandbox.stub(),
        commit: sandbox.stub(),
      };
      const trxFunc = sandbox.stub().callsFake(async (trxCallback) => {
        await trxCallback(trxStub);
        return trxStub;
      });

      sandbox.stub(connection, "transaction").callsFake(trxFunc);
      sandbox.stub(connection("users"), "insert").resolves([1]);
      sandbox.stub(connection("users"), "where").returnsThis();
      sandbox.stub(connection("users"), "first").resolves({ id: "user-id" });
      sandbox.stub(connection("wallets"), "insert").resolves([1]);

      await customerRepository.createUserAccount(
        payload,
        walletNumber,
        walletName
      );

      expect(connection.transaction).to.have.been.calledOnce;
      expect(connection("users").insert).to.have.been.calledOnceWith(payload);
      expect(connection("users").where).to.have.been.calledOnceWith({
        email: payload.email,
      });
      expect(connection("users").first).to.have.been.calledOnce;
      expect(connection("wallets").insert).to.have.been.calledOnceWith({
        wallet_number: walletNumber,
        wallet_name: walletName,
        user_id: "user-id",
      });
    });

    it("should handle errors during user account creation", async () => {
      const payload = new dtos.CreateUserAccountDto({
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        user_name: "johndoe",
        phone_number: "1234567890",
        terms_and_conditions: true,
      });
      const walletNumber = "123456";
      const walletName = "John's Wallet";

      const trxStub = {
        rollback: sandbox.stub(),
        commit: sandbox.stub(),
      };
      const trxFunc = sandbox.stub().callsFake(async (trxCallback) => {
        await trxCallback(trxStub);
        throw new Error("Transaction error");
      });

      sandbox.stub(connection, "transaction").callsFake(trxFunc);
      sandbox.stub(loggerWrapper, "error");

      try {
        await customerRepository.createUserAccount(
          payload,
          walletNumber,
          walletName
        );
      } catch (error) {
        expect(error).to.be.instanceOf(BadException);
        expect(error.message).to.equal(message.INVALID_INPUT("Signup"));
        expect(loggerWrapper.error).to.have.been.calledOnce;
      }
    });
  });

  describe("userAccountLogin", () => {
    it("should log in user successfully", async () => {
      const payload = new dtos.UserAccountLoginDto({
        email: "john.doe@example.com",
        password: "password123",
      });

      const mockUser = {
        status: "success",
        message: "Login operation successful.",
        code: 200,
        data: {
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM0ZDFjZTdlLTM2OTAtMTFlZi05NzAxLTdmYTRiNWExMDg0NSIsImVtYWlsIjoiSm9obmRvZUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMiRicEU0djkyQnhtYWMvZnZML05Uck9PU0E2NmZ1QmRvOGVTQXI2WHJtdHNrMS9mQkpZa2EudSIsImlhdCI6MTcxOTk1NDMxNiwiYXVkIjoiaHR0cHM6Ly9kZW1vY3JlZGl0LmNvbSIsImlzcyI6IkRlbW9jcmVkaXQiLCJzdWIiOiJBdXRoZW50aWNhdGlvbiBUb2tlbiJ9.uomaSGT_k7t7dfYZpdXFLshr8EDxguot_QPmR37ziKQ",
        },
      };

      sandbox.stub(connection("users"), "where").returnsThis();
      sandbox.stub(connection("users"), "first").resolves(mockUser);

      const response = await customerRepository.userAccountLogin(payload);

      expect(response).to.have.property("token", mockUser.data.token);
    });

    it("should handle login failure", async () => {
      const payload = new dtos.UserAccountLoginDto({
        email: "john.doe@example.com",
      });

      sandbox.stub(connection("users"), "where").returnsThis();
      sandbox.stub(connection("users"), "first").resolves(undefined);

      try {
        await customerRepository.userAccountLogin(payload);
      } catch (error) {
        expect(error).to.be.instanceOf(BadException);
        expect(error.message).to.equal(message.OPERATION_FAILED("login"));
      }
    });
  });
});
