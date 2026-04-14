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

import employeeRoutes from "./modules/masters/employee/employee.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import customerTypeRoutes from "./modules/masters/customer-type/customer-type.routes.js";
import customerRoutes from "./modules/masters/customer/customer.routes.js";
import vesselRoutes from "./modules/masters/vessel/vessel.routes.js";
import portRoutes from "./modules/masters/port/port.routes.js";
import termsRoutes from "./modules/masters/terms/terms.routes.js";
import serviceRoutes from "./modules/masters/service/service.routes.js";
import shipmentRoutes from "./modules/masters/shipment/shipment.routes.js";
import lineOfBixRoutes from "./modules/masters/line-of-bix/line-of-bix.routes.js";
import termsConditionRoutes from "./modules/masters/terms-condition/terms-condition.routes.js";
import tariffDescriptionRoutes from "./modules/masters/tariff-description/tariff-description.routes.js";
import vendorAgentRoutes from "./modules/masters/vendor-agent/vendor-agent.routes.js";
import vendorTypeRoutes from "./modules/masters/vendor-type/vendor-type.routes.js";
import bookingRoutes from "./modules/booking/booking.routes.js";
import billOfLadingRoutes from "./modules/bill-of-lading/bill-of-lading.routes.js";
import vendorDocumentsRoutes from "./modules/vendor-documents/vendor-documents.routes.js";

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

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/employees", employeeRoutes);
app.use("/api/v1/customer-types", customerTypeRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/vessels", vesselRoutes);
app.use("/api/v1/ports", portRoutes);
app.use("/api/v1/terms", termsRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/shipments", shipmentRoutes);
app.use("/api/v1/line-of-bix", lineOfBixRoutes);
app.use("/api/v1/terms-conditions", termsConditionRoutes);
app.use("/api/v1/tariff-descriptions", tariffDescriptionRoutes);
app.use("/api/v1/vendor-types", vendorTypeRoutes);
app.use("/api/v1/vendor-agents", vendorAgentRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/bill-of-lading", billOfLadingRoutes);
app.use("/api/v1/vendor-documents", vendorDocumentsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
