const { z } = require("zod");
const {
  searchSchema,
  emptyObjectPassthroughSchema,
} = require("../../utils/validationPrimitives");
const {
  buildResourceListQuerySchema,
  createResourceCrudSchemas,
} = require("../common/shared-crud/resourceValidationHelpers");

const statusOptions = ["Draft", "RFS", "SOB"];
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
const commodityOptions = ["General", "Hazardous", "ODC"];

const optionalIsoDateStringSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || !Number.isNaN(Date.parse(value)),
    "Invalid date",
  );

const consignmentDetailsSchema = z.object({
  shipper: z.string().trim().optional().default(""),
  consignee: z.string().trim().optional().default(""),
  notifyParty: z.string().trim().optional().default(""),
  marksAndNos: z.string().trim().optional().default(""),
  descriptionOfGoods: z.string().trim().optional().default(""),
  deliveryAgent: z.string().trim().optional().default(""),
  placeOfAcceptance: z.string().trim().optional().default(""),
  portOfLoading: z.string().trim().optional().default(""),
  placeOfDischarge: z.string().trim().optional().default(""),
  portOfDelivery: z.string().trim().optional().default(""),
  consigneeEmail: z.string().trim().optional().default(""),
  notifyEmail: z.string().trim().optional().default(""),
  routePlaceOfTranshipment: z.string().trim().optional().default(""),
  package: z.string().trim().optional().default(""),
  measurement: z.string().trim().optional().default(""),
  freeDaysAgreed: z.string().trim().optional().default(""),
  vesselVoyage: z.string().trim().optional().default(""),
  modeMeansOf: z.string().trim().optional().default(""),
  freightPayable: z.string().trim().optional().default(""),
  freightAmount: z.number().min(0).optional().default(0),
  place: z.string().trim().optional().default(""),
  date: optionalIsoDateStringSchema,
  dateOfIssue: optionalIsoDateStringSchema,
});

const containerDetailSchema = z.object({
  containerNo: z.string().trim().min(1, "Container No is required"),
  size: z.enum(sizeOptions).default("20"),
  type: z.enum(typeOptions).default("GP"),
  agentSeal: z.string().trim().optional().default(""),
  customSeal: z.string().trim().optional().default(""),
  piece: z.number().min(0).default(0),
  countPackage: z.string().trim().optional().default(""),
  commodity: z.enum(commodityOptions).default("General"),
  netWeight: z.number().min(0).default(0),
  grossWeight: z.number().min(0).default(0),
  shippingBill: z.string().trim().optional().default(""),
  cbm: z.number().min(0).default(0),
  hbl: z.string().trim().optional().default(""),
});

const bodyCreateSchema = z.object({
  jobNo: z.number().int().min(1),
  referenceNo: z.string().trim().min(1, "Reference No is required"),
  status: z.enum(statusOptions).default("Draft"),
  blNumber: z.string().trim().min(1, "BL Number is required"),
  consignmentDetails: consignmentDetailsSchema.optional().default({}),
  containerDetails: z
    .array(containerDetailSchema)
    .min(1, "Add at least one container detail"),
});

const bodyUpdateSchema = bodyCreateSchema.partial();

const listQuerySchema = buildResourceListQuerySchema({
  sortByEnum: z.enum(["createdAt", "hblNo", "jobNo"]),
  extraQueryShape: {
    search: searchSchema.optional(),
  },
});

const {
  createSchema: billOfLadingCreateSchema,
  updateSchema: billOfLadingUpdateSchema,
  getSchema: billOfLadingGetSchema,
  deleteSchema: billOfLadingDeleteSchema,
  listSchema: billOfLadingListSchema,
} = createResourceCrudSchemas({
  createBodySchema: bodyCreateSchema,
  updateBodySchema: bodyUpdateSchema,
  listQuerySchema,
});

const billOfLadingNextNumberSchema = z.object({
  body: emptyObjectPassthroughSchema,
  params: emptyObjectPassthroughSchema,
  query: emptyObjectPassthroughSchema,
});

const billOfLadingJobOptionsSchema = z.object({
  body: emptyObjectPassthroughSchema,
  params: emptyObjectPassthroughSchema,
  query: emptyObjectPassthroughSchema,
});

module.exports = {
  billOfLadingCreateSchema,
  billOfLadingUpdateSchema,
  billOfLadingGetSchema,
  billOfLadingDeleteSchema,
  billOfLadingListSchema,
  billOfLadingNextNumberSchema,
  billOfLadingJobOptionsSchema,
};
