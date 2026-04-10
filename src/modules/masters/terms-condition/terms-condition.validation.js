const { z } = require("zod");
const { objectIdSchema } = require("../../../utils/validationPrimitives");
const {
  buildResourceListQuerySchema,
  createResourceCrudSchemas,
} = require("../../common/shared-crud/resourceValidationHelpers");

const termsConditionBodyCreateSchema = z.object({
  lineOfBixId: objectIdSchema,
  description: z.string().trim().min(1, "Terms & Conditions is required"),
});

const termsConditionBodyUpdateSchema = z.object({
  lineOfBixId: objectIdSchema.optional(),
  description: z.string().trim().min(1).optional(),
});

const termsConditionListQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "counter", "description"]),
});

const {
  createSchema: termsConditionCreateSchema,
  updateSchema: termsConditionUpdateSchema,
  getSchema: termsConditionGetSchema,
  deleteSchema: termsConditionDeleteSchema,
  listSchema: termsConditionListSchema,
} = createResourceCrudSchemas({
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
