const { vendorTypeService } = require("./vendor-type.service");
const { toVendorTypeDto } = require("./vendor-type.dto");
const {
  createResourceController,
} = require("../../common/shared-crud/createResourceController");

const vendorTypeController = createResourceController({
  service: vendorTypeService,
  toDto: toVendorTypeDto,
});

module.exports = { vendorTypeController };
