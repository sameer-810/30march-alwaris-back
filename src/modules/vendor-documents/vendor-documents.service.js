import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppError } from "../../utils/AppError.js";
import { env } from "../../config/env.js";
import { s3Client } from "./vendor-documents.s3.js";
import { vendorDocumentsRepository } from "./vendor-documents.repository.js";

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const PRESIGNED_UPLOAD_EXPIRES_IN = 60 * 5;
const PRESIGNED_DOWNLOAD_EXPIRES_IN = 60 * 10;

function safeSegment(value) {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function getRefId(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
}

function getRefLabel(value) {
  if (!value) return "";
  if (typeof value === "string") return "";
  if (typeof value === "object") {
    return String(value.vendorName || value.description || "");
  }
  return "";
}

function buildRowKey(item, rowIndex) {
  const vendorPart = safeSegment(getRefId(item?.vendor));
  const chargePart = safeSegment(getRefId(item?.chargeDescription));
  const amountPart = Number(item?.amount || 0).toFixed(2);
  return `${rowIndex}-${vendorPart}-${chargePart}-${amountPart}`;
}

function buildExpenseRows(booking, storedDoc) {
  const storedRows = Array.isArray(storedDoc?.vendorRowFiles)
    ? storedDoc.vendorRowFiles
    : [];
  const storedMap = new Map(storedRows.map((row) => [row.rowKey, row]));

  const expenseRows = Array.isArray(booking?.expenseDetails)
    ? booking.expenseDetails
    : [];

  return expenseRows.map((row, rowIndex) => {
    const rowKey = buildRowKey(row, rowIndex);
    const stored = storedMap.get(rowKey);

    return {
      rowKey,
      rowIndex,
      vendorId: getRefId(row?.vendor),
      vendorName: getRefLabel(row?.vendor) || "-",
      descriptionId: getRefId(row?.chargeDescription),
      description: getRefLabel(row?.chargeDescription) || "-",
      amount: Number(row?.amount || 0),
      fileName: stored?.file?.fileName || "",
      uploadedAt: stored?.file?.uploadedAt || null,
      status: stored?.file ? "Uploaded" : "Pending",
    };
  });
}

function normalizeUploadPayload(payload = {}) {
  const fileName = String(payload.fileName || "").trim();
  const mimeType = String(payload.mimeType || payload.contentType || "").trim();
  const size = Number(payload.size || 0);

  if (!fileName) {
    throw new AppError("File name is required", 400);
  }

  if (!Number.isFinite(size) || size <= 0) {
    throw new AppError("Invalid file size", 400);
  }

  if (size > MAX_UPLOAD_SIZE) {
    throw new AppError("File size exceeds 10MB", 400);
  }

  return {
    fileName,
    mimeType: mimeType || "application/octet-stream",
    size,
  };
}

function assertKeyPrefix(key, prefix) {
  if (!String(key || "").startsWith(prefix)) {
    throw new AppError("Invalid file key", 400);
  }
}

function getMasterBlPrefix(jobNo) {
  return `vendor-documents/job-${jobNo}/master-bl/`;
}

function getVendorRowsPrefix(jobNo) {
  return `vendor-documents/job-${jobNo}/vendor-rows/`;
}

function buildStoredFileMeta({ key, upload }) {
  return {
    key,
    fileName: upload.fileName,
    originalName: upload.fileName,
    mimeType: upload.mimeType,
    size: upload.size,
    uploadedAt: new Date(),
  };
}

function buildPresignResponse({ signed, key, upload, extra = {} }) {
  return {
    ...signed,
    key,
    fileName: upload.fileName,
    mimeType: upload.mimeType,
    size: upload.size,
    ...extra,
  };
}

async function createUploadUrl({ key, mimeType }) {
  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_UPLOAD_EXPIRES_IN,
  });

  return {
    uploadUrl,
    expiresIn: PRESIGNED_UPLOAD_EXPIRES_IN,
  };
}

async function getDownloadUrl(key) {
  const command = new GetObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_DOWNLOAD_EXPIRES_IN,
  });
}

async function deleteObjectBestEffort(key) {
  if (!key) return;

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: key,
      }),
    );
  } catch {
    // Best-effort cleanup to prevent upload flow failures.
  }
}

async function getBookingOrThrow(jobNo) {
  const booking = await vendorDocumentsRepository.getBookingByJobNo(jobNo);
  if (!booking) {
    throw new AppError("Job not found", 404);
  }
  return booking;
}

async function getExpenseRowContextOrThrow(jobNo, rowKey) {
  const booking = await getBookingOrThrow(jobNo);
  const rows = buildExpenseRows(booking, null);
  const row = rows.find((item) => item.rowKey === rowKey);

  if (!row) {
    throw new AppError("Invalid vendor document row", 400);
  }

  return { booking, row };
}

const vendorDocumentsService = {
  getJobOptions() {
    return vendorDocumentsRepository.getJobOptions();
  },

  async getByJobNo(jobNo) {
    const booking = await getBookingOrThrow(jobNo);
    const stored = await vendorDocumentsRepository.findByJobNo(jobNo);
    const rows = buildExpenseRows(booking, stored);

    return {
      jobNo,
      masterBlFileName: stored?.masterBlFile?.fileName || "",
      masterBlUploadedAt: stored?.masterBlFile?.uploadedAt || null,
      hasMasterBl: Boolean(stored?.masterBlFile),
      vendorDocuments: rows,
    };
  },

  async createMasterBlUploadUrl(jobNo, payload) {
    await getBookingOrThrow(jobNo);
    const upload = normalizeUploadPayload(payload);

    const key = `${getMasterBlPrefix(jobNo)}${Date.now()}-${safeSegment(upload.fileName)}`;
    const signed = await createUploadUrl({
      key,
      mimeType: upload.mimeType,
    });

    return buildPresignResponse({ signed, key, upload });
  },

  async completeMasterBlUpload(jobNo, payload) {
    const booking = await getBookingOrThrow(jobNo);
    const upload = normalizeUploadPayload(payload);
    const key = String(payload.key || "").trim();
    const existingDoc = await vendorDocumentsRepository.findByJobNo(jobNo);
    const previousKey = String(existingDoc?.masterBlFile?.key || "").trim();

    assertKeyPrefix(key, getMasterBlPrefix(jobNo));

    await vendorDocumentsRepository.saveMasterBlFile({
      jobNo,
      bookingId: booking._id,
      file: buildStoredFileMeta({ key, upload }),
    });

    if (previousKey && previousKey !== key) {
      await deleteObjectBestEffort(previousKey);
    }

    return { fileName: upload.fileName };
  },

  async getMasterBlDownloadUrl(jobNo) {
    await getBookingOrThrow(jobNo);
    const stored = await vendorDocumentsRepository.findByJobNo(jobNo);

    if (!stored?.masterBlFile?.key) {
      throw new AppError("Master BL file not uploaded", 404);
    }

    return getDownloadUrl(stored.masterBlFile.key);
  },

  async createVendorRowUploadUrl(jobNo, rowKey, payload) {
    await getExpenseRowContextOrThrow(jobNo, rowKey);
    const upload = normalizeUploadPayload(payload);

    const key = `${getVendorRowsPrefix(jobNo)}${safeSegment(rowKey)}/${Date.now()}-${safeSegment(upload.fileName)}`;
    const signed = await createUploadUrl({
      key,
      mimeType: upload.mimeType,
    });

    return buildPresignResponse({ signed, key, upload, extra: { rowKey } });
  },

  async completeVendorRowUpload(jobNo, rowKey, payload) {
    const { booking, row } = await getExpenseRowContextOrThrow(jobNo, rowKey);
    const upload = normalizeUploadPayload(payload);
    const key = String(payload.key || "").trim();
    const existingDoc = await vendorDocumentsRepository.findByJobNo(jobNo);
    const previousKey = String(
      (existingDoc?.vendorRowFiles || []).find(
        (item) => item?.rowKey === rowKey,
      )?.file?.key || "",
    ).trim();

    assertKeyPrefix(key, getVendorRowsPrefix(jobNo));

    await vendorDocumentsRepository.saveVendorRowFile({
      jobNo,
      bookingId: booking._id,
      rowKey,
      rowIndex: row.rowIndex,
      vendor: row.vendorId,
      chargeDescription: row.descriptionId,
      amount: row.amount,
      file: buildStoredFileMeta({ key, upload }),
    });

    if (previousKey && previousKey !== key) {
      await deleteObjectBestEffort(previousKey);
    }

    return { fileName: upload.fileName, rowKey };
  },

  async getVendorRowDownloadUrl(jobNo, rowKey) {
    await getBookingOrThrow(jobNo);
    const stored = await vendorDocumentsRepository.findByJobNo(jobNo);

    const rows = Array.isArray(stored?.vendorRowFiles)
      ? stored.vendorRowFiles
      : [];
    const row = rows.find((item) => item.rowKey === rowKey);

    if (!row?.file?.key) {
      throw new AppError("Vendor document not uploaded", 404);
    }

    return getDownloadUrl(row.file.key);
  },
};

export { vendorDocumentsService };
