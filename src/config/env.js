import dotenv from "dotenv";

dotenv.config();

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const nodeEnv = process.env.NODE_ENV || "development";
const corsOrigin = process.env.CORS_ORIGIN || "";

if (nodeEnv === "production" && !corsOrigin) {
  throw new Error("Missing env var: CORS_ORIGIN (required in production)");
}

const env = Object.freeze({
  NODE_ENV: nodeEnv,
  PORT: Number(process.env.PORT || 5000),
  MONGODB_URI: required("MONGODB_URI"),
  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
  CORS_ORIGIN: corsOrigin,
  AWS_REGION: required("AWS_REGION"),
  AWS_S3_BUCKET: required("AWS_S3_BUCKET"),
  AWS_ACCESS_KEY_ID: required("AWS_ACCESS_KEY_ID"),
  AWS_SECRET_ACCESS_KEY: required("AWS_SECRET_ACCESS_KEY"),
});

export { env };
