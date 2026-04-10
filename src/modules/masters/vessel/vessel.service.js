const { vesselRepository } = require("./vessel.repository");
const {
  createResourceService,
} = require("../../common/shared-crud/createResourceService");

const vesselService = createResourceService({
  repository: vesselRepository,
  notFoundMessage: "Vessel not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    vesselName: payload.vesselName,
  }),
});

module.exports = { vesselService };
