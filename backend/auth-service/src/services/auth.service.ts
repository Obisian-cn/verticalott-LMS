import jwt from "jsonwebtoken";
import { User } from "../models";
import { AppError } from "../utils/AppError";
import { config } from "../config";
import { firebaseAdmin } from "../utils/firebase";

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

  public async login(token: string) {
    if (!token) throw new AppError("Firebase token is required", 400);

    let decodedToken;
    try {
      decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    } catch (err: any) {
      console.error("Firebase verify fail:", err);
      throw new AppError("Invalid or expired Firebase token", 401);
    }

    const { phone_number, uid } = decodedToken;
    if (!uid) {
      throw new AppError("UID missing from Firebase token", 400);
    }
    const safePhoneNumber = phone_number || uid;

    try {
      let user = await User.findOne({ where: { firebaseUid: uid } });

      if (!user) {
        user = await User.create({
          name: safePhoneNumber,
          phoneNumber: safePhoneNumber,
          firebaseUid: uid,
          role: "student"
        });
      }

      const tokens = this.generateTokens(user.id, user.role);

      return {
        user: { 
          id: user.id, 
          name: user.name, 
          role: user.role, 
          phoneNumber: user.phoneNumber, 
          firebaseUid: user.firebaseUid 
        },
        tokens
      };
    } catch (error: any) {
      console.error("Database query error in login:", error);
      throw new AppError("Failed to login due to database issue", 500);
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
