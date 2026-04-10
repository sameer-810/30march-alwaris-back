const { serviceRepository } = require("./service.repository");
const {
  createResourceService,
} = require("../../common/shared-crud/createResourceService");

const serviceService = createResourceService({
  repository: serviceRepository,
  notFoundMessage: "Service not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    serviceType: payload.serviceType,
  }),
});

module.exports = { serviceService };
