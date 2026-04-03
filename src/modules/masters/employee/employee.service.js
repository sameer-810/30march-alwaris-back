const { employeeRepository } = require("./employee.repository");
const { createMasterService } = require("../shared/createMasterService");

const employeeService = createMasterService({
  repository: employeeRepository,
  notFoundMessage: "Employee not found",
  createMethod: "createWithAutoId",
  mapCreatePayload: (payload) => ({
    isActive: typeof payload.isActive === "boolean" ? payload.isActive : true,
    isApproved:
      typeof payload.isApproved === "boolean" ? payload.isApproved : false,
    employeeName: payload.employeeName,
    department: payload.department,
    address: payload.address,
    city: payload.city,
    pincode: payload.pincode,
    state: payload.state,
    country: payload.country,
    contactNo: payload.contactNo,
    emailId: payload.emailId,
  }),
});

module.exports = { employeeService };
