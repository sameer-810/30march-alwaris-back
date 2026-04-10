const { lineOfBixRepository } = require("./line-of-bix.repository");
const {
  createResourceService,
} = require("../../common/shared-crud/createResourceService");

const lineOfBixService = createResourceService({
  repository: lineOfBixRepository,
  notFoundMessage: "Line Of BIX not found",
  createMethod: "createWithAutoCounter",
  mapCreatePayload: (payload) => ({
    code: payload.code,
    lineOfBix: payload.lineOfBix,
  }),
});

module.exports = { lineOfBixService };
