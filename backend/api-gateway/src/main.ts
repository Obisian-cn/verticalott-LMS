import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";
import { logger, AppError, fail } from "@lms/common";

const app = express();

app.use(helmet());
app.use(cors());

// We remove express.json() here because it interferes with http-proxy-middleware for POST/PUT requests
// The individual services will parse the JSON bodies.

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// For local development assuming localhost if env vars not set
const services: Record<string, string> = {
  auth: process.env.AUTH_SERVICE_URL || "http://127.0.0.1:3001",
  users: process.env.USER_SERVICE_URL || "http://127.0.0.1:3002",
  courses: process.env.COURSE_SERVICE_URL || "http://127.0.0.1:3003",
  content: process.env.CONTENT_SERVICE_URL || "http://127.0.0.1:3004",
  videos: process.env.VIDEO_SERVICE_URL || "http://127.0.0.1:3005",
  enrollments: process.env.ENROLLMENT_SERVICE_URL || "http://127.0.0.1:3006",
  payments: process.env.PAYMENT_SERVICE_URL || "http://127.0.0.1:3007",
  progress: process.env.PROGRESS_SERVICE_URL || "http://127.0.0.1:3008",
  reviews: process.env.REVIEW_SERVICE_URL || "http://127.0.0.1:3009",
  notifications: process.env.NOTIFICATION_SERVICE_URL || "http://127.0.0.1:3010"
};

const createServiceProxy = (target: string) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    // we do not authenticate here, individual services manage their own authentication
    logProvider: () => ({
      log: logger.info.bind(logger),
      debug: logger.debug.bind(logger),
      info: logger.info.bind(logger),
      warn: logger.warn.bind(logger),
      error: logger.error.bind(logger)
    })
  });
};

app.use("/auth", createServiceProxy(services.auth));
app.use("/users", createServiceProxy(services.users));
app.use("/courses", createServiceProxy(services.courses));
app.use("/content", createServiceProxy(services.content));
app.use("/lesson", createServiceProxy(services.content));

app.use("/videos", createServiceProxy(services.content));
app.use("/enrollments", createServiceProxy(services.enrollments));
app.use("/payments", createServiceProxy(services.payments));
app.use("/progress", createServiceProxy(services.progress));
app.use("/reviews", createServiceProxy(services.reviews));
app.use("/notifications", createServiceProxy(services.notifications));

app.use((req, _res, next) => {
  next(new AppError(`Route ${req.method} ${req.path} not found`, 404));
});

app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      logger.warn(err.message, { statusCode: err.statusCode, details: err.details });
      return fail(res, err.statusCode, err.message, err.details);
    }
    logger.error("Unhandled error", { error: err });
    return fail(res, 500, "Internal server error");
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`API Gateway listening on port ${port}`);
});
