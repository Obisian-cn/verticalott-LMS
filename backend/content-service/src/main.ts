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
import contentRoutes from "./routes/content.routes";
import lessonRoutes from "./modules/lessons/lesson.routes";
import videoRoutes from "./modules/videos/video.routes";

const app = express();

import path from "path";

app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve uploads folder
app.use("/content/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.get("/", (req, res) => {
  res.json({ service: "content-service" });
});

// Better to just mount the router at root since it defines full paths
app.use("/content", contentRoutes);
app.use("/lesson", lessonRoutes);
app.use("/videos", videoRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.path} not found`, 404));
});

app.use(errorHandler);

const port = config.port;

sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connected successfully");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(port, () => {
      logger.info(`Content service listening on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error("Failed to start content service", { error: err });
    process.exit(1);
  });
