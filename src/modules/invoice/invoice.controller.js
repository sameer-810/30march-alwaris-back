import { createResourceController } from "../common/shared-crud/createResourceController.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { AppError } from "../../utils/AppError.js";
import { invoiceService } from "./invoice.service.js";
import { toInvoiceDto } from "./invoice.dto.js";

const invoiceCrudController = createResourceController({
  service: invoiceService,
  toDto: toInvoiceDto,
});

const invoiceController = {
  ...invoiceCrudController,

  create: asyncHandler(async (req, res) => {
    const payload = {
      ...req.validated.body,
      createdBy:
        req.validated.body.createdBy || req.user?.name || req.user?.email || "",
    };

    const created = await invoiceService.create(payload);
    sendSuccess(res, { statusCode: 201, data: toInvoiceDto(created) });
  }),

  update: asyncHandler(async (req, res) => {
    const payload = {
      ...req.validated.body,
      checker: req.validated.body.checker || req.user?.name || "",
    };

    const updated = await invoiceService.update(
      req.validated.params.id,
      payload,
    );
    sendSuccess(res, { data: toInvoiceDto(updated) });
  }),

  jobOptions: asyncHandler(async (_req, res) => {
    const options = await invoiceService.getJobOptions();
    sendSuccess(res, { data: options });
  }),

  search: asyncHandler(async (req, res) => {
    const data = await invoiceService.getSearchSnapshot({
      jobNo: Number(req.validated.query.jobNo),
      invoiceType: req.validated.query.invoiceType,
    });

    if (!data) {
      throw new AppError("Done booking not found for selected Job No", 404);
    }

    sendSuccess(res, { data });
  }),
};

export { invoiceController };
