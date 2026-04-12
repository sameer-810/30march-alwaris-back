import { customerService } from "./customer.service.js";
import { toCustomerDto } from "./customer.dto.js";
import { createResourceController } from "../../common/shared-crud/createResourceController.js";

const customerController = createResourceController({
  service: customerService,
  toDto: toCustomerDto,
});

export { customerController };
