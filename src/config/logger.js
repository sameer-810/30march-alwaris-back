import pino from "pino";
import { env } from "./env.js";
import { requestContext } from "../middlewares/requestContextProvider.js";

const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    env.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  mixin() {
    const store = requestContext.getStore();
    const reqId = store?.get("reqId");
    return reqId ? { reqId } : {};
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export { logger };
