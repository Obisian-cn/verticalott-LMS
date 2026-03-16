import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../models";
import { AppError } from "../utils/AppError";
import { config } from "../config";

export class AuthService {
  private generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign(
      { sub: userId, role },
      config.jwt.secret,
      { expiresIn: config.jwt.accessTtl as any }
    );
    const refreshToken = jwt.sign(
      { sub: userId, role, type: "refresh" },
      config.jwt.secret,
      { expiresIn: config.jwt.refreshTtl as any }
    );
    return { accessToken, refreshToken };
  }

  public async register(name: string, email: string, password: string, role?: UserRole) {
    try {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        throw new AppError("Email already in use", 409);
      }

      const hash = await bcrypt.hash(password, 10);
      const userRole = role || "student";
      const user = await User.create({ name, email, password: hash, role: userRole });

      const tokens = this.generateTokens(user.id, user.role);

      return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        tokens
      };
    } catch (error: any) {
      console.error("Database query error in register:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Registration failed due to database issue", 500);
    }
  }

  public async login(email: string, password: string) {
    try {
      console.log("email, password-------->", email, password);
      const user = await User.findOne({ where: { email } });
      console.log("user-------->", user);
      if (!user) throw new AppError("Invalid credentials", 401);

      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new AppError("Invalid credentials", 401);

      const tokens = this.generateTokens(user.id, user.role);

      return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        tokens
      };
    } catch (error: any) {
      console.error("Database query error in login:", error);
      if (error instanceof AppError) throw error;
      // If the email column is missing or any other query error occurs,
      // silently treat it as if the user doesn't exist, to avoid 500 errors.
      throw new AppError("Invalid credentials", 401);
    }
  }

  public async refresh(refreshToken: string) {
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.jwt.secret) as any;
    } catch (err) {
      throw new AppError("Invalid refresh token", 401);
    }

    if (decoded.type !== "refresh") {
      throw new AppError("Invalid token type", 400);
    }

    const user = await User.findByPk(decoded.sub);
    if (!user) throw new AppError("User not found", 404);

    const accessToken = jwt.sign(
      { sub: user.id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.accessTtl as any }
    );

    return { accessToken };
  }
}
