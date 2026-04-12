import { z } from "zod";
import {
  buildResourceListQuerySchema,
  createResourceCrudSchemas,
} from "../../common/shared-crud/resourceValidationHelpers.js";

const vendorTypeBodyCreateSchema = z.object({
  vendorType: z.string().trim().min(1, "Vendor Type is required"),
});

const vendorTypeBodyUpdateSchema = z.object({
  vendorType: z.string().trim().min(1).optional(),
});

const vendorTypeListQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "vendorType", "code"]),
});

const {
  createSchema: vendorTypeCreateSchema,
  updateSchema: vendorTypeUpdateSchema,
  getSchema: vendorTypeGetSchema,
  deleteSchema: vendorTypeDeleteSchema,
  listSchema: vendorTypeListSchema,
} = createResourceCrudSchemas({
  createBodySchema: vendorTypeBodyCreateSchema,
  updateBodySchema: vendorTypeBodyUpdateSchema,
  listQuerySchema: vendorTypeListQuerySchema,
});

export {
  vendorTypeCreateSchema,
  vendorTypeUpdateSchema,
  vendorTypeGetSchema,
  vendorTypeDeleteSchema,
  vendorTypeListSchema,
};
