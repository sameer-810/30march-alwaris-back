const { z } = require("zod");

const {
  objectIdSchema,
  emailSchema,
} = require("../../../utils/validationPrimitives");
const {
  buildResourceListQuerySchema,
  createResourceCrudSchemas,
} = require("../../common/shared-crud/resourceValidationHelpers");

const emailListSchema = z.array(emailSchema("Invalid Email ID")).max(20);

const customerBodyCreateSchema = z.object({
  customerTypeId: objectIdSchema,
  mail: z.string().trim().optional(),
  customerName: z.string().trim().min(1, "Customer Name is required"),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  country: z.string().trim().min(1, "Country is required"),
  state: z.string().trim().min(1, "State is required"),
  pincode: z.string().trim().min(1, "Pincode is required"),
  contactPerson: z.string().trim().min(1, "Contact Person is required"),
  contactNo: z.string().trim().min(1, "Contact No is required"),
  emailId: emailSchema("Invalid Email ID"),
  additionalEmailIds: emailListSchema.optional(),
  gstVatNo: z.string().trim().optional(),
  creditDays: z.number().int().min(0).optional(),
  stateCode: z.string().trim().optional(),
  panNo: z.string().trim().optional(),
});

const customerBodyUpdateSchema = z.object({
  customerTypeId: objectIdSchema.optional(),
  mail: z.string().trim().optional(),
  customerName: z.string().trim().min(1).optional(),
  address: z.string().trim().min(1).optional(),
  city: z.string().trim().min(1).optional(),
  country: z.string().trim().min(1).optional(),
  state: z.string().trim().min(1).optional(),
  pincode: z.string().trim().min(1).optional(),
  contactPerson: z.string().trim().min(1).optional(),
  contactNo: z.string().trim().min(1).optional(),
  emailId: emailSchema().optional(),
  additionalEmailIds: emailListSchema.optional(),
  gstVatNo: z.string().trim().optional(),
  creditDays: z.number().int().min(0).optional(),
  stateCode: z.string().trim().optional(),
  panNo: z.string().trim().optional(),
});

const customerListQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "code", "customerName"]),
  extraQueryShape: {
    customerTypeId: objectIdSchema.optional(),
  },
});

const {
  createSchema: customerCreateSchema,
  updateSchema: customerUpdateSchema,
  getSchema: customerGetSchema,
  deleteSchema: customerDeleteSchema,
  listSchema: customerListSchema,
} = createResourceCrudSchemas({
  createBodySchema: customerBodyCreateSchema,
  updateBodySchema: customerBodyUpdateSchema,
  listQuerySchema: customerListQuerySchema,
});

module.exports = {
  customerCreateSchema,
  customerUpdateSchema,
  customerGetSchema,
  customerDeleteSchema,
  customerListSchema,
};
