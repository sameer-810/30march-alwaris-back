import { vendorTypeService } from "./vendor-type.service.js";
import { toVendorTypeDto } from "./vendor-type.dto.js";
import { createResourceController } from "../../common/shared-crud/createResourceController.js";

const vendorTypeController = createResourceController({
  service: vendorTypeService,
  toDto: toVendorTypeDto,
});

export { vendorTypeController };
