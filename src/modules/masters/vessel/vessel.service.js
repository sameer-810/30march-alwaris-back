const { vesselRepository } = require("./vessel.repository");
const { createMasterService } = require("../shared/createMasterService");

const vesselService = createMasterService({
  repository: vesselRepository,
  notFoundMessage: "Vessel not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    vesselName: payload.vesselName,
  }),
});

module.exports = { vesselService };
