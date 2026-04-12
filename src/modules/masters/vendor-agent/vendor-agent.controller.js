import { vendorAgentService } from "./vendor-agent.service.js";
import { toVendorAgentDto } from "./vendor-agent.dto.js";
import { createResourceController } from "../../common/shared-crud/createResourceController.js";

const vendorAgentController = createResourceController({
  service: vendorAgentService,
  toDto: toVendorAgentDto,
});

export { vendorAgentController };
