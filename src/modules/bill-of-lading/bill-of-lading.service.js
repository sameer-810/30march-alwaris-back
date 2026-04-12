import { createResourceService } from "../common/shared-crud/createResourceService.js";
import { billOfLadingRepository } from "./bill-of-lading.repository.js";

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

export { billOfLadingService };
