const { vendorAgentService } = require("./vendor-agent.service");
const { toVendorAgentDto } = require("./vendor-agent.dto");
const {
  createResourceController,
} = require("../../common/shared-crud/createResourceController");

const vendorAgentController = createResourceController({
  service: vendorAgentService,
  toDto: toVendorAgentDto,
});

module.exports = { vendorAgentController };
