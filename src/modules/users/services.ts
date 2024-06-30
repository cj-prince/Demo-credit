import * as dtos from "./dto";
import userRepository from './repositories';
import { BadException } from "../../shared/lib/errors";

export interface UserServices {
  accountFunding(
    payload: dtos.AccountFundingDto,
    id: string
  ): Promise<BadException | string>;
  transferFunds(
    payload: dtos.TransferFundsDto,
    id: string
  ): Promise<BadException | string>;
  withdrawFunds(
    payload: dtos.WithdrawFundsDto,
    id: string
  ): Promise<BadException | string>;
}

export class UserServiceImpl implements UserServices {
  public accountFunding = async (
    payload: dtos.AccountFundingDto,
    id: string
  ): Promise<BadException | string> => {
    const response = await userRepository.accountFunding(payload, id);
    return response;
  };

  public transferFunds = async (
    payload: dtos.TransferFundsDto,
    id: string
  ): Promise<BadException | string> => {
    const response = await userRepository.transferFunds(payload, id);
    return response;
  };

  public withdrawFunds = async (
    payload: dtos.WithdrawFundsDto,
    id: string
  ): Promise<BadException | string> => {
    const response = await userRepository.withdrawFunds(payload, id);
    return response;
  };
}

const CustomerServices = new UserServiceImpl();

export default CustomerServices;
