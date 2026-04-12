import { z } from "zod";
import {
  buildResourceListQuerySchema,
  createResourceCrudSchemas,
} from "../../common/shared-crud/resourceValidationHelpers.js";

const portBodyCreateSchema = z.object({
  portCode: z.string().trim().min(1, "Port Code is required"),
  portName: z.string().trim().min(1, "Port Name is required"),
});

const portBodyUpdateSchema = z.object({
  portCode: z.string().trim().min(1).optional(),
  portName: z.string().trim().min(1).optional(),
});

const portListQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "portCode", "portName", "code"]),
});

const {
  createSchema: portCreateSchema,
  updateSchema: portUpdateSchema,
  getSchema: portGetSchema,
  deleteSchema: portDeleteSchema,
  listSchema: portListSchema,
} = createResourceCrudSchemas({
  createBodySchema: portBodyCreateSchema,
  updateBodySchema: portBodyUpdateSchema,
  listQuerySchema: portListQuerySchema,
});

export {
  portCreateSchema,
  portUpdateSchema,
  portGetSchema,
  portDeleteSchema,
  portListSchema,
};
