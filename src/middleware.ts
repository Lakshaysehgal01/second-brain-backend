import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const userMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  const decode = jwt.verify(header as string, process.env.JWT_SECRET);
  if (decode) {
    //@ts-ignore
    req.userId = decode.id;
    next();
    return;
  } else {
    res.status(403).json({
      message: "You are not logged in",
    });
  }
};


