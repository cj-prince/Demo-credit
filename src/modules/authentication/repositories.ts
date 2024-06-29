import * as dtos from "./dto";
import { connection } from "../../config/knex";
import * as message from "../../shared/lib/message";
import { BadException } from "../../shared/lib/errors";
import loggerWrapper from "../../shared/log_wrapper";
import * as entities from "./entities";

export interface AuthenticationRepository {
  createUserAccount(
    payload: dtos.CreateUserAccountDto,
    walletNumber: string,
    walletName: string
  ): Promise<BadException | void>;
}

export class AuthenticationRepositoryImpl implements AuthenticationRepository {
  public async createUserAccount(
    payload: dtos.CreateUserAccountDto,
    walletNumber: string,
    walletName: string
  ): Promise<BadException | void> {
    return await connection.transaction(async (trx) => {
      try {
        await this.createUser(payload);
        const user_id = await this.fetchUser(payload.email);
        await this.createUserWallet(walletNumber, walletName, user_id);
      } catch (error) {
        await trx.rollback();
        loggerWrapper.error("Transaction failed: ", error);
        throw new BadException(message.INVALID_INPUT("Signup"));
      }
    });
  }

  private async createUser(
    payload: dtos.CreateUserAccountDto
  ): Promise<BadException | void> {
    await connection("users").insert(payload);
  }

  private async fetchUser(payload: string): Promise<string> {
    const user = await connection("users").where({ email: payload }).first();
    return user.id;
  }
  private async createUserWallet(
    walletNumber: string,
    walletName: string,
    user_id: string
  ): Promise<BadException | number> {
    try {
      const [walletId] = await connection("wallets").insert({
        wallet_number: walletNumber,
        wallet_name: walletName,
        user_id: user_id,
      });
      return walletId;
    } catch (err) {
      loggerWrapper.error("Wallet creation failed: ", err);
      throw new BadException(`Wallet creation failed: ${err}`);
    }
  }

  public async userAccountLogin(
    payload: dtos.UserAccountLoginDto
  ): Promise<BadException | entities.UserEntity> {
    const { email } = payload;
    const user = await connection("users").where({ email }).first();
    if (!user) {
      return new BadException(message.OPERATION_FAILED("login"));
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
  }
}

const customerRepository = new AuthenticationRepositoryImpl();

export default customerRepository;
