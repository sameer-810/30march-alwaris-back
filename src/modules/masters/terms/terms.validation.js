const { z } = require("zod");
const {
  buildResourceListQuerySchema,
  createResourceCrudSchemas,
} = require("../../common/shared-crud/resourceValidationHelpers");

const termsBodyCreateSchema = z.object({
  terms: z.string().trim().min(1, "Terms is required"),
  description: z.string().trim().min(1, "Description is required"),
});

const termsBodyUpdateSchema = z.object({
  terms: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
});

const termsListQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "terms", "description", "code"]),
});

const {
  createSchema: termsCreateSchema,
  updateSchema: termsUpdateSchema,
  getSchema: termsGetSchema,
  deleteSchema: termsDeleteSchema,
  listSchema: termsListSchema,
} = createResourceCrudSchemas({
  createBodySchema: termsBodyCreateSchema,
  updateBodySchema: termsBodyUpdateSchema,
  listQuerySchema: termsListQuerySchema,
});

module.exports = {
  termsCreateSchema,
  termsUpdateSchema,
  termsGetSchema,
  termsDeleteSchema,
  termsListSchema,
};
