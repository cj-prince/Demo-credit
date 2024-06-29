import { BaseEntity } from "../../shared/utils/base-entity";

export class UserEntity extends BaseEntity<UserEntity> {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  username?: string;
  created_at?: Date;
  updated_at?: Date;
}
