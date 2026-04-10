const { lineOfBixService } = require("./line-of-bix.service");
const { toLineOfBixDto } = require("./line-of-bix.dto");
const {
  createResourceController,
} = require("../../common/shared-crud/createResourceController");

const lineOfBixController = createResourceController({
  service: lineOfBixService,
  toDto: toLineOfBixDto,
});

module.exports = { lineOfBixController };
