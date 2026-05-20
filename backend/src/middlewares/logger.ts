import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const method = req.method;
  const url = req.url;

  const time = new Date().toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  console.log(`[${time}] ${method} request to ${url}`);

  next();
};
