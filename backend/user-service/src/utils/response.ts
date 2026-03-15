import { Response } from "express";

export const sendResponse = (res: Response, statusCode: number, success: boolean, data: any = null, message: string = "", details: any = null) => {
  const payload: any = { success };
  if (data) payload.data = data;
  if (message) payload.message = message;
  if (details) payload.details = details;
  return res.status(statusCode).json(payload);
};

export const ok = (res: Response, data?: any, message: string = "Success") =>
  sendResponse(res, 200, true, data, message);

export const fail = (res: Response, statusCode: number, message: string, details?: any) =>
  sendResponse(res, statusCode, false, null, message, details);
