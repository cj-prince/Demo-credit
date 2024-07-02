import { StatusCodes } from "http-status-codes";
import * as dtos from "./dto";
import { fnRequest } from "../../shared/types";
import AuthenticationService from "./services";
import * as message from "../../shared/lib/message";
import { SignedData} from "../../shared/interface";
import * as Response from "../../shared/lib/api-response";
import loggerWrapper from "../../shared/log_wrapper";
import jwtSigningService from "../../shared/jwt";
import {
  BadException
} from "../../shared/lib/errors";


export class AuthenticationController {
  public createUserAccount: fnRequest = async (req, res) => {
    const payload = new dtos.CreateUserAccountDto(req.body);
    const response = await AuthenticationService.createUserAccount(payload);
    loggerWrapper.info(
      "User account created successfully :: authentication.controller.ts"
    );
    return Response.success(
      res,
      message.OPERATION_SUCCESSFUL("User account"),
      StatusCodes.CREATED,
      {
        response,
      }
    );
  };

  public UserAccountLogin: fnRequest = async (req, res) => {
    const payload = new dtos.UserAccountLoginDto(req.body);

    try {
      const response = await AuthenticationService.userAccountLogin(payload);

      if (response instanceof BadException) {
        return Response.error(
          res,
          { message: response.message },
          StatusCodes.BAD_REQUEST
        );
      }

      const signedData: SignedData = {
        id: response.id,
        email: response.email,
        password: response.password as string,
        username: response.username,
      };

      const token = await jwtSigningService.sign(signedData);

      loggerWrapper.info(
        `Login successful: ${response.email}`,
        "authentication.controller.ts"
      );

      return Response.success(
        res,
        message.OPERATION_SUCCESSFUL("Login"),
        StatusCodes.OK,
        {
          token,
        }
      );
    } catch (error) {
      loggerWrapper.error(
        `Error logging in: ${error}`,
        "authentication.controller.ts"
      );
      return Response.DB_error(res);
    }
  };
}

const authenticationController = new AuthenticationController();

export default authenticationController;
