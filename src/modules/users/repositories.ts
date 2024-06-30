import * as dtos from "./dto";
import { connection } from "../../config/knex";
import { BadException } from "../../shared/lib/errors";
import loggerWrapper from "../../shared/log_wrapper";

export interface UserRepository {
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

export class UserRepositoryImpl implements UserRepository {
 

  private async updateTransactionTable(
    payload: dtos.CreateTransactionDto
  ): Promise<void> {
    try {
      await connection("transactions").insert({
        wallet_id: payload.wallet_id,
        user_id: payload.user_id,
        amount: payload.amount,
        sender_name: payload.sender_name,
        type: payload.type,
        created_at: new Date(),
        updated_at: new Date(),
      });
    } catch (error) {
      loggerWrapper.error(`Failed to update transaction table, ${error}`);
      throw new BadException(`Transaction update failed: ${error}`);
    }
  }

  private async updateTransferTransactionTable(
    payload: dtos.CreateTransferTransactionDto
  ): Promise<void> {
    try {
      await connection("transactions").insert({
        wallet_id: payload.wallet_id,
        user_id: payload.user_id,
        amount: payload.amount,
        sender_name: payload.sender_name,
        type: payload.type,
        recipient_wallet_name: payload.recipient_wallet_name,
        recipient_wallet_number: payload.recipient_wallet_number,
        created_at: new Date(),
        updated_at: new Date(),
      });
    } catch (error) {
      loggerWrapper.error(`Failed to update transaction table, ${error}`);
      throw new BadException(`Transaction update failed: ${error}`);
    }
  }

  private async getWalletByNumber(walletNumber: string) {
    try {
      const wallet = await connection("wallets")
        .where({ wallet_number: walletNumber })
        .first();
      return wallet;
    } catch (error) {
      loggerWrapper.error(`Failed to get wallet by number, ${error}`);
      throw new BadException(`Get wallet by number failed: ${error}`);
    }
  }

  public async accountFunding(
    payload: dtos.AccountFundingDto,
    id: string
  ): Promise<BadException | string> {
    const amount = Number(payload.amount);
    if (isNaN(amount)) {
      throw new BadException("Invalid amount provided for funding");
    }
    try {
      const walletExists = await connection("wallets")
        .where({ user_id: id, wallet_number: payload.wallet_number })
        .first();
      if (!walletExists) {
        throw new BadException(
          "Wallet number does not exist for the given user"
        );
      }
      const response = await connection("wallets")
        .where({ user_id: id, wallet_number: payload.wallet_number })
        .increment("balance", amount);

      if (response) {
        loggerWrapper.info(
          `Account  ${payload.wallet_number} funded successfully`
        );
        const transactionPayload: dtos.CreateTransactionDto = {
          wallet_id: walletExists.id,
          user_id: walletExists.user_id,
          amount: amount,
          sender_name: walletExists.wallet_name,
          type: "fund",
        };
        await this.updateTransactionTable(transactionPayload);
        return "Account funded successfully";
      } else {
        throw new Error("Account funding failed, no rows affected");
      }
    } catch (error) {
      loggerWrapper.error(`Failed to fund account ${id},${error}`);
      throw new BadException(`Wallet funding failed: ${error}`);
    }
  }

  public async transferFunds(
    payload: dtos.TransferFundsDto,
    id: string
  ): Promise<BadException | string> {
    const amount = Number(payload.amount);
    if (isNaN(amount)) {
      throw new BadException("Invalid amount provided for funding");
    }
    try {
      await connection.transaction(async (trx) => {
        const senderWallet = await trx("wallets")
          .where({ user_id: id })
          .first();

        if (senderWallet.balance < amount) {
          throw new Error("Insufficient funds");
        }

        await trx("wallets")
          .where({ user_id: id })
          .decrement("balance", amount);

        const receiverWallet = await this.getWalletByNumber(
          payload.wallet_number
        );

        if (!receiverWallet) {
          throw new BadException("Receiver wallet does not exist");
        }

        await trx("wallets")
          .where({ wallet_number: payload.wallet_number })
          .increment("balance", amount);

        const transactionPayload: dtos.CreateTransferTransactionDto = {
          wallet_id: senderWallet.id,
          user_id: senderWallet.user_id,
          amount: amount,
          sender_name: senderWallet.wallet_name,
          type: "transfer",
          recipient_wallet_name: receiverWallet.wallet_name,
          recipient_wallet_number: receiverWallet.wallet_number,
        };
        await this.updateTransferTransactionTable(transactionPayload);

        loggerWrapper.info(
          `Funds transfer to  ${payload.wallet_number}, by ${id}`
        );
      });

      return "Fund Transfer successfully";
    } catch (error) {
      loggerWrapper.error(`Failed to transfer funds ${id},${error}`);
      throw new BadException(`Funds Transfer failed: ${error}`);
    }
  }

  public async withdrawFunds(
    payload: dtos.WithdrawFundsDto,
    id: string
  ): Promise<BadException | string> {
    const amount = Number(payload.amount);
    if (isNaN(amount)) {
      throw new BadException("Invalid amount provided for funding");
    }
    try {
      await connection.transaction(async (trx) => {
        const userWallet = await trx("wallets").where({ user_id: id }).first();

        if (userWallet.balance < amount) {
          throw new Error("Insufficient funds");
        }

        await trx("wallets")
          .where({ user_id: id })
          .decrement("balance", amount);

        const transactionPayload: dtos.CreateTransactionDto = {
          wallet_id: userWallet.id,
          user_id: userWallet.user_id,
          amount: amount,
          sender_name: userWallet.wallet_name,
          type: "withdraw",
        };
        await this.updateTransactionTable(transactionPayload);

        loggerWrapper.info(`Funds withdrawal was successful ${id}`);
      });

      return "Fund Withdrawal successfully";
    } catch (error) {
      loggerWrapper.error(`Funds Withdrawal failed ${id},${error}`);
      throw new BadException(`Funds Withdrawal failed: ${error}`);
    }
  }

}

const userRepository = new UserRepositoryImpl();

export default userRepository;
