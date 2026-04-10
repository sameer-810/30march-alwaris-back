const { termsRepository } = require("./terms.repository");
const {
  createResourceService,
} = require("../../common/shared-crud/createResourceService");

const termsService = createResourceService({
  repository: termsRepository,
  notFoundMessage: "Terms not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    terms: payload.terms,
    description: payload.description,
  }),
});

module.exports = { termsService };
