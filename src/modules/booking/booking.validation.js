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

const modeOptions = ["Air", "Sea", "Road"];
const exportOptions = ["Export", "Import", "Cross Trade"];
const lineOptions = ["ACL", "AGL", "ASR"];
const statusOptions = ["Pending", "Done", "Cancel"];
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

const isoDateStringSchema = z
  .string()
  .trim()
  .min(1)
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");

const bookingIncomeDetailSchema = z.object({
  incomeBillingParty: objectIdSchema,
  chargeDescription: objectIdSchema,
  chargedPer: z.enum(chargedPerOptions).default("DOCS"),
  qty: z.number().min(1).default(1),
  rate: z.number().min(0).default(0),
  currency: z.enum(currencyOptions).default("USD"),
  size: z.enum(sizeOptions).default("20"),
  type: z.enum(typeOptions).default("GP"),
  amount: z.number().min(0).default(0),
  exRate: z.number().min(0).default(1),
  remarks: z.string().trim().optional().default(""),
});

const bookingExpenseDetailSchema = z.object({
  vendorName: objectIdSchema,
  chargeDescription: objectIdSchema,
  chargedPer: z.enum(chargedPerOptions).default("DOCS"),
  qty: z.number().min(1).default(1),
  rate: z.number().min(0).default(0),
  currency: z.enum(currencyOptions).default("USD"),
  size: z.enum(sizeOptions).default("20"),
  type: z.enum(typeOptions).default("GP"),
  amount: z.number().min(0).default(0),
  exRate: z.number().min(0).default(1),
  invoiceNo: z.string().trim().optional().default(""),
  date: isoDateStringSchema,
  remarks: z.string().trim().optional().default(""),
});

const bookingShipmentDetailSchema = z.object({
  generatedReference: z.string().trim().min(1),
  containerNo: z.string().trim().optional().default(""),
  qty: z.number().min(1).default(1),
  size: z.enum(sizeOptions).default("20"),
  type: z.enum(typeOptions).default("GP"),
  commodity: z.string().trim().optional().default(""),
  netWeight: z.number().min(0).default(0),
  grossWeight: z.number().min(0).default(0),
  volume: z.number().min(0).default(0),
  vessel: objectIdSchema.optional(),
  voyage: z.string().trim().optional().default(""),
  etd: isoDateStringSchema,
  eta: isoDateStringSchema,
  hbl: z.string().trim().optional().default(""),
  remarks: z.string().trim().optional().default(""),
});

const bookingBodyCreateSchema = z.object({
  jobDate: isoDateStringSchema,
  rateAgreedBy: objectIdSchema.optional(),
  bookingParty: objectIdSchema.optional(),
  kindAttention: objectIdSchema.optional(),
  shipper: z.string().trim().optional().default(""),
  consignee: z.string().trim().optional().default(""),
  modeOfTransport: z.enum(modeOptions).default("Sea"),
  exportImport: z.enum(exportOptions).default("Export"),
  portOfLoading: objectIdSchema.optional(),
  portOfDestination: objectIdSchema.optional(),
  line: z.enum(lineOptions).optional(),
  status: z.enum(statusOptions).default("Pending"),
  terms: objectIdSchema.optional(),
  lineOfBix: objectIdSchema.optional(),
  mbl: z.string().trim().optional().default(""),
  orderReference: z.string().trim().optional().default(""),
  defaultCurrency: z.enum(currencyOptions).default("USD"),
  billingParty: objectIdSchema.optional(),
  shipmentDetails: z.array(bookingShipmentDetailSchema).min(1),
  incomeDetails: z.array(bookingIncomeDetailSchema).optional().default([]),
  expenseDetails: z.array(bookingExpenseDetailSchema).optional().default([]),
});

const bookingBodyUpdateSchema = bookingBodyCreateSchema.partial();

const bookingListQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "jobNo", "jobDate"]),
  extraQueryShape: {
    search: searchSchema.optional(),
  },
});

const {
  createSchema: bookingCreateSchema,
  updateSchema: bookingUpdateSchema,
  getSchema: bookingGetSchema,
  deleteSchema: bookingDeleteSchema,
  listSchema: bookingListSchema,
} = createResourceCrudSchemas({
  createBodySchema: bookingBodyCreateSchema,
  updateBodySchema: bookingBodyUpdateSchema,
  listQuerySchema: bookingListQuerySchema,
});

const bookingNextReferenceSchema = z.object({
  body: emptyObjectPassthroughSchema,
  params: emptyObjectPassthroughSchema,
  query: emptyObjectPassthroughSchema,
});

export {
  bookingCreateSchema,
  bookingUpdateSchema,
  bookingGetSchema,
  bookingDeleteSchema,
  bookingListSchema,
  bookingNextReferenceSchema,
};
