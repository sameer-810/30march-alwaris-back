const { z } = require("zod");
const {
  buildMasterListQuerySchema,
  createMasterCrudSchemas,
} = require("../shared/masterValidationHelpers");

const shipmentBodyCreateSchema = z.object({
  shipmentType: z.string().trim().min(1, "Shipment Type is required"),
});

const shipmentBodyUpdateSchema = z.object({
  shipmentType: z.string().trim().min(1).optional(),
});

const shipmentListQuerySchema = buildMasterListQuerySchema({
  sortByEnum: z.enum(["createdAt", "shipmentType", "code"]),
});

const {
  createSchema: shipmentCreateSchema,
  updateSchema: shipmentUpdateSchema,
  getSchema: shipmentGetSchema,
  deleteSchema: shipmentDeleteSchema,
  listSchema: shipmentListSchema,
} = createMasterCrudSchemas({
  createBodySchema: shipmentBodyCreateSchema,
  updateBodySchema: shipmentBodyUpdateSchema,
  listQuerySchema: shipmentListQuerySchema,
});

module.exports = {
  shipmentCreateSchema,
  shipmentUpdateSchema,
  shipmentGetSchema,
  shipmentDeleteSchema,
  shipmentListSchema,
};
