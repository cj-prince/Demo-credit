import { configDotenv } from 'dotenv';
configDotenv();

const development = {
  NODE_ENV: process.env.DEMOCREDIT_NODE_ENV,
  PORT: process.env.DEMOCREDIT_PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  DEMOCREDIT_DEV_DATABASE_HOST: process.env.DEMOCREDIT_DEV_DATABASE_HOST,
  DEMOCREDIT_DEV_DATABASE_PORT: process.env.DEMOCREDIT_DEV_DATABASE_PORT,
  DEMOCREDIT_DEV_DATABASE_USER: process.env.DEMOCREDIT_DEV_DATABASE_USER,
  DEMOCREDIT_DEV_DATABASE_NAME: process.env.DEMOCREDIT_DEV_DATABASE_NAME,
  DEMOCREDIT_DEV_DATABASE_PASSWORD:
    process.env.DEMOCREDIT_DEV_DATABASE_PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET,
  CRYPTO_SECRET: process.env.DEMOCREDIT_DEV_CRYPTO_SECRET,
  CRYPTO_TIME_STEP: process.env.DEMOCREDIT_DEV_CRYPTO_TIME_STEP,
  CRYPTO_OTP_LENGTH: process.env.DEMOCREDIT_DEV_CRYPTO_OTP_LENGTH,
  CRYPTO_HASH_ALGO: process.env.DEMOCREDIT_DEV_CRYPTO_HASH_ALGO,
  SALT_ROUND: process.env.DEMOCREDIT_DEV_SALT_ROUND,
};

export default development;
