import { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import chai from "chai";
import { beforeEach, describe, it, afterEach } from 'mocha';
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticationController } from "../../../src/modules/authentication/controller";
import AuthenticationService from "../../../src/modules/authentication/services";
import jwtSigningService from "../../../src/shared/jwt";
import * as ResponseLib from "../../../src/shared/lib/api-response";
import * as message from "../../../src/shared/lib/message";
import { BadException } from "../../../src/shared/lib/errors";

chai.use(sinonChai);

describe("AuthenticationController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let controller: AuthenticationController;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    controller = new AuthenticationController();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createUserAccount", () => {
    it("should create a user account successfully", async () => {
      const payload = {
        user_name: "Mark",
        first_name: "John",
        last_name: "Doe",
        email: "admin@gmail.com",
        password: "democredit@1",
        phone_number: "8066114077",
        terms_and_conditions: true,
      };
      req.body = payload;

      sinon
        .stub(AuthenticationService, "createUserAccount")
      const successStub = sinon.stub(ResponseLib, "success");

      await controller.createUserAccount(
        req as Request,
        res as Response,
      );

      expect(successStub).to.have.been.calledOnceWithExactly(
        res,
        message.OPERATION_SUCCESSFUL("User account"),
        StatusCodes.CREATED,
        {
          response: undefined,
        }
      );
    });

  });

  describe("UserAccountLogin", () => {
    it("should log in a user successfully", async () => {
      const payload = { email: "test@example.com", password: "password" };
      req.body = payload;
      const userResponse = {
        id: "user-id",
        email: "test@example.com",
        password: "hashedPassword",
      };
      const token = "jwt-token";

      sinon
        .stub(AuthenticationService, "userAccountLogin")
        .resolves(userResponse);
      sinon.stub(jwtSigningService, "sign").resolves(token);
      const successStub = sinon.stub(ResponseLib, "success");

      await controller.UserAccountLogin(
        req as Request,
        res as Response
      );

      expect(successStub).to.have.been.calledOnceWithExactly(
        res,
        message.OPERATION_SUCCESSFUL("Login"),
        StatusCodes.OK,
        { token }
      );
    });

    it("should handle BadException during login", async () => {
      const payload = { email: "test@example.com", password: "password" };
      req.body = payload;
      const badException = new BadException("Invalid credentials");

      sinon
        .stub(AuthenticationService, "userAccountLogin")
        .resolves(badException);
      const errorStub = sinon.stub(ResponseLib, "error");

      await controller.UserAccountLogin(
        req as Request,
        res as Response
      );

      expect(errorStub).to.have.been.calledOnceWithExactly(
        res,
        { message: badException.message },
        StatusCodes.BAD_REQUEST
      );
    });

    it("should handle errors during login", async () => {
      const payload = { email: "test@example.com", password: "password" };
      req.body = payload;

      sinon
        .stub(AuthenticationService, "userAccountLogin")
        .rejects(new Error("Database error"));
      const errorStub = sinon.stub(ResponseLib, "DB_error");

      await controller.UserAccountLogin(
        req as Request,
        res as Response
      );

      expect(errorStub).to.have.been.calledOnceWithExactly(res);
    });
  });
});
