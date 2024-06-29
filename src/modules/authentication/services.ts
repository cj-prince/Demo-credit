import * as dtos from "./dto";
import { connection } from "../../config/knex";
import hashingService, { HashingService } from "../../shared/hashing";
import * as entities from "./entities";
import * as message from "../../shared/lib/message";
import {
  BadException
} from "../../shared/lib/errors";

export interface AuthenticationServiceInterface {
  CreateUserAccount(payload: dtos.CreateUserAccountDto): Promise<string>;
  UserAccountLogin(
    payload: dtos.UserAccountLoginDto
  ): Promise<BadException | entities.UserEntity>;
}

export class AuthenticationServiceImpl implements AuthenticationServiceInterface {
  constructor(private readonly hashingService: HashingService) {}

  public CreateUserAccount = async (
    payload: dtos.CreateUserAccountDto
  ): Promise<string> => {
    const hashed = await this.hashingService.hash(payload.password);
    payload.password = hashed;

    await connection("users").insert(payload);
    return "User account created successfully";
  };

  public UserAccountLogin = async (
    payload: dtos.UserAccountLoginDto
  ): Promise<BadException | entities.UserEntity> => {
    const { email } = payload;
    const user = await connection("users").where({ email }).first();

    if (!user) {
      return new BadException(message.INVALID_INPUT("login"));
    }

    const response: entities.UserEntity = new entities.UserEntity({
      id: user.id,
      email: user.email,
      username: user.user_type,
      password: user.password,
      first_name: user.first_name,
      last_name: user.last_name,
    });

    return response;
  };
}

const AuthenticationServices = new AuthenticationServiceImpl(hashingService);

export default AuthenticationServices;
