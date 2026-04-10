const { vendorAgentRepository } = require("./vendor-agent.repository");
const {
  createResourceService,
} = require("../../common/shared-crud/createResourceService");

const vendorAgentService = createResourceService({
  repository: vendorAgentRepository,
  notFoundMessage: "Vendor / Agent not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    vendorTypeId: payload.vendorTypeId,
    mail: payload.mail || "",
    vendorName: payload.vendorName,
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
  mapUpdatePatch: (patch) => {
    const nextPatch = { ...patch };
    return nextPatch;
  },
});

module.exports = { vendorAgentService };
