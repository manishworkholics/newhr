import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env"), override: true });
dotenv.config({ path: ".env" });

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
  "https://api.eventmax.in",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5185",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5185"
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
