import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

export const ok = <T>(res: Response, data: T, status = 200): Response<ApiResponse<T>> =>
  res.status(status).json({ success: true, data });

export const created = <T>(res: Response, data: T): Response<ApiResponse<T>> =>
  res.status(201).json({ success: true, data });

export const fail = (res: Response, status: number, message: string, details?: unknown) =>
  res.status(status).json({
    success: false,
    error: { message, details }
  });

