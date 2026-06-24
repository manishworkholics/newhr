import dotenv from "dotenv";

dotenv.config({ path: ".env", override: true });

function normalizeOrigin(url) {
  try {
    return new URL(url).origin;
  } catch {
    return String(url || "").replace(/\/+$/, "");
  }
}

const defaultClientUrls = [
  "https://eventmax.in",
  "https://www.eventmax.in",
  "https://admin.eventmax.in",
  "https://api.eventmax.in"
];

const clientUrls = (process.env.CLIENT_URL || defaultClientUrls.join(","))
  .split(",")
  .map((url) => normalizeOrigin(url.trim()))
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
  jwtSecret: process.env.JWT_SECRET || "change-this-eventmax-admin-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  clientUrls,
  localOriginRegex
};
