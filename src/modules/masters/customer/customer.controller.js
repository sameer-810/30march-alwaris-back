const { customerService } = require("./customer.service");
const { toCustomerDto } = require("./customer.dto");
const {
  createResourceController,
} = require("../../common/shared-crud/createResourceController");

const customerController = createResourceController({
  service: customerService,
  toDto: toCustomerDto,
});

module.exports = { customerController };
