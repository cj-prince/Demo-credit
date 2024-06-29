require("ts-node/register");
const { config } = require("dotenv");
config();

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DEMOCREDIT_DEV_DATABASE_HOST,
      database: process.env.DEMOCREDIT_DEV_DATABASE_NAME,
      user: process.env.DEMOCREDIT_DEV_DATABASE_USER,
      password: process.env.DEMOCREDIT_DEV_DATABASE_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "migrations",
      extension: "ts",
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
      extension: "ts",
    },
  },

  testing: {
    client: "mysql2",
    connection: {
      host: process.env.DEMOCREDIT_TEST_DATABASE_HOST,
      database:
        process.env.DEMOCREDIT_TEST_DATABASE_NAME,
      user: process.env.DEMOCREDIT_TEST_DATABASE_USER,
      password: process.env.DEMOCREDIT_TEST_DATABASE_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "migrations",
      extension: "ts",
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
      extension: "ts",
    },
  },

  production: {
    client: "mysql2",
    connection: {
      host: process.env.PROD_DATABASE_HOST,
      database: process.env.PROD_DATABASE_NAME,
      user: process.env.PROD_DATABASE_USER,
      password: process.env.PROD_DATABASE_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "migrations",
      extension: "ts",
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
      extension: "ts",
    },
  },
};
