import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { vendorDocumentsController } from "./vendor-documents.controller.js";
import {
  vendorDocumentsJobOptionsSchema,
  vendorDocumentsByJobSchema,
  vendorDocumentsMasterPresignSchema,
  vendorDocumentsMasterCompleteSchema,
  vendorDocumentsMasterDownloadSchema,
  vendorDocumentsVendorRowPresignSchema,
  vendorDocumentsVendorRowCompleteSchema,
  vendorDocumentsVendorRowDownloadSchema,
} from "./vendor-documents.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get(
  "/job-options",
  validateRequest(vendorDocumentsJobOptionsSchema),
  vendorDocumentsController.jobOptions,
);

router.get(
  "/by-job/:jobNo",
  validateRequest(vendorDocumentsByJobSchema),
  vendorDocumentsController.byJob,
);

router.post(
  "/:jobNo/master-bl/presign",
  validateRequest(vendorDocumentsMasterPresignSchema),
  vendorDocumentsController.presignMasterBl,
);

router.post(
  "/:jobNo/master-bl/complete",
  validateRequest(vendorDocumentsMasterCompleteSchema),
  vendorDocumentsController.completeMasterBl,
);

router.get(
  "/:jobNo/master-bl/download",
  validateRequest(vendorDocumentsMasterDownloadSchema),
  vendorDocumentsController.masterBlDownload,
);

router.post(
  "/:jobNo/vendor-row/:rowKey/presign",
  validateRequest(vendorDocumentsVendorRowPresignSchema),
  vendorDocumentsController.presignVendorRow,
);

router.post(
  "/:jobNo/vendor-row/:rowKey/complete",
  validateRequest(vendorDocumentsVendorRowCompleteSchema),
  vendorDocumentsController.completeVendorRow,
);

router.get(
  "/:jobNo/vendor-row/:rowKey/download",
  validateRequest(vendorDocumentsVendorRowDownloadSchema),
  vendorDocumentsController.vendorRowDownload,
);

export default router;
