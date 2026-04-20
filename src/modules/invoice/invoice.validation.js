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
import { INVOICE_TYPE_OPTIONS } from "./invoice.model.js";

const invoiceTypeEnum = z.enum(INVOICE_TYPE_OPTIONS);
const currencyEnum = z.enum(["AED", "USD"]);
const paymentTypeEnum = z.enum(["CHEQUE", "CASH", "BANK TRANSFER"]);

const optionalDateSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || !Number.isNaN(Date.parse(value)),
    "Invalid date",
  );

const lineItemSchema = z.object({
  id: z.string().trim().optional(),
  lineNo: z.number().int().min(0).optional().default(0),
  jobNo: z.number().int().min(1),
  invoiceNo: z.string().trim().optional().default(""),
  jobDate: optionalDateSchema,
  code: z.string().trim().optional().default(""),
  description: z.string().trim().optional().default(""),
  chargedPer: z.string().trim().optional().default("DOCS"),
  currency: currencyEnum.default("AED"),
  size: z.string().trim().optional().default("20"),
  type: z.string().trim().optional().default("GP"),
  qty: z.number().min(0).default(0),
  rate: z.number().min(0).default(0),
  amount: z.number().min(0).default(0),
  serviceCode: z.string().trim().optional().default(""),
  gstVat: z.number().min(0).default(0),
  gstVatAmount: z.number().min(0).default(0),
  cgst: z.number().min(0).default(0),
  cgstAmount: z.number().min(0).default(0),
  sgst: z.number().min(0).default(0),
  sgstAmount: z.number().min(0).default(0),
  igst: z.number().min(0).default(0),
  igstAmount: z.number().min(0).default(0),
  wht: z.number().min(0).default(0),
  whtAmount: z.number().min(0).default(0),
  totalAmount: z.number().default(0),
  remark: z.string().trim().optional().default(""),
  exRate: z.number().min(0).default(1),
});

const paymentSchema = z.object({
  id: z.string().trim().optional(),
  vocNo: z.string().trim().optional().default(""),
  vocDate: optionalDateSchema,
  invoice: z.string().trim().optional().default(""),
  payAmount: z.number().min(0).default(0),
  tdsAmount: z.number().min(0).default(0),
  clientBank: z.string().trim().optional().default(""),
  bankBranch: z.string().trim().optional().default(""),
  clientAcNo: z.string().trim().optional().default(""),
  payType: paymentTypeEnum.default("BANK TRANSFER"),
  chequeNo: z.string().trim().optional().default(""),
  ourBank: z.string().trim().optional().default(""),
  tokenNo: z.string().trim().optional().default(""),
  paymentDate: optionalDateSchema,
});

const bodyCreateSchema = z.object({
  jobNo: z.number().int().min(1),
  invoiceType: invoiceTypeEnum,
  bookingId: objectIdSchema.optional(),
  costSheetId: objectIdSchema.optional(),
  invoiceNo: z.string().trim().optional().default(""),
  invoiceDate: optionalDateSchema,
  customerName: z.string().trim().optional().default(""),
  jobDate: optionalDateSchema,
  branch: z.string().trim().optional().default(""),
  amount: z.number().min(0).optional().default(0),
  tax: z.number().min(0).optional().default(0),
  totalAmount: z.number().min(0).optional().default(0),
  payAmount: z.number().min(0).optional().default(0),
  tdsAmount: z.number().min(0).optional().default(0),
  balanceAmount: z.number().optional().default(0),
  voyage: z.string().trim().optional().default(""),
  vesselName: z.string().trim().optional().default(""),
  pol: z.string().trim().optional().default(""),
  fpod: z.string().trim().optional().default(""),
  cgst: z.number().min(0).optional().default(0),
  sgst: z.number().min(0).optional().default(0),
  igst: z.number().min(0).optional().default(0),
  exRate: z.number().min(0).optional().default(1),
  actualJob: z.number().min(0).optional().default(0),
  actualInvoice: z.number().min(0).optional().default(0),
  credit: z.number().min(0).optional().default(0),
  creditDate: optionalDateSchema,
  remarks: z.string().trim().optional().default(""),
  createdBy: z.string().trim().optional().default(""),
  checker: z.string().trim().optional().default(""),
  checkedBy: z.string().trim().optional().default(""),
  creditDays: z.number().min(0).optional().default(0),
  wht: z.number().min(0).optional().default(0),
  actualTotal: z.number().min(0).optional().default(0),
  payableAt: currencyEnum.default("AED"),
  bankName: z.string().trim().optional().default(""),
  partyName: z.string().trim().optional().default(""),
  lineItems: z.array(lineItemSchema).optional().default([]),
  payments: z.array(paymentSchema).optional().default([]),
});

const bodyUpdateSchema = bodyCreateSchema.partial();

const listQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "jobNo", "invoiceDate", "invoiceNo"]),
  extraQueryShape: {
    search: searchSchema.optional(),
    invoiceType: invoiceTypeEnum.optional(),
    jobNo: z.coerce.number().int().min(1).optional(),
  },
});

const {
  createSchema: invoiceCreateSchema,
  updateSchema: invoiceUpdateSchema,
  getSchema: invoiceGetSchema,
  deleteSchema: invoiceDeleteSchema,
  listSchema: invoiceListSchema,
} = createResourceCrudSchemas({
  createBodySchema: bodyCreateSchema,
  updateBodySchema: bodyUpdateSchema,
  listQuerySchema,
});

const invoiceJobOptionsSchema = z.object({
  body: emptyObjectPassthroughSchema,
  params: emptyObjectPassthroughSchema,
  query: emptyObjectPassthroughSchema,
});

const invoiceSearchSchema = z.object({
  body: emptyObjectPassthroughSchema,
  params: emptyObjectPassthroughSchema,
  query: z.object({
    jobNo: z.coerce.number().int().min(1),
    invoiceType: invoiceTypeEnum,
  }),
});

export {
  invoiceCreateSchema,
  invoiceUpdateSchema,
  invoiceGetSchema,
  invoiceDeleteSchema,
  invoiceListSchema,
  invoiceJobOptionsSchema,
  invoiceSearchSchema,
};
