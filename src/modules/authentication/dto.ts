import { BaseEntity } from "../../shared/utils/base-entity";


export class CreateUserAccountDto extends BaseEntity<CreateUserAccountDto> {
  first_name!: string;
  last_name!: string;
  email!: string;
  password!: string;
  user_name!: string;
  phone_number!: string;
  country_code!: string;
  terms_and_conditions!: boolean;
}

export class UserAccountLoginDto extends BaseEntity<UserAccountLoginDto> {
  email!: string;
  password!: string;
}