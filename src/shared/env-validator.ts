import Joi from 'joi';
import { AppEnv } from './enums';

export interface EnvProps {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
}

export const envValidatorSchema = Joi.object<EnvProps>({
  PORT: Joi.number().default(8000),

  NODE_ENV: Joi.string()
    .required()
    .valid(AppEnv.DEVELOPMENT, AppEnv.TEST, AppEnv.PRODUCTION)
    .default(AppEnv.DEVELOPMENT),

  DATABASE_URL: Joi.string().required(),
  
}).unknown(true);
