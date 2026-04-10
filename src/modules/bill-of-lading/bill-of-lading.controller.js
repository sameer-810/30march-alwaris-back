const {
  createResourceController,
} = require("../common/shared-crud/createResourceController");
const { sendSuccess } = require("../../utils/response");
const { billOfLadingService } = require("./bill-of-lading.service");
const { toBillOfLadingDto } = require("./bill-of-lading.dto");

const billOfLadingCrudController = createResourceController({
  service: billOfLadingService,
  toDto: toBillOfLadingDto,
});

const billOfLadingController = {
  ...billOfLadingCrudController,

  async nextBlNumber(_req, res, next) {
    try {
      const blNumber = await billOfLadingService.getNextBlNumber();
      sendSuccess(res, { data: { blNumber } });
    } catch (error) {
      next(error);
    }
  },

  async jobOptions(_req, res, next) {
    try {
      const options = await billOfLadingService.getJobOptions();
      sendSuccess(res, { data: options });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = {
  billOfLadingController,
};
