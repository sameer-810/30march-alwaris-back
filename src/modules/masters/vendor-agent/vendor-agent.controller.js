const { vendorAgentService } = require("./vendor-agent.service");
const { toVendorAgentDto } = require("./vendor-agent.dto");
const { createMasterController } = require("../shared/createMasterController");

const vendorAgentController = createMasterController({
  service: vendorAgentService,
  toDto: toVendorAgentDto,
});

module.exports = { vendorAgentController };
