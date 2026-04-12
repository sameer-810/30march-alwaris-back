import { vendorTypeRepository } from "./vendor-type.repository.js";
import { createResourceService } from "../../common/shared-crud/createResourceService.js";

const vendorTypeService = createResourceService({
  repository: vendorTypeRepository,
  notFoundMessage: "Vendor type not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    vendorType: payload.vendorType,
  }),
});

export { vendorTypeService };
