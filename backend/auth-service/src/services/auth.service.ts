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
  }

  public async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError("Invalid credentials", 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AppError("Invalid credentials", 401);

    const tokens = this.generateTokens(user.id, user.role);

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      tokens
    };
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
