const { portRepository } = require("./port.repository");
const { createMasterService } = require("../shared/createMasterService");

const portService = createMasterService({
  repository: portRepository,
  notFoundMessage: "Port not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    portCode: payload.portCode,
    portName: payload.portName,
  }),
});

module.exports = { portService };
