const { employeeService } = require("./employee.service");
const { toEmployeeDto } = require("./employee.dto");
const {
  createResourceController,
} = require("../../common/shared-crud/createResourceController");

const employeeController = createResourceController({
  service: employeeService,
  toDto: toEmployeeDto,
});

module.exports = { employeeController };
