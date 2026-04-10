const { z } = require("zod");
const {
  buildResourceListQuerySchema,
  createResourceCrudSchemas,
} = require("../../common/shared-crud/resourceValidationHelpers");

const serviceBodyCreateSchema = z.object({
  serviceType: z.string().trim().min(1, "Service Type is required"),
});

const serviceBodyUpdateSchema = z.object({
  serviceType: z.string().trim().min(1).optional(),
});

const serviceListQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "serviceType", "code"]),
});

const {
  createSchema: serviceCreateSchema,
  updateSchema: serviceUpdateSchema,
  getSchema: serviceGetSchema,
  deleteSchema: serviceDeleteSchema,
  listSchema: serviceListSchema,
} = createResourceCrudSchemas({
  createBodySchema: serviceBodyCreateSchema,
  updateBodySchema: serviceBodyUpdateSchema,
  listQuerySchema: serviceListQuerySchema,
});

module.exports = {
  serviceCreateSchema,
  serviceUpdateSchema,
  serviceGetSchema,
  serviceDeleteSchema,
  serviceListSchema,
};
