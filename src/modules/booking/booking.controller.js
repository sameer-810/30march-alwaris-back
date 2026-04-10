const { bookingService } = require("./booking.service");
const { toBookingDto } = require("./booking.dto");
const {
  createResourceController,
} = require("../common/shared-crud/createResourceController");
const { sendSuccess } = require("../../utils/response");

const bookingCrudController = createResourceController({
  service: bookingService,
  toDto: toBookingDto,
});

const bookingController = {
  ...bookingCrudController,
  async nextReference(_req, res, next) {
    try {
      const generatedReference = await bookingService.getNextReference();
      sendSuccess(res, { data: { generatedReference } });
    } catch (e) {
      next(e);
    }
  },
};

module.exports = { bookingController };
