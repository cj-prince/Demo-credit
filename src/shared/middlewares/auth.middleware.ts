import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { SignedData, User } from "../interface";
import * as message from "../lib/message";
import jwtSigningService from "../jwt";

export const verifyAuthTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = (req?.headers?.authorization as string)?.split(" ")[1];
  if (!token) {
    return res.status(400).json({
      status: "error",
      statusCode: StatusCodes.BAD_REQUEST,
      message: message.RESOURCE_NOT_FOUND("auth token"),
    });
  }

  try {
    const decoded = jwtSigningService.verify(token) as SignedData;
    req.user = decoded as User;
    return next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      statusCode: StatusCodes.UNAUTHORIZED,
      message: `invalid token`,
    });
  }
};
