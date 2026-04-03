const { z } = require("zod");
const { objectIdSchema } = require("../../../utils/validationPrimitives");
const {
  buildMasterListQuerySchema,
  createMasterCrudSchemas,
} = require("../shared/masterValidationHelpers");

const termsConditionBodyCreateSchema = z.object({
  lineOfBixId: objectIdSchema,
  description: z.string().trim().min(1, "Terms & Conditions is required"),
});

const termsConditionBodyUpdateSchema = z.object({
  lineOfBixId: objectIdSchema.optional(),
  description: z.string().trim().min(1).optional(),
});

const termsConditionListQuerySchema = buildMasterListQuerySchema({
  sortByEnum: z.enum(["createdAt", "counter", "description"]),
});

const {
  createSchema: termsConditionCreateSchema,
  updateSchema: termsConditionUpdateSchema,
  getSchema: termsConditionGetSchema,
  deleteSchema: termsConditionDeleteSchema,
  listSchema: termsConditionListSchema,
} = createMasterCrudSchemas({
  createBodySchema: termsConditionBodyCreateSchema,
  updateBodySchema: termsConditionBodyUpdateSchema,
  listQuerySchema: termsConditionListQuerySchema,
});

module.exports = {
  termsConditionCreateSchema,
  termsConditionUpdateSchema,
  termsConditionGetSchema,
  termsConditionDeleteSchema,
  termsConditionListSchema,
};
