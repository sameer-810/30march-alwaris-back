const { z } = require("zod");
const {
  buildMasterListQuerySchema,
  createMasterCrudSchemas,
} = require("../shared/masterValidationHelpers");

const tariffDescriptionBodyCreateSchema = z.object({
  description: z.string().trim().min(1, "Tariff Description is required"),
});

const tariffDescriptionBodyUpdateSchema = z.object({
  description: z.string().trim().min(1).optional(),
});

const tariffDescriptionListQuerySchema = buildMasterListQuerySchema({
  sortByEnum: z.enum(["createdAt", "counter", "description"]),
});

const {
  createSchema: tariffDescriptionCreateSchema,
  updateSchema: tariffDescriptionUpdateSchema,
  getSchema: tariffDescriptionGetSchema,
  deleteSchema: tariffDescriptionDeleteSchema,
  listSchema: tariffDescriptionListSchema,
} = createMasterCrudSchemas({
  createBodySchema: tariffDescriptionBodyCreateSchema,
  updateBodySchema: tariffDescriptionBodyUpdateSchema,
  listQuerySchema: tariffDescriptionListQuerySchema,
});

module.exports = {
  tariffDescriptionCreateSchema,
  tariffDescriptionUpdateSchema,
  tariffDescriptionGetSchema,
  tariffDescriptionDeleteSchema,
  tariffDescriptionListSchema,
};
