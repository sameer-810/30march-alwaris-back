const { z } = require("zod");
const {
  buildMasterListQuerySchema,
  createMasterCrudSchemas,
} = require("../shared/masterValidationHelpers");

const lineOfBixBodyCreateSchema = z.object({
  code: z.string().trim().min(1, "Code is required"),
  lineOfBix: z.string().trim().min(1, "Line Of BIX is required"),
});

const lineOfBixBodyUpdateSchema = z.object({
  code: z.string().trim().min(1).optional(),
  lineOfBix: z.string().trim().min(1).optional(),
});

const lineOfBixListQuerySchema = buildMasterListQuerySchema({
  sortByEnum: z.enum(["createdAt", "counter", "code", "lineOfBix"]),
});

const {
  createSchema: lineOfBixCreateSchema,
  updateSchema: lineOfBixUpdateSchema,
  getSchema: lineOfBixGetSchema,
  deleteSchema: lineOfBixDeleteSchema,
  listSchema: lineOfBixListSchema,
} = createMasterCrudSchemas({
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
