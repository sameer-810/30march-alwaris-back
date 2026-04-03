const { customerTypeRepository } = require("./customer-type.repository");
const { createMasterService } = require("../shared/createMasterService");

const customerTypeService = createMasterService({
  repository: customerTypeRepository,
  notFoundMessage: "Customer type not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    customerType: payload.customerType,
  }),
});

module.exports = { customerTypeService };
