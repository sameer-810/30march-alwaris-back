const { lineOfBixService } = require("./line-of-bix.service");
const { toLineOfBixDto } = require("./line-of-bix.dto");
const { createMasterController } = require("../shared/createMasterController");

const lineOfBixController = createMasterController({
  service: lineOfBixService,
  toDto: toLineOfBixDto,
});

module.exports = { lineOfBixController };
