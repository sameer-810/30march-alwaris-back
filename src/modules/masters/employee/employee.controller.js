import { employeeService } from "./employee.service.js";
import { toEmployeeDto } from "./employee.dto.js";
import { createResourceController } from "../../common/shared-crud/createResourceController.js";

const employeeController = createResourceController({
  service: employeeService,
  toDto: toEmployeeDto,
});

export { employeeController };
