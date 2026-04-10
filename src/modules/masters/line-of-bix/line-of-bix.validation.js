const { z } = require("zod");
const {
  buildResourceListQuerySchema,
  createResourceCrudSchemas,
} = require("../../common/shared-crud/resourceValidationHelpers");

const lineOfBixBodyCreateSchema = z.object({
  code: z.string().trim().min(1, "Code is required"),
  lineOfBix: z.string().trim().min(1, "Line Of BIX is required"),
});

const lineOfBixBodyUpdateSchema = z.object({
  code: z.string().trim().min(1).optional(),
  lineOfBix: z.string().trim().min(1).optional(),
});

const lineOfBixListQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "counter", "code", "lineOfBix"]),
});

const {
  createSchema: lineOfBixCreateSchema,
  updateSchema: lineOfBixUpdateSchema,
  getSchema: lineOfBixGetSchema,
  deleteSchema: lineOfBixDeleteSchema,
  listSchema: lineOfBixListSchema,
} = createResourceCrudSchemas({
  createBodySchema: lineOfBixBodyCreateSchema,
  updateBodySchema: lineOfBixBodyUpdateSchema,
  listQuerySchema: lineOfBixListQuerySchema,
});

module.exports = {
  lineOfBixCreateSchema,
  lineOfBixUpdateSchema,
  lineOfBixGetSchema,
  lineOfBixDeleteSchema,
  lineOfBixListSchema,
};
