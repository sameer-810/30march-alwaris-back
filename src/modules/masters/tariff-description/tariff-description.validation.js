import { z } from "zod";
import {
  buildResourceListQuerySchema,
  createResourceCrudSchemas,
} from "../../common/shared-crud/resourceValidationHelpers.js";

const tariffDescriptionBodyCreateSchema = z.object({
  description: z.string().trim().min(1, "Tariff Description is required"),
});

const tariffDescriptionBodyUpdateSchema = z.object({
  description: z.string().trim().min(1).optional(),
});

const tariffDescriptionListQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "counter", "description"]),
});

const {
  createSchema: tariffDescriptionCreateSchema,
  updateSchema: tariffDescriptionUpdateSchema,
  getSchema: tariffDescriptionGetSchema,
  deleteSchema: tariffDescriptionDeleteSchema,
  listSchema: tariffDescriptionListSchema,
} = createResourceCrudSchemas({
  createBodySchema: tariffDescriptionBodyCreateSchema,
  updateBodySchema: tariffDescriptionBodyUpdateSchema,
  listQuerySchema: tariffDescriptionListQuerySchema,
});

export {
  tariffDescriptionCreateSchema,
  tariffDescriptionUpdateSchema,
  tariffDescriptionGetSchema,
  tariffDescriptionDeleteSchema,
  tariffDescriptionListSchema,
};
