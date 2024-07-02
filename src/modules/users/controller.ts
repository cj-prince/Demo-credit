import { fnRequest } from '../../shared/types';
import * as dtos from "./dto";
import * as message from "../../shared/lib/message";
import UserServices from './services';
import * as Response from "../../shared/lib/api-response";
import { StatusCodes } from 'http-status-codes';
import loggerWrapper from "../../shared/log_wrapper";



export class UserController {
  public accountFunding: fnRequest = async (req, res) => {
    const { user } = req;
    const payload = new dtos.AccountFundingDto(req.body);
    const response = await UserServices.accountFunding(
      payload,
      user?.id as string
    );
    loggerWrapper.info(
      "User account funded successfully :: user.controller.ts"
    );
    return Response.success(
      res,
      message.OPERATION_SUCCESSFUL("User account funding"),
      StatusCodes.CREATED,
      {
        response,
      }
    );
  };

  public transferFunds: fnRequest = async (req, res) => {
    const { user } = req;
    const payload = new dtos.TransferFundsDto(req.body);
    const response = await UserServices.transferFunds(
      payload,
      user?.id as string
    );
    loggerWrapper.info(
      `${user?.id} funds transfer was successfully :: user.controller.ts`
    );
    return Response.success(
      res,
      message.OPERATION_SUCCESSFUL("funds transfer"),
      StatusCodes.CREATED,
      {
        response,
      }
    );
  };

  public withdrawFunds: fnRequest = async (req, res) => {
    const { user } = req;
    const payload = new dtos.WithdrawFundsDto(req.body);
    const response = await UserServices.withdrawFunds(
      payload,
      user?.id as string
    );
    loggerWrapper.info(
      `${user?.id} funds withdraw was successfully :: user.controller.ts`
    );
    return Response.success(
      res,
      message.OPERATION_SUCCESSFUL("funds withdraw"),
      StatusCodes.CREATED,
      {
        response,
      }
    );
  };
};


const userController = new UserController();

export default userController;
