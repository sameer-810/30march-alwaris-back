const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const pinoHttp = require("pino-http");
const { logger } = require("./config/logger");
const rateLimit = require("express-rate-limit");

const { env } = require("./config/env");
const { sendSuccess } = require("./utils/response");
const { notFoundHandler } = require("./middlewares/notFoundHandler");
const { errorHandler } = require("./middlewares/errorHandler");

const employeeRoutes = require("./modules/masters/employee/employee.routes");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/user/user.routes");
const customerTypeRoutes = require("./modules/masters/customer-type/customer-type.routes");
const customerRoutes = require("./modules/masters/customer/customer.routes");
const vesselRoutes = require("./modules/masters/vessel/vessel.routes");
const portRoutes = require("./modules/masters/port/port.routes");
const termsRoutes = require("./modules/masters/terms/terms.routes");
const serviceRoutes = require("./modules/masters/service/service.routes");
const shipmentRoutes = require("./modules/masters/shipment/shipment.routes");
const lineOfBixRoutes = require("./modules/masters/line-of-bix/line-of-bix.routes");
const termsConditionRoutes = require("./modules/masters/terms-condition/terms-condition.routes");
const tariffDescriptionRoutes = require("./modules/masters/tariff-description/tariff-description.routes");
const vendorAgentRoutes = require("./modules/masters/vendor-agent/vendor-agent.routes");
const vendorTypeRoutes = require("./modules/masters/vendor-type/vendor-type.routes");
const bookingRoutes = require("./modules/booking/booking.routes");
const billOfLadingRoutes = require("./modules/bill-of-lading/bill-of-lading.routes");
const vendorDocumentsRoutes = require("./modules/vendor-documents/vendor-documents.routes");

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
app.use(pinoHttp({ logger, autoLogging: true }));
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

module.exports = app;
