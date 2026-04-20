import { Router } from "express";

import employeeRoutes from "../modules/masters/employee/employee.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import customerTypeRoutes from "../modules/masters/customer-type/customer-type.routes.js";
import customerRoutes from "../modules/masters/customer/customer.routes.js";
import vesselRoutes from "../modules/masters/vessel/vessel.routes.js";
import portRoutes from "../modules/masters/port/port.routes.js";
import termsRoutes from "../modules/masters/terms/terms.routes.js";
import serviceRoutes from "../modules/masters/service/service.routes.js";
import shipmentRoutes from "../modules/masters/shipment/shipment.routes.js";
import lineOfBixRoutes from "../modules/masters/line-of-bix/line-of-bix.routes.js";
import termsConditionRoutes from "../modules/masters/terms-condition/terms-condition.routes.js";
import tariffDescriptionRoutes from "../modules/masters/tariff-description/tariff-description.routes.js";
import vendorAgentRoutes from "../modules/masters/vendor-agent/vendor-agent.routes.js";
import vendorTypeRoutes from "../modules/masters/vendor-type/vendor-type.routes.js";
import bookingRoutes from "../modules/booking/booking.routes.js";
import billOfLadingRoutes from "../modules/bill-of-lading/bill-of-lading.routes.js";
import vendorDocumentsRoutes from "../modules/vendor-documents/vendor-documents.routes.js";
import costSheetRoutes from "../modules/cost-sheet/cost-sheet.routes.js";
import invoiceRoutes from "../modules/invoice/invoice.routes.js";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/employees", employeeRoutes);
routes.use("/customer-types", customerTypeRoutes);
routes.use("/customers", customerRoutes);
routes.use("/vessels", vesselRoutes);
routes.use("/ports", portRoutes);
routes.use("/terms", termsRoutes);
routes.use("/services", serviceRoutes);
routes.use("/shipments", shipmentRoutes);
routes.use("/line-of-bix", lineOfBixRoutes);
routes.use("/terms-conditions", termsConditionRoutes);
routes.use("/tariff-descriptions", tariffDescriptionRoutes);
routes.use("/vendor-types", vendorTypeRoutes);
routes.use("/vendor-agents", vendorAgentRoutes);
routes.use("/bookings", bookingRoutes);
routes.use("/bill-of-lading", billOfLadingRoutes);
routes.use("/vendor-documents", vendorDocumentsRoutes);
routes.use("/cost-sheets", costSheetRoutes);
routes.use("/invoices", invoiceRoutes);

export default routes;
