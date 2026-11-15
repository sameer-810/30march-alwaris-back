import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { logger } from "./config/logger.js";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import { sendSuccess } from "./utils/response.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";

import { requestContextProvider } from "./middlewares/requestContextProvider.js";

const app = express();

const corsOrigin = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : env.NODE_ENV === "production"
    ? []
    : true;

app.disable("x-powered-by");
// Render terminates TLS at one proxy hop; without this every user shares the proxy IP for rate limiting.
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(requestContextProvider);
app.use(pinoHttp({ logger, autoLogging: true, genReqId: (req) => req.id }));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

app.get("/health", (_req, res) =>
  sendSuccess(res, {
    data: { status: "ok" },
  }),
);

app.use("/api/v1", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
