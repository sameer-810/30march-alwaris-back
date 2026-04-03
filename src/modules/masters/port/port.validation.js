const { z } = require("zod");
const {
  buildMasterListQuerySchema,
  createMasterCrudSchemas,
} = require("../shared/masterValidationHelpers");

const portBodyCreateSchema = z.object({
  portCode: z.string().trim().min(1, "Port Code is required"),
  portName: z.string().trim().min(1, "Port Name is required"),
});

const portBodyUpdateSchema = z.object({
  portCode: z.string().trim().min(1).optional(),
  portName: z.string().trim().min(1).optional(),
});

const portListQuerySchema = buildMasterListQuerySchema({
  sortByEnum: z.enum(["createdAt", "portCode", "portName", "code"]),
});

const {
  createSchema: portCreateSchema,
  updateSchema: portUpdateSchema,
  getSchema: portGetSchema,
  deleteSchema: portDeleteSchema,
  listSchema: portListSchema,
} = createMasterCrudSchemas({
  createBodySchema: portBodyCreateSchema,
  updateBodySchema: portBodyUpdateSchema,
  listQuerySchema: portListQuerySchema,
});

module.exports = {
  portCreateSchema,
  portUpdateSchema,
  portGetSchema,
  portDeleteSchema,
  portListSchema,
};
