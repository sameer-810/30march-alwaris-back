const { termsRepository } = require("./terms.repository");
const { createMasterService } = require("../shared/createMasterService");

const termsService = createMasterService({
  repository: termsRepository,
  notFoundMessage: "Terms not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    terms: payload.terms,
    description: payload.description,
  }),
});

module.exports = { termsService };
