import { createResourceController } from "../common/shared-crud/createResourceController.js";
import { sendSuccess } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { billOfLadingService } from "./bill-of-lading.service.js";
import { toBillOfLadingDto } from "./bill-of-lading.dto.js";

const billOfLadingCrudController = createResourceController({
  service: billOfLadingService,
  toDto: toBillOfLadingDto,
});

const billOfLadingController = {
  ...billOfLadingCrudController,

  nextBlNumber: asyncHandler(async (_req, res) => {
    const blNumber = await billOfLadingService.getNextBlNumber();
    sendSuccess(res, { data: { blNumber } });
  }),

  jobOptions: asyncHandler(async (_req, res) => {
    const options = await billOfLadingService.getJobOptions();
    sendSuccess(res, { data: options });
  }),
};

export { billOfLadingController };
