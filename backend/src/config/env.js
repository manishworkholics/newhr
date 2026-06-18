import dotenv from "dotenv";

dotenv.config();

const clientUrls = (process.env.CLIENT_URL || "http://127.0.0.1:5173")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const localOriginRegex = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https?:\/\/192\.168\.\d+\.\d+(:\d+)?$/
];

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI,
  clientUrls,
  localOriginRegex
};
