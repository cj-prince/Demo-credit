import knex from "knex";
import { knexConfig } from "./database";

const environment = process.env.NODE_ENV || "development";
const connection = knex(knexConfig[environment]);

const db = {
  connect: async () => {
    try {
      await connection.raw("SELECT 1+1 AS result");
      console.log("Database connection established");
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }
  },
  connection,
};

export { db };
