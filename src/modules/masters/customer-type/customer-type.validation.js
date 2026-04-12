import { z } from "zod";
import {
  buildResourceListQuerySchema,
  createResourceCrudSchemas,
} from "../../common/shared-crud/resourceValidationHelpers.js";

const customerTypeBodyCreateSchema = z.object({
  customerType: z.string().trim().min(1, "Customer Type is required"),
});

const customerTypeBodyUpdateSchema = z.object({
  customerType: z.string().trim().min(1).optional(),
});

const customerTypeListQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "customerType", "code"]),
});

const {
  createSchema: customerTypeCreateSchema,
  updateSchema: customerTypeUpdateSchema,
  getSchema: customerTypeGetSchema,
  deleteSchema: customerTypeDeleteSchema,
  listSchema: customerTypeListSchema,
} = createResourceCrudSchemas({
  createBodySchema: customerTypeBodyCreateSchema,
  updateBodySchema: customerTypeBodyUpdateSchema,
  listQuerySchema: customerTypeListQuerySchema,
});

export {
  customerTypeCreateSchema,
  customerTypeUpdateSchema,
  customerTypeGetSchema,
  customerTypeDeleteSchema,
  customerTypeListSchema,
};
