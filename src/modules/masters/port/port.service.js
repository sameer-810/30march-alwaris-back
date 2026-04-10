const { portRepository } = require("./port.repository");
const {
  createResourceService,
} = require("../../common/shared-crud/createResourceService");

const portService = createResourceService({
  repository: portRepository,
  notFoundMessage: "Port not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    portCode: payload.portCode,
    portName: payload.portName,
  }),
});

module.exports = { portService };
