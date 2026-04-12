import { z } from "zod";

import {
  objectIdSchema,
  emailSchema,
} from "../../../utils/validationPrimitives.js";
import {
  buildResourceListQuerySchema,
  createResourceCrudSchemas,
} from "../../common/shared-crud/resourceValidationHelpers.js";

const emailListSchema = z.array(emailSchema("Invalid Email ID")).max(20);

const vendorAgentBodyCreateSchema = z.object({
  vendorTypeId: objectIdSchema,
  vendorName: z.string().trim().min(1, "Vendor Name is required"),
  mail: z.string().trim().optional(),
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

const vendorAgentBodyUpdateSchema = z.object({
  vendorTypeId: objectIdSchema.optional(),
  vendorName: z.string().trim().min(1, "Vendor Name is required").optional(),
  mail: z.string().trim().optional(),
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

const vendorAgentListQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "code", "vendorName"]),
  extraQueryShape: {
    vendorTypeId: objectIdSchema.optional(),
  },
});

const {
  createSchema: vendorAgentCreateSchema,
  updateSchema: vendorAgentUpdateSchema,
  getSchema: vendorAgentGetSchema,
  deleteSchema: vendorAgentDeleteSchema,
  listSchema: vendorAgentListSchema,
} = createResourceCrudSchemas({
  createBodySchema: vendorAgentBodyCreateSchema,
  updateBodySchema: vendorAgentBodyUpdateSchema,
  listQuerySchema: vendorAgentListQuerySchema,
});

export {
  vendorAgentCreateSchema,
  vendorAgentUpdateSchema,
  vendorAgentGetSchema,
  vendorAgentDeleteSchema,
  vendorAgentListSchema,
};
