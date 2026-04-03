const { termsConditionService } = require("./terms-condition.service");
const { toTermsConditionDto } = require("./terms-condition.dto");
const { createMasterController } = require("../shared/createMasterController");

const termsConditionController = createMasterController({
  service: termsConditionService,
  toDto: toTermsConditionDto,
});

module.exports = { termsConditionController };
