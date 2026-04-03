const { z } = require("zod");
const {
  buildMasterListQuerySchema,
  createMasterCrudSchemas,
} = require("../shared/masterValidationHelpers");

const customerTypeBodyCreateSchema = z.object({
  customerType: z.string().trim().min(1, "Customer Type is required"),
});

const customerTypeBodyUpdateSchema = z.object({
  customerType: z.string().trim().min(1).optional(),
});

const customerTypeListQuerySchema = buildMasterListQuerySchema({
  sortByEnum: z.enum(["createdAt", "customerType", "code"]),
});

const {
  createSchema: customerTypeCreateSchema,
  updateSchema: customerTypeUpdateSchema,
  getSchema: customerTypeGetSchema,
  deleteSchema: customerTypeDeleteSchema,
  listSchema: customerTypeListSchema,
} = createMasterCrudSchemas({
  createBodySchema: customerTypeBodyCreateSchema,
  updateBodySchema: customerTypeBodyUpdateSchema,
  listQuerySchema: customerTypeListQuerySchema,
});

module.exports = {
  customerTypeCreateSchema,
  customerTypeUpdateSchema,
  customerTypeGetSchema,
  customerTypeDeleteSchema,
  customerTypeListSchema,
};
