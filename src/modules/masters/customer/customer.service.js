const { customerRepository } = require("./customer.repository");
const {
  createResourceService,
} = require("../../common/shared-crud/createResourceService");

const customerService = createResourceService({
  repository: customerRepository,
  notFoundMessage: "Customer not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    customerTypeId: payload.customerTypeId,
    mail: payload.mail || "",
    customerName: payload.customerName,
    address: payload.address,
    city: payload.city,
    country: payload.country,
    state: payload.state,
    pincode: payload.pincode,
    contactPerson: payload.contactPerson,
    contactNo: payload.contactNo,
    emailId: payload.emailId,
    additionalEmailIds: payload.additionalEmailIds || [],
    gstVatNo: payload.gstVatNo || "",
    creditDays: typeof payload.creditDays === "number" ? payload.creditDays : 0,
    stateCode: payload.stateCode || "",
    panNo: payload.panNo || "",
  }),
});

module.exports = { customerService };
