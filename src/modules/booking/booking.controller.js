import { bookingService } from "./booking.service.js";
import { toBookingDto } from "./booking.dto.js";
import { createResourceController } from "../common/shared-crud/createResourceController.js";
import { sendSuccess } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const bookingCrudController = createResourceController({
  service: bookingService,
  toDto: toBookingDto,
});

const bookingController = {
  ...bookingCrudController,
  nextReference: asyncHandler(async (_req, res) => {
    const generatedReference = await bookingService.getNextReference();
    sendSuccess(res, { data: { generatedReference } });
  }),
};

export { bookingController };
