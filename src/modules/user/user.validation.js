import { z } from "zod";
import {
  objectIdSchema,
  searchSchema,
  pageSchema,
  limitSchema,
  booleanQuerySchema,
  emptyObjectPassthroughSchema,
  emailSchema,
} from "../../utils/validationPrimitives.js";

const userEmailSchema = emailSchema().refine(
  (v) => v.includes("@") && v.split("@")[1]?.includes("."),
  "Invalid email",
);

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password too long (max 72 characters)");

const userCreateSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: userEmailSchema,
    role: z.enum(["Admin", "Operator"]),
    password: passwordSchema,
    isActive: z.boolean().optional(),
  }),
  params: emptyObjectPassthroughSchema,
  query: emptyObjectPassthroughSchema,
});

const userUpdateSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    role: z.enum(["Admin", "Operator"]).optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({ id: objectIdSchema }),
  query: emptyObjectPassthroughSchema,
});

const userPasswordResetSchema = z.object({
  body: z.object({
    password: passwordSchema,
  }),
  params: z.object({ id: objectIdSchema }),
  query: emptyObjectPassthroughSchema,
});

const userDeleteSchema = z.object({
  body: emptyObjectPassthroughSchema,
  params: z.object({ id: objectIdSchema }),
  query: emptyObjectPassthroughSchema,
});

const userListSchema = z.object({
  body: emptyObjectPassthroughSchema,
  params: emptyObjectPassthroughSchema,
  query: z.object({
    search: searchSchema,
    role: z.enum(["Admin", "Operator"]).optional(),
    isActive: booleanQuerySchema,
    page: pageSchema,
    limit: limitSchema,
  }),
});

export {
  userCreateSchema,
  userUpdateSchema,
  userPasswordResetSchema,
  userDeleteSchema,
  userListSchema,
};
