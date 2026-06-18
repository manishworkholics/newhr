import { env } from "../config/env.js";

export function errorHandler(err, _req, res, _next) {
  console.error(err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal server error",
    stack: env.nodeEnv === "production" ? undefined : err.stack
  });
}
