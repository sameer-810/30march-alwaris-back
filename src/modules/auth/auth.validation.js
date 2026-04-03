const { z } = require("zod");
const {
  emptyObjectPassthroughSchema,
  emailSchema,
} = require("../../utils/validationPrimitives");

const authLoginSchema = z.object({
  body: z.object({
    email: emailSchema(),
    password: z.string().min(1, "Password is required"),
  }),
  params: emptyObjectPassthroughSchema,
  query: emptyObjectPassthroughSchema,
});

module.exports = { authLoginSchema };
