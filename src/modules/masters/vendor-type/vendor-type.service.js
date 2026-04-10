const { vendorTypeRepository } = require("./vendor-type.repository");
const {
  createResourceService,
} = require("../../common/shared-crud/createResourceService");

const vendorTypeService = createResourceService({
  repository: vendorTypeRepository,
  notFoundMessage: "Vendor type not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    vendorType: payload.vendorType,
  }),
});

module.exports = { vendorTypeService };
