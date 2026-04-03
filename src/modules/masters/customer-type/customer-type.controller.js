const { customerTypeService } = require("./customer-type.service");
const { toCustomerTypeDto } = require("./customer-type.dto");
const { createMasterController } = require("../shared/createMasterController");

const customerTypeController = createMasterController({
  service: customerTypeService,
  toDto: toCustomerTypeDto,
});

module.exports = { customerTypeController };
