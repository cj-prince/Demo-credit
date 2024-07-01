import { Request, Response, NextFunction } from "express";
import { connection } from "../../config/knex";
import loggerWrapper from "../../shared/log_wrapper";
import * as ApiResponse from "../../shared/lib/api-response";
import * as Enum from "../../shared/lib/message";
import { StatusCodes } from "http-status-codes";
import axios from "axios";
import Env from "../../shared/utils/env";

export const checkIfUserNameExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username } = req.body;

  try {
    const data = await connection("users").where({ username }).first();

    if (!data) {
      return next();
    }

    loggerWrapper.info(`${username} already exists in middleware.auth.ts`);
    ApiResponse.error(
      res,
      { message: Enum.RESOURCE_ALREADY_EXISTS(`${username}`) },
      StatusCodes.BAD_REQUEST
    );
  } catch (error) {
    loggerWrapper.error(
      `${error}: Error occurred while checking username in middleware.auth.ts`
    );
    ApiResponse.DB_error(res);
  }
};

export const checkIfPhoneNumberIsAlreadyUsed = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { phone_number } = req.body;

  try {
    const data = await connection("users").where({ phone_number }).first();

    if (!data) {
      return next();
    }

    loggerWrapper.error(`${phone_number} does exist in middleware.auth.ts`);
    ApiResponse.error(
      res,
      { message: Enum.RESOURCE_ALREADY_EXISTS(`${phone_number}`) },
      StatusCodes.CONFLICT
    );
  } catch (error) {
    loggerWrapper.error(
      `${error}: Error occurred while checking phone number in middleware.auth.ts`
    );
    ApiResponse.DB_error(res);
  }
};

export const checkIfRegisterEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;

  try {
    const emailExists = await connection("users").where({ email }).first();

    if (emailExists) {
      ApiResponse.error(
        res,
        { message: Enum.RESOURCE_ALREADY_EXISTS(`${email}`) },
        StatusCodes.BAD_REQUEST
      );
    } else {
      return next();
    }
  } catch (error) {
    loggerWrapper.error(
      `${error}: Error occurred while checking email in middleware.auth.ts`
    );
    ApiResponse.DB_error(res);
  }
};


export const checkBlacklist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (Env.get<string>("NODE_ENV") === "test") return next();
  const { email } = req.body;
  try {
    const response = await axios({
      method: "GET",
      maxBodyLength: Infinity,
      url: `https://adjutor.lendsqr.com/v2/verification/karma/${email}`,
      headers: {
        Authorization: `Bearer ${Env.get<string>("KARMA_API_KEY")}`,
      },
    });

    if (response.status === 200) {
      loggerWrapper.error(
        `${email}: User is blacklisted in middleware.auth.ts`
      );

      res.status(403).send("Account opening failed, contact admin");
      return;
    }

    next();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 404) {
        next();
      } else {
        loggerWrapper.error(
          `${error}: Error occurred while checking blacklist in middleware.auth.ts`
        );
        res.status(500).send("Internal Server Error");
      }
    } else {
      loggerWrapper.error(
        `${error}: Non-Axios error occurred while checking blacklist in middleware.auth.ts`
      );
      res.status(500).send("Internal Server Error");
    }
  }
};