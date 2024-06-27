import { config } from "dotenv";
import { Knex } from "knex";

config();

const development: Knex.Config = {
  client: "mysql2",
  connection: {
    host: process.env.DEMOCREDIT_DEV_DATABASE_HOST || "127.0.0.1",
    port: Number(process.env.DEMOCREDIT_DEV_DATABASE_PORT) || 3306,
    user: process.env.DEMOCREDIT_DEV_DATABASE_USER || "root",
    password: process.env.DEMOCREDIT_DEV_DATABASE_PASSWORD || "",
    database: process.env.DEMOCREDIT_DEV_DATABASE_NAME || "democredit_dev",
  },
  migrations: {
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./seeds",
  },
};

const production: Knex.Config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./seeds",
  },
};

const knexConfig: { [key: string]: Knex.Config } = {
  development,
  production,
};

export { knexConfig };
