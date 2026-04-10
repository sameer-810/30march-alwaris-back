const { customerTypeRepository } = require("./customer-type.repository");
const {
  createResourceService,
} = require("../../common/shared-crud/createResourceService");

const customerTypeService = createResourceService({
  repository: customerTypeRepository,
  notFoundMessage: "Customer type not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    customerType: payload.customerType,
  }),
});

module.exports = { customerTypeService };
