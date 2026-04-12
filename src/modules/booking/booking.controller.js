const { bookingService } = require("./booking.service");
const { toBookingDto } = require("./booking.dto");
const {
  createResourceController,
} = require("../common/shared-crud/createResourceController");
const { sendSuccess } = require("../../utils/response");
const { asyncHandler } = require("../../utils/asyncHandler");

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

module.exports = { bookingController };
