const { lineOfBixRepository } = require("./line-of-bix.repository");
const { createMasterService } = require("../shared/createMasterService");

const lineOfBixService = createMasterService({
  repository: lineOfBixRepository,
  notFoundMessage: "Line Of BIX not found",
  createMethod: "createWithAutoCounter",
  mapCreatePayload: (payload) => ({
    code: payload.code,
    lineOfBix: payload.lineOfBix,
  }),
});

module.exports = { lineOfBixService };
