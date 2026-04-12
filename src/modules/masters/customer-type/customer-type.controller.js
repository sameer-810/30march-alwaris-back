import { customerTypeService } from "./customer-type.service.js";
import { toCustomerTypeDto } from "./customer-type.dto.js";
import { createResourceController } from "../../common/shared-crud/createResourceController.js";

const customerTypeController = createResourceController({
  service: customerTypeService,
  toDto: toCustomerTypeDto,
});

export { customerTypeController };
