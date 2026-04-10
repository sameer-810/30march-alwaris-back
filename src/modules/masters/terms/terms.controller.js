const { termsService } = require("./terms.service");
const { toTermsDto } = require("./terms.dto");
const {
  createResourceController,
} = require("../../common/shared-crud/createResourceController");

const termsController = createResourceController({
  service: termsService,
  toDto: toTermsDto,
});

module.exports = { termsController };
