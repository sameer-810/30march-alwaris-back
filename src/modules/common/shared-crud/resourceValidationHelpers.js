import { z } from "zod";
import {
  objectIdSchema,
  searchSchema,
  pageSchema,
  limitSchema,
  sortDirSchema,
  emptyObjectPassthroughSchema,
} from "../../../utils/validationPrimitives.js";

function buildResourceListQuerySchema({ sortByEnum, extraQueryShape = {} }) {
  return z.object({
    search: searchSchema,
    ...extraQueryShape,
    page: pageSchema,
    limit: limitSchema,
    sortBy: sortByEnum.optional().default("createdAt"),
    sortDir: sortDirSchema,
  });
}

function createResourceCrudSchemas({
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

export { buildResourceListQuerySchema, createResourceCrudSchemas };
