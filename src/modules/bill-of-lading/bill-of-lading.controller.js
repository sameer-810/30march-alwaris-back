const {
  createResourceController,
} = require("../common/shared-crud/createResourceController");
const { sendSuccess } = require("../../utils/response");
const { asyncHandler } = require("../../utils/asyncHandler");
const { billOfLadingService } = require("./bill-of-lading.service");
const { toBillOfLadingDto } = require("./bill-of-lading.dto");

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

module.exports = {
  billOfLadingController,
};
