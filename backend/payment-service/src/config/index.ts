import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3007,
  jwt: {
    secret: process.env.JWT_SECRET || "changeme"
  },
  cashfree: {
    appId: process.env.CASHFREE_APP_ID || "",
    secretKey: process.env.CASHFREE_SECRET_KEY || "",
    webhookSecret: process.env.CASHFREE_WEBHOOK_SECRET || "",
    env: process.env.CASHFREE_ENV || "SANDBOX",
    webhookUrl: process.env.CASHFREE_WEBHOOK_URL || "https://playstori.southindia.cloudapp.azure.com/lms/api/payments/webhook",
  }
};
