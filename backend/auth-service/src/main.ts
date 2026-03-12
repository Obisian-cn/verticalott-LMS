import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { logger, AppError, fail, created, ok, validate } from "@lms/common/src";
import sequelize from "@lms/database/src/sequelize";
import { User } from "@lms/database/src/models/User";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

const accessTokenTtl = process.env.JWT_ACCESS_TTL || "15m";
const refreshTokenTtl = process.env.JWT_REFRESH_TTL || "30d";
const jwtSecret = process.env.JWT_SECRET || "changeme";

app.post(
  "/auth/signup",
  validate([
    body("name").isString().notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    body("role").optional().isIn(["student", "instructor", "admin"])
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, role } = req.body;
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        throw new AppError("Email already in use", 409);
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hash, role });

      const accessToken = jwt.sign(
        { sub: user.id, role: user.role },
        jwtSecret,
        { expiresIn: accessTokenTtl }
      );
      const refreshToken = jwt.sign(
        { sub: user.id, role: user.role, type: "refresh" },
        jwtSecret,
        { expiresIn: refreshTokenTtl }
      );

      return created(res, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        tokens: { accessToken, refreshToken }
      });
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  "/auth/login",
  validate([body("email").isEmail(), body("password").isString().notEmpty()]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) throw new AppError("Invalid credentials", 401);

      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new AppError("Invalid credentials", 401);

      const accessToken = jwt.sign(
        { sub: user.id, role: user.role },
        jwtSecret,
        { expiresIn: accessTokenTtl }
      );
      const refreshToken = jwt.sign(
        { sub: user.id, role: user.role, type: "refresh" },
        jwtSecret,
        { expiresIn: refreshTokenTtl }
      );

      return ok(res, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        tokens: { accessToken, refreshToken }
      });
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  "/auth/refresh",
  validate([body("refreshToken").isString().notEmpty()]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const decoded = jwt.verify(refreshToken, jwtSecret) as any;
      if (decoded.type !== "refresh") {
        throw new AppError("Invalid token type", 400);
      }

      const user = await User.findByPk(decoded.sub);
      if (!user) throw new AppError("User not found", 404);

      const accessToken = jwt.sign(
        { sub: user.id, role: user.role },
        jwtSecret,
        { expiresIn: accessTokenTtl }
      );

      return ok(res, { accessToken });
    } catch (err) {
      next(err);
    }
  }
);

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

const port = process.env.PORT || 3001;

sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    app.listen(port, () => {
      logger.info(`Auth service listening on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error("Failed to start auth service", { error: err });
    process.exit(1);
  });

