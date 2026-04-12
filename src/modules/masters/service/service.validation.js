import { z } from "zod";
import {
  buildResourceListQuerySchema,
  createResourceCrudSchemas,
} from "../../common/shared-crud/resourceValidationHelpers.js";

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

export {
  serviceCreateSchema,
  serviceUpdateSchema,
  serviceGetSchema,
  serviceDeleteSchema,
  serviceListSchema,
};
