const { termsService } = require("./terms.service");
const { toTermsDto } = require("./terms.dto");
const { createMasterController } = require("../shared/createMasterController");

const termsController = createMasterController({
  service: termsService,
  toDto: toTermsDto,
});

module.exports = { termsController };
