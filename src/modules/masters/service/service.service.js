const { serviceRepository } = require("./service.repository");
const { createMasterService } = require("../shared/createMasterService");

const serviceService = createMasterService({
  repository: serviceRepository,
  notFoundMessage: "Service not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    serviceType: payload.serviceType,
  }),
});

module.exports = { serviceService };
