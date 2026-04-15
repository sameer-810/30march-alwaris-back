import { z } from "zod";
import {
  objectIdSchema,
  searchSchema,
  emptyObjectPassthroughSchema,
} from "../../utils/validationPrimitives.js";
import {
  buildResourceListQuerySchema,
  createResourceCrudSchemas,
} from "../common/shared-crud/resourceValidationHelpers.js";

const statusOptions = ["Draft", "Pending Approval", "Approved", "Rejected"];
const sizeOptions = ["20", "40", "45"];
const typeOptions = [
  "DC",
  "DV",
  "FR",
  "GP",
  "GV",
  "HC",
  "HD",
  "HQ",
  "ISO",
  "OT",
  "RF",
  "SD",
  "SR",
];
const currencyOptions = ["USD", "AED"];
const chargedPerOptions = ["DOCS", "CONT"];

const optionalIsoDateStringSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || !Number.isNaN(Date.parse(value)),
    "Invalid date",
  );

const lineItemSchema = z.object({
  chargeDescriptionId: objectIdSchema.optional(),
  chargeDescriptionName: z.string().trim().optional().default(""),
  chargeDescriptionCode: z.string().trim().optional().default(""),
  billingPartyId: objectIdSchema.optional(),
  billingPartyName: z.string().trim().optional().default(""),
  vendorId: objectIdSchema.optional(),
  vendorName: z.string().trim().optional().default(""),
  chargedPer: z.enum(chargedPerOptions).default("DOCS"),
  qty: z.number().min(0).default(1),
  size: z.enum(sizeOptions).default("20"),
  type: z.enum(typeOptions).default("GP"),
  currency: z.enum(currencyOptions).default("USD"),
  rate: z.number().min(0).default(0),
  amount: z.number().min(0).default(0),
  remarks: z.string().trim().optional().default(""),
});

const bodyCreateSchema = z.object({
  jobNo: z.number().int().min(1),
  bookingId: objectIdSchema.optional(),
  bookingParty: z.string().trim().optional().default(""),
  shipper: z.string().trim().optional().default(""),
  consignee: z.string().trim().optional().default(""),
  portOfLoading: z.string().trim().optional().default(""),
  portOfDestination: z.string().trim().optional().default(""),
  modeOfTransport: z.string().trim().optional().default(""),
  etd: optionalIsoDateStringSchema,
  eta: optionalIsoDateStringSchema,
  volume: z.number().min(0).optional().default(0),
  grossWeight: z.number().min(0).optional().default(0),
  qty: z.number().min(0).optional().default(0),
  incomeDetails: z.array(lineItemSchema).optional().default([]),
  expenseDetails: z.array(lineItemSchema).optional().default([]),
  status: z.enum(statusOptions).default("Draft"),
});

const bodyUpdateSchema = bodyCreateSchema.partial();

const listQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "jobNo", "status"]),
  extraQueryShape: {
    search: searchSchema.optional(),
    status: z.enum(statusOptions).optional(),
  },
});

const {
  createSchema: costSheetCreateSchema,
  updateSchema: costSheetUpdateSchema,
  getSchema: costSheetGetSchema,
  deleteSchema: costSheetDeleteSchema,
  listSchema: costSheetListSchema,
} = createResourceCrudSchemas({
  createBodySchema: bodyCreateSchema,
  updateBodySchema: bodyUpdateSchema,
  listQuerySchema,
});

const costSheetJobOptionsSchema = z.object({
  body: emptyObjectPassthroughSchema,
  params: emptyObjectPassthroughSchema,
  query: emptyObjectPassthroughSchema,
});

const costSheetBookingDetailsSchema = z.object({
  body: emptyObjectPassthroughSchema,
  query: emptyObjectPassthroughSchema,
  params: z.object({
    jobNo: z.coerce.number().int().min(1),
  }),
});

export {
  costSheetCreateSchema,
  costSheetUpdateSchema,
  costSheetGetSchema,
  costSheetDeleteSchema,
  costSheetListSchema,
  costSheetJobOptionsSchema,
  costSheetBookingDetailsSchema,
};
