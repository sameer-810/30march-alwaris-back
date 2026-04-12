import { customerTypeRepository } from "./customer-type.repository.js";
import { createResourceService } from "../../common/shared-crud/createResourceService.js";

const customerTypeService = createResourceService({
  repository: customerTypeRepository,
  notFoundMessage: "Customer type not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    customerType: payload.customerType,
  }),
});

export { customerTypeService };
