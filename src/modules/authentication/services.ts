import * as dtos from "./dto";
import authenticationRepository from "./repositories";
import hashingService, { HashingService } from "../../shared/hashing";
import * as entities from "./entities"
import { BadException } from "../../shared/lib/errors";
import { generateRandomNumber } from "../../shared/helpers";

export interface AuthenticationServiceInterface {
  createUserAccount(payload: dtos.CreateUserAccountDto): Promise<void>;
  userAccountLogin(
    payload: dtos.UserAccountLoginDto
  ): Promise<BadException | entities.UserEntity>;
}

export class AuthenticationServiceImpl
  implements AuthenticationServiceInterface
{
  constructor(private readonly hashingService: HashingService) {}

  public createUserAccount = async (
    payload: dtos.CreateUserAccountDto
  ): Promise<void> => {
    const hashed = await this.hashingService.hash(payload.password);
    payload.password = hashed;
    const walletNumber = await generateRandomNumber();
    const walletName = `${payload.first_name} ${payload.last_name}`;
    await authenticationRepository.createUserAccount(
      payload,
      walletNumber,
      walletName
    );

    // return response;
  };

  public userAccountLogin = async (
    payload: dtos.UserAccountLoginDto
  ): Promise<BadException | entities.UserEntity> => {
    const response = await authenticationRepository.userAccountLogin(payload);

    return response;
  };
}

const AuthenticationServices = new AuthenticationServiceImpl(hashingService);

export default AuthenticationServices;
