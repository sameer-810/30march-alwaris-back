import { z } from "zod";
import { objectIdSchema } from "../../../utils/validationPrimitives.js";
import {
  buildResourceListQuerySchema,
  createResourceCrudSchemas,
} from "../../common/shared-crud/resourceValidationHelpers.js";

const termsConditionBodyCreateSchema = z.object({
  lineOfBixId: objectIdSchema,
  description: z.string().trim().min(1, "Terms & Conditions is required"),
});

const termsConditionBodyUpdateSchema = z.object({
  lineOfBixId: objectIdSchema.optional(),
  description: z.string().trim().min(1).optional(),
});

const termsConditionListQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "counter", "description"]),
});

const {
  createSchema: termsConditionCreateSchema,
  updateSchema: termsConditionUpdateSchema,
  getSchema: termsConditionGetSchema,
  deleteSchema: termsConditionDeleteSchema,
  listSchema: termsConditionListSchema,
} = createResourceCrudSchemas({
  createBodySchema: termsConditionBodyCreateSchema,
  updateBodySchema: termsConditionBodyUpdateSchema,
  listQuerySchema: termsConditionListQuerySchema,
});

export {
  termsConditionCreateSchema,
  termsConditionUpdateSchema,
  termsConditionGetSchema,
  termsConditionDeleteSchema,
  termsConditionListSchema,
};
