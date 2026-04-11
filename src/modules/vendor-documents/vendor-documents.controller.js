const { sendSuccess } = require("../../utils/response");
const { vendorDocumentsService } = require("./vendor-documents.service");

const vendorDocumentsController = {
  async jobOptions(_req, res, next) {
    try {
      const data = await vendorDocumentsService.getJobOptions();
      sendSuccess(res, { data });
    } catch (error) {
      next(error);
    }
  },

  async byJob(req, res, next) {
    try {
      const jobNo = req.validated.params.jobNo;
      const data = await vendorDocumentsService.getByJobNo(jobNo);
      sendSuccess(res, { data });
    } catch (error) {
      next(error);
    }
  },

  async presignMasterBl(req, res, next) {
    try {
      const jobNo = req.validated.params.jobNo;
      const data = await vendorDocumentsService.createMasterBlUploadUrl(
        jobNo,
        req.validated.body,
      );
      sendSuccess(res, { data });
    } catch (error) {
      next(error);
    }
  },

  async completeMasterBl(req, res, next) {
    try {
      const jobNo = req.validated.params.jobNo;
      const data = await vendorDocumentsService.completeMasterBlUpload(
        jobNo,
        req.validated.body,
      );
      sendSuccess(res, { data, message: "Master BL uploaded" });
    } catch (error) {
      next(error);
    }
  },

  async masterBlDownload(req, res, next) {
    try {
      const jobNo = req.validated.params.jobNo;
      const downloadUrl =
        await vendorDocumentsService.getMasterBlDownloadUrl(jobNo);
      sendSuccess(res, { data: { downloadUrl } });
    } catch (error) {
      next(error);
    }
  },

  async presignVendorRow(req, res, next) {
    try {
      const jobNo = req.validated.params.jobNo;
      const rowKey = req.validated.params.rowKey;
      const data = await vendorDocumentsService.createVendorRowUploadUrl(
        jobNo,
        rowKey,
        req.validated.body,
      );
      sendSuccess(res, { data });
    } catch (error) {
      next(error);
    }
  },

  async completeVendorRow(req, res, next) {
    try {
      const jobNo = req.validated.params.jobNo;
      const rowKey = req.validated.params.rowKey;
      const data = await vendorDocumentsService.completeVendorRowUpload(
        jobNo,
        rowKey,
        req.validated.body,
      );
      sendSuccess(res, { data, message: "Vendor document uploaded" });
    } catch (error) {
      next(error);
    }
  },

  async vendorRowDownload(req, res, next) {
    try {
      const jobNo = req.validated.params.jobNo;
      const rowKey = req.validated.params.rowKey;
      const downloadUrl = await vendorDocumentsService.getVendorRowDownloadUrl(
        jobNo,
        rowKey,
      );
      sendSuccess(res, { data: { downloadUrl } });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { vendorDocumentsController };
