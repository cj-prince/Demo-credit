import { configDotenv } from 'dotenv';
configDotenv();

const test = {
  NODE_ENV: process.env.DEMOCREDIT_NODE_ENV,
  PORT: process.env.DEMOCREDIT_PORT,
  DATABASE_URL: process.env.DEMOCREDIT_TEST_DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};

export default test;
