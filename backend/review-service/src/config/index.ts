import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3009,
  jwt: {
    secret: process.env.JWT_SECRET || "changeme"
  }
};
