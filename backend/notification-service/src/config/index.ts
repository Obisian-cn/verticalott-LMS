import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3010,
  jwt: {
    secret: process.env.JWT_SECRET || "changeme"
  }
};
