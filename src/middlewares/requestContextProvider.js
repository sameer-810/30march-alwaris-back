import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

export const requestContext = new AsyncLocalStorage();

export function requestContextProvider(req, res, next) {
  let reqId = req.headers["x-request-id"] || req.headers["x-correlation-id"];

  if (!reqId) {
    reqId = randomUUID();
  }

  // Ensure it's passed downstream in responses to the client
  res.setHeader("X-Request-Id", reqId);
  req.id = reqId; // Expose on req natively so pinoHttp or other middlewares can see it easily

  const store = new Map();
  store.set("reqId", reqId);

  requestContext.run(store, () => {
    next();
  });
}
