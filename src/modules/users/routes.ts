import { Router } from 'express';
import userController from './controller';
import * as validators from "./validator";
import { WatchAsyncController } from '../../shared/utils/watch-async-controller';
import { validateDataMiddleware } from "../../shared/middlewares/request-validator.middleware";
import * as AuthenticationMiddleware from "../../shared/middlewares/auth.middleware";

const userRouter = Router();

userRouter.post(
  "/fund",
  AuthenticationMiddleware.verifyAuthTokenMiddleware,
  validateDataMiddleware(validators.fundAccountPayloadValidatorSchema, "body"),
  WatchAsyncController(userController.accountFunding)
);

userRouter.post(
  "/transfer",
  AuthenticationMiddleware.verifyAuthTokenMiddleware,
  validateDataMiddleware(
    validators.transferFundAccountPayloadValidatorSchema,
    "body"
  ),
  WatchAsyncController(userController.transferFunds)
);

userRouter.post(
  "/withdraw",
  AuthenticationMiddleware.verifyAuthTokenMiddleware,
  validateDataMiddleware(validators.withdrawFundPayloadValidatorSchema, "body"),
  WatchAsyncController(userController.withdrawFunds)
);

export default userRouter;
