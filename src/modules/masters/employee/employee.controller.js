const { employeeService } = require("./employee.service");
const { toEmployeeDto } = require("./employee.dto");
const { createMasterController } = require("../shared/createMasterController");

const employeeController = createMasterController({
  service: employeeService,
  toDto: toEmployeeDto,
});

module.exports = { employeeController };
