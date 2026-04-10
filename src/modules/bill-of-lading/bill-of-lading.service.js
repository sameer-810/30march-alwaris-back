const {
  createResourceService,
} = require("../common/shared-crud/createResourceService");
const { billOfLadingRepository } = require("./bill-of-lading.repository");

const billOfLadingCrudService = createResourceService({
  repository: billOfLadingRepository,
  notFoundMessage: "Bill of lading record not found",
  createMethod: "createWithAutoHblNo",
});

const billOfLadingService = {
  ...billOfLadingCrudService,
  getNextBlNumber() {
    return billOfLadingRepository.getNextBlNumber();
  },
  getJobOptions() {
    return billOfLadingRepository.getJobOptions();
  },
};

module.exports = {
  billOfLadingService,
};
