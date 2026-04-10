const { z } = require("zod");
const {
  buildResourceListQuerySchema,
  createResourceCrudSchemas,
} = require("../../common/shared-crud/resourceValidationHelpers");

const vesselBodyCreateSchema = z.object({
  vesselName: z.string().trim().min(1, "Vessel Name is required"),
});

const vesselBodyUpdateSchema = z.object({
  vesselName: z.string().trim().min(1).optional(),
});

const vesselListQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "vesselName", "code"]),
});

const {
  createSchema: vesselCreateSchema,
  updateSchema: vesselUpdateSchema,
  getSchema: vesselGetSchema,
  deleteSchema: vesselDeleteSchema,
  listSchema: vesselListSchema,
} = createResourceCrudSchemas({
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
