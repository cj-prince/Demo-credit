require("ts-node/register");

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      database: process.env.DEMOCREDIT_DEV_DATABASE_NAME,
      user: process.env.DEMOCREDIT_DEV_DATABASE_USER ,
      password: process.env.DEMOCREDIT_DEV_DATABASE_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./seeds",
      extension: "ts",
    },
  },

  testing: {
    client: "mysql2",
    connection: {
      database:
        process.env.DEMOCREDIT_DEV_DATABASE_NAME,
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
    },
    seeds: {
      directory: "./seeds",
      extension: "ts",
    },
  },

  production: {
    client: "mysql2",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./seeds",
      extension: "ts",
    },
  },
};
