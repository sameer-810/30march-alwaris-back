const { customerService } = require("./customer.service");
const { toCustomerDto } = require("./customer.dto");
const { createMasterController } = require("../shared/createMasterController");

const customerController = createMasterController({
  service: customerService,
  toDto: toCustomerDto,
});

module.exports = { customerController };
