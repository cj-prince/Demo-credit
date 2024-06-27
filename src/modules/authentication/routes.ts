import { Router } from 'express';
// import authController from './controller';
import * as validators from './validator';
// import { WatchAsyncController } from '../../shared/utils/watch-async-controller';
import { validateDataMiddleware } from "../../shared/middlewares/request-validator.middleware";

const authRouter = Router();

authRouter.post(
  "/register",
  
);

authRouter.post(
  "/verify-otp",
  validateDataMiddleware(validators.otpSchema, 'body'),
);

authRouter.post(
  "/login",
  validateDataMiddleware(validators.loginSchema, 'body'),
);

export default authRouter;
