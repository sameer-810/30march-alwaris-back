const { z } = require("zod");
const {
  emptyObjectPassthroughSchema,
} = require("../../utils/validationPrimitives");

const jobNoParamsSchema = z.object({
  jobNo: z.coerce.number().int().min(1),
});

const rowParamsSchema = z.object({
  jobNo: z.coerce.number().int().min(1),
  rowKey: z.string().trim().min(1),
});

const presignBodySchema = z.object({
  fileName: z.string().trim().min(1),
  contentType: z.string().trim().optional().default("application/octet-stream"),
  size: z.coerce.number().int().min(1),
});

const completeBodySchema = z.object({
  key: z.string().trim().min(1),
  fileName: z.string().trim().min(1),
  mimeType: z.string().trim().optional().default("application/octet-stream"),
  size: z.coerce.number().int().min(1),
});

const vendorDocumentsJobOptionsSchema = z.object({
  body: emptyObjectPassthroughSchema,
  params: emptyObjectPassthroughSchema,
  query: emptyObjectPassthroughSchema,
});

const vendorDocumentsByJobSchema = z.object({
  body: emptyObjectPassthroughSchema,
  params: jobNoParamsSchema,
  query: emptyObjectPassthroughSchema,
});

const vendorDocumentsMasterPresignSchema = z.object({
  body: presignBodySchema,
  params: jobNoParamsSchema,
  query: emptyObjectPassthroughSchema,
});

const vendorDocumentsMasterCompleteSchema = z.object({
  body: completeBodySchema,
  params: jobNoParamsSchema,
  query: emptyObjectPassthroughSchema,
});

const vendorDocumentsMasterDownloadSchema = z.object({
  body: emptyObjectPassthroughSchema,
  params: jobNoParamsSchema,
  query: emptyObjectPassthroughSchema,
});

const vendorDocumentsVendorRowPresignSchema = z.object({
  body: presignBodySchema,
  params: rowParamsSchema,
  query: emptyObjectPassthroughSchema,
});

const vendorDocumentsVendorRowCompleteSchema = z.object({
  body: completeBodySchema,
  params: rowParamsSchema,
  query: emptyObjectPassthroughSchema,
});

const vendorDocumentsVendorRowDownloadSchema = z.object({
  body: emptyObjectPassthroughSchema,
  params: rowParamsSchema,
  query: emptyObjectPassthroughSchema,
});

module.exports = {
  vendorDocumentsJobOptionsSchema,
  vendorDocumentsByJobSchema,
  vendorDocumentsMasterPresignSchema,
  vendorDocumentsMasterCompleteSchema,
  vendorDocumentsMasterDownloadSchema,
  vendorDocumentsVendorRowPresignSchema,
  vendorDocumentsVendorRowCompleteSchema,
  vendorDocumentsVendorRowDownloadSchema,
};
