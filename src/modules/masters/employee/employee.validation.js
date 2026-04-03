const { z } = require("zod");
const {
  booleanQuerySchema,
  emailSchema,
} = require("../../../utils/validationPrimitives");
const {
  buildMasterListQuerySchema,
  createMasterCrudSchemas,
} = require("../shared/masterValidationHelpers");

const departments = ["HOD", "Marketing", "Accounts", "Other"];

const employeeBodyCreateSchema = z.object({
  isActive: z.boolean().optional(),
  isApproved: z.boolean().optional(),
  employeeName: z.string().trim().min(1, "Employee Name is required"),
  department: z.enum(departments),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  pincode: z.string().trim().min(1, "Pincode is required"),
  state: z.string().trim().min(1, "State is required"),
  country: z.string().trim().min(1, "Country is required"),
  contactNo: z.string().trim().min(1, "Contact No is required"),
  emailId: emailSchema("Invalid Email ID"),
});

const employeeBodyUpdateSchema = z.object({
  isActive: z.boolean().optional(),
  isApproved: z.boolean().optional(),
  employeeName: z.string().trim().min(1).optional(),
  department: z.enum(departments).optional(),
  address: z.string().trim().min(1).optional(),
  city: z.string().trim().min(1).optional(),
  pincode: z.string().trim().min(1).optional(),
  state: z.string().trim().min(1).optional(),
  country: z.string().trim().min(1).optional(),
  contactNo: z.string().trim().min(1).optional(),
  emailId: emailSchema().optional(),
});

const employeeListQuerySchema = buildMasterListQuerySchema({
  sortByEnum: z.enum(["createdAt", "employeeId", "employeeName"]),
  extraQueryShape: {
    department: z.enum(departments).optional(),
    isActive: booleanQuerySchema,
    isApproved: booleanQuerySchema,
  },
});

const {
  createSchema: employeeCreateSchema,
  updateSchema: employeeUpdateSchema,
  getSchema: employeeGetSchema,
  deleteSchema: employeeDeleteSchema,
  listSchema: employeeListSchema,
} = createMasterCrudSchemas({
  createBodySchema: employeeBodyCreateSchema,
  updateBodySchema: employeeBodyUpdateSchema,
  listQuerySchema: employeeListQuerySchema,
});

module.exports = {
  employeeCreateSchema,
  employeeUpdateSchema,
  employeeGetSchema,
  employeeDeleteSchema,
  employeeListSchema,
};
