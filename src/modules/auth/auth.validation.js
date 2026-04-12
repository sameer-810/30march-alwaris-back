import { z } from "zod";
import {
  emptyObjectPassthroughSchema,
  emailSchema,
} from "../../utils/validationPrimitives.js";

const authLoginSchema = z.object({
  body: z.object({
    email: emailSchema(),
    password: z.string().min(1, "Password is required"),
  }),
  params: emptyObjectPassthroughSchema,
  query: emptyObjectPassthroughSchema,
});

export { authLoginSchema };
