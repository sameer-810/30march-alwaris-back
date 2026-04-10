const { customerTypeService } = require("./customer-type.service");
const { toCustomerTypeDto } = require("./customer-type.dto");
const {
  createResourceController,
} = require("../../common/shared-crud/createResourceController");

const customerTypeController = createResourceController({
  service: customerTypeService,
  toDto: toCustomerTypeDto,
});

module.exports = { customerTypeController };
