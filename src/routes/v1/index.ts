import express from 'express';
import userRouter from '../../modules/users/routes';
import authRouter from '../../modules/authentication/routes';

const appRouter = express.Router();

appRouter.use('/auth', authRouter);
appRouter.use('/user', userRouter);

export const Router = appRouter;
