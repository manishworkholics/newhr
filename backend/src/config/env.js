import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI,
  clientUrls: (process.env.CLIENT_URL || "http://127.0.0.1:5173")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean)
};
