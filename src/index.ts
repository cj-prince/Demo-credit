import http from "http";
import { Express } from "express";
import app from "./config/express";
import Env from "./shared/utils/env";
import Logger from "./config/logger";
import {connection} from "./config/knex"; 
import { AppEnv } from "./shared/enums";
import { envValidatorSchema } from "./shared/env-validator";

async function main(app: Express): Promise<void> {
  const logger = new Logger(app.name);

  // run the following before initializing App function
  await Env.validateEnv(envValidatorSchema);

  // database connection check

  try {
    await connection.raw("SELECT 1+1 AS result");
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }

  const server = http.createServer(app);

  const PORT = Env.get<number>("PORT") || 5000;
  const NODE_ENV = Env.get<string>("NODE_ENV");

  NODE_ENV !== AppEnv.PRODUCTION &&
    server.on("listening", () => {
      logger.log(`Listening on http://localhost:${PORT}`);
    });

  server.listen(PORT);
}

main(app);
