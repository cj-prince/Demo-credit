import { Router } from 'express';
import authenticationController from "./controller";
import * as authenticationMiddleware from "./middleware";
import * as validators from './validator';
import { WatchAsyncController } from '../../shared/utils/watch-async-controller';
import { validateDataMiddleware } from "../../shared/middlewares/request-validator.middleware";

const authRouter = Router();

authRouter.post(
  "/register",
  validateDataMiddleware(validators.registerValidatorSchema, "body"),
  authenticationMiddleware.checkIfRegisterEmailExists,
  authenticationMiddleware.checkIfPhoneNumberIsAlreadyUsed,
  authenticationMiddleware.checkIfUserNameExist,
  WatchAsyncController(authenticationController.createUserAccount)
);

authRouter.post(
  "/login",
  validateDataMiddleware(validators.loginSchema, "body"),
  WatchAsyncController(authenticationController.UserAccountLogin)
);

export default authRouter;
