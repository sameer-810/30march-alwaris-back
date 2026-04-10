const { termsConditionService } = require("./terms-condition.service");
const { toTermsConditionDto } = require("./terms-condition.dto");
const {
  createResourceController,
} = require("../../common/shared-crud/createResourceController");

const termsConditionController = createResourceController({
  service: termsConditionService,
  toDto: toTermsConditionDto,
});

module.exports = { termsConditionController };
