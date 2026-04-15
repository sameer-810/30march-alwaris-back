import { createResourceController } from "../common/shared-crud/createResourceController.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { AppError } from "../../utils/AppError.js";
import { costSheetService } from "./cost-sheet.service.js";
import { toCostSheetDto } from "./cost-sheet.dto.js";

const costSheetCrudController = createResourceController({
  service: costSheetService,
  toDto: toCostSheetDto,
});

const costSheetController = {
  ...costSheetCrudController,

  jobOptions: asyncHandler(async (_req, res) => {
    const options = await costSheetService.getJobOptions();
    sendSuccess(res, { data: options });
  }),

  bookingDetails: asyncHandler(async (req, res) => {
    const jobNo = Number(req.validated.params.jobNo);
    const details = await costSheetService.getBookingSnapshot(jobNo);

    if (!details) {
      throw new AppError("Done booking not found for selected Job No", 404);
    }

    sendSuccess(res, { data: details });
  }),
};

export { costSheetController };
