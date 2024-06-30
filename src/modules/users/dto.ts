import { BaseEntity } from '../../shared/utils/base-entity';

export class AccountFundingDto extends BaseEntity<AccountFundingDto> {
  amount!: number;
  wallet_number!: string;
}

export class TransferFundsDto extends BaseEntity<TransferFundsDto> {
  amount!: number;
  wallet_number!: string;
}


export class CreateTransactionDto extends BaseEntity<AccountFundingDto> {
  wallet_id!: string;
  user_id!: string;
  amount!: number;
  sender_name!: string;
  type!: "fund" | "transfer" | "withdraw";
  recipient_wallet_name?: string;
  recipient_wallet_number?: number;
}


export class WithdrawFundsDto extends BaseEntity<TransferFundsDto> {
  amount!: number;
}