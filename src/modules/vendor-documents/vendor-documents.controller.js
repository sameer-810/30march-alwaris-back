const { sendSuccess } = require("../../utils/response");
const { asyncHandler } = require("../../utils/asyncHandler");
const { vendorDocumentsService } = require("./vendor-documents.service");

const vendorDocumentsController = {
  jobOptions: asyncHandler(async (_req, res) => {
    const data = await vendorDocumentsService.getJobOptions();
    sendSuccess(res, { data });
  }),

  byJob: asyncHandler(async (req, res) => {
    const jobNo = req.validated.params.jobNo;
    const data = await vendorDocumentsService.getByJobNo(jobNo);
    sendSuccess(res, { data });
  }),

  presignMasterBl: asyncHandler(async (req, res) => {
    const jobNo = req.validated.params.jobNo;
    const data = await vendorDocumentsService.createMasterBlUploadUrl(
      jobNo,
      req.validated.body,
    );
    sendSuccess(res, { data });
  }),

  completeMasterBl: asyncHandler(async (req, res) => {
    const jobNo = req.validated.params.jobNo;
    const data = await vendorDocumentsService.completeMasterBlUpload(
      jobNo,
      req.validated.body,
    );
    sendSuccess(res, { data, message: "Master BL uploaded" });
  }),

  masterBlDownload: asyncHandler(async (req, res) => {
    const jobNo = req.validated.params.jobNo;
    const downloadUrl =
      await vendorDocumentsService.getMasterBlDownloadUrl(jobNo);
    sendSuccess(res, { data: { downloadUrl } });
  }),

  presignVendorRow: asyncHandler(async (req, res) => {
    const jobNo = req.validated.params.jobNo;
    const rowKey = req.validated.params.rowKey;
    const data = await vendorDocumentsService.createVendorRowUploadUrl(
      jobNo,
      rowKey,
      req.validated.body,
    );
    sendSuccess(res, { data });
  }),

  completeVendorRow: asyncHandler(async (req, res) => {
    const jobNo = req.validated.params.jobNo;
    const rowKey = req.validated.params.rowKey;
    const data = await vendorDocumentsService.completeVendorRowUpload(
      jobNo,
      rowKey,
      req.validated.body,
    );
    sendSuccess(res, { data, message: "Vendor document uploaded" });
  }),

  vendorRowDownload: asyncHandler(async (req, res) => {
    const jobNo = req.validated.params.jobNo;
    const rowKey = req.validated.params.rowKey;
    const downloadUrl = await vendorDocumentsService.getVendorRowDownloadUrl(
      jobNo,
      rowKey,
    );
    sendSuccess(res, { data: { downloadUrl } });
  }),
};

module.exports = { vendorDocumentsController };
