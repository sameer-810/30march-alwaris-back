const { z } = require("zod");
const {
  buildMasterListQuerySchema,
  createMasterCrudSchemas,
} = require("../shared/masterValidationHelpers");

const vesselBodyCreateSchema = z.object({
  vesselName: z.string().trim().min(1, "Vessel Name is required"),
});

const vesselBodyUpdateSchema = z.object({
  vesselName: z.string().trim().min(1).optional(),
});

const vesselListQuerySchema = buildMasterListQuerySchema({
  sortByEnum: z.enum(["createdAt", "vesselName", "code"]),
});

const {
  createSchema: vesselCreateSchema,
  updateSchema: vesselUpdateSchema,
  getSchema: vesselGetSchema,
  deleteSchema: vesselDeleteSchema,
  listSchema: vesselListSchema,
} = createMasterCrudSchemas({
  createBodySchema: vesselBodyCreateSchema,
  updateBodySchema: vesselBodyUpdateSchema,
  listQuerySchema: vesselListQuerySchema,
});

module.exports = {
  vesselCreateSchema,
  vesselUpdateSchema,
  vesselGetSchema,
  vesselDeleteSchema,
  vesselListSchema,
};
