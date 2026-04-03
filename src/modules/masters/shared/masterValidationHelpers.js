const { z } = require("zod");
const {
  objectIdSchema,
  searchSchema,
  pageSchema,
  limitSchema,
  sortDirSchema,
  emptyObjectPassthroughSchema,
} = require("../../../utils/validationPrimitives");

function buildMasterListQuerySchema({ sortByEnum, extraQueryShape = {} }) {
  return z.object({
    search: searchSchema,
    ...extraQueryShape,
    page: pageSchema,
    limit: limitSchema,
    sortBy: sortByEnum.optional().default("createdAt"),
    sortDir: sortDirSchema,
  });
}

function createMasterCrudSchemas({
  createBodySchema,
  updateBodySchema,
  listQuerySchema,
}) {
  const byIdParamsSchema = z.object({ id: objectIdSchema });

  return {
    createSchema: z.object({
      body: createBodySchema,
      params: emptyObjectPassthroughSchema,
      query: emptyObjectPassthroughSchema,
    }),
    updateSchema: z.object({
      body: updateBodySchema,
      params: byIdParamsSchema,
      query: emptyObjectPassthroughSchema,
    }),
    getSchema: z.object({
      body: emptyObjectPassthroughSchema,
      params: byIdParamsSchema,
      query: emptyObjectPassthroughSchema,
    }),
    deleteSchema: z.object({
      body: emptyObjectPassthroughSchema,
      params: byIdParamsSchema,
      query: emptyObjectPassthroughSchema,
    }),
    listSchema: z.object({
      body: emptyObjectPassthroughSchema,
      params: emptyObjectPassthroughSchema,
      query: listQuerySchema,
    }),
  };
}

module.exports = {
  buildMasterListQuerySchema,
  createMasterCrudSchemas,
};
