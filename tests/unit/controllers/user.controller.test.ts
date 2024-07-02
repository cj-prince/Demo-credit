import { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import chai from "chai";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserController } from "../../../src/modules/users/controller";
import UserServices from "../../../src/modules/users/services";
import * as ResponseLib from "../../../src/shared/lib/api-response";
import * as message from "../../../src/shared/lib/message";

chai.use(sinonChai);

describe("UserController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let controller: UserController;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: "user-id" } 
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    controller = new UserController();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("accountFunding", () => {
    it("should fund user account successfully", async () => {
      const payload = { amount: 1000, wallet_number: "123456" };
      req.body = payload;
      const mockResponse = "Account funded successfully";

      sinon.stub(UserServices, "accountFunding").resolves(mockResponse);
      const successStub = sinon.stub(ResponseLib, "success");

      await controller.accountFunding(
        req as Request,
        res as Response,
      );

      expect(successStub).to.have.been.calledOnceWith(
        res,
        message.OPERATION_SUCCESSFUL("User account funding"),
        StatusCodes.CREATED,
        { response: mockResponse }
      );
    });

    it("should handle errors during account funding", async () => {
      const payload = { amount: 1000, wallet_number: "123456" };
      req.body = payload;

      sinon
        .stub(UserServices, "accountFunding")
        .rejects(new Error("Database error"));
      const errorStub = sinon.stub(ResponseLib, "DB_error");

      await controller.accountFunding(
        req as Request,
        res as Response,
      );

      expect(errorStub).to.have.been.calledOnceWith(res);
    });
  });

  describe("transferFunds", () => {
    it("should transfer funds successfully", async () => {
      const payload = { amount: 500, wallet_number: "654321" };
      req.body = payload;
      const mockResponse = "Funds transferred successfully";

      sinon.stub(UserServices, "transferFunds").resolves(mockResponse);
      const successStub = sinon.stub(ResponseLib, "success");

      await controller.transferFunds(
        req as Request,
        res as Response,
      );

      expect(successStub).to.have.been.calledOnceWith(
        res,
        message.OPERATION_SUCCESSFUL("funds transfer"),
        StatusCodes.CREATED,
        { response: mockResponse }
      );
    });

    it("should handle errors during funds transfer", async () => {
      const payload = { amount: 500, wallet_number: "654321" };
      req.body = payload;

      sinon
        .stub(UserServices, "transferFunds")
        .rejects(new Error("Database error"));
      const errorStub = sinon.stub(ResponseLib, "DB_error");

      await controller.transferFunds(
        req as Request,
        res as Response,
      );

      expect(errorStub).to.have.been.calledOnceWith(res);
    });
  });

  describe("withdrawFunds", () => {
    it("should withdraw funds successfully", async () => {
      const payload = { amount: 300 };
      req.body = payload;
      const mockResponse = "Funds withdrawn successfully";

      sinon.stub(UserServices, "withdrawFunds").resolves(mockResponse);
      const successStub = sinon.stub(ResponseLib, "success");

      await controller.withdrawFunds(
        req as Request,
        res as Response,
      );

      expect(successStub).to.have.been.calledOnceWith(
        res,
        message.OPERATION_SUCCESSFUL("funds withdraw"),
        StatusCodes.CREATED,
        { response: mockResponse }
      );
    });

    it("should handle errors during funds withdrawal", async () => {
      const payload = { amount: 300 };
      req.body = payload;

      sinon
        .stub(UserServices, "withdrawFunds")
        .rejects(new Error("Database error"));
      const errorStub = sinon.stub(ResponseLib, "DB_error");

      await controller.withdrawFunds(
        req as Request,
        res as Response,
      );

      expect(errorStub).to.have.been.calledOnceWith(res);
    });
  });
});
