// import "./env";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { sequelize } from "@lms/database";

import { config } from "./config";
import { logger } from "./utils/logger";
import { AppError } from "./utils/AppError";
import { errorHandler } from "./middlewares/error";
import courseRoutes from "./routes/course.routes";

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", { error: err });
  // process.exit(1); // Decide if we want to exit or stay alive. For now, stay alive to prevent crash.
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
});

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.get("/", (req, res) => {
  res.json({ service: "course-service" });
});

app.use("/courses", courseRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.path} not found`, 404));
});

app.use(errorHandler);

const port = config.port;

sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connected successfully");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(port, () => {
      logger.info(`Course service listening on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error("Failed to start course service", { error: err });
    process.exit(1);
  });
