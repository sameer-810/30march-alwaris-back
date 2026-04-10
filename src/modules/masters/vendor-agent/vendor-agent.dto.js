function toVendorAgentDto(doc) {
  const resolvedVendorType = doc.vendorTypeId || doc.customerTypeId;

  return {
    id: String(doc._id),
    code: doc.code,
    vendorTypeId:
      typeof resolvedVendorType === "object"
        ? String(resolvedVendorType._id)
        : String(resolvedVendorType || ""),
    vendorType:
      typeof resolvedVendorType === "object"
        ? resolvedVendorType.vendorType || resolvedVendorType.customerType
        : undefined,
    mail: doc.mail,
    vendorName: doc.vendorName,
    address: doc.address,
    city: doc.city,
    country: doc.country,
    state: doc.state,
    pincode: doc.pincode,
    contactPerson: doc.contactPerson,
    contactNo: doc.contactNo,
    emailId: doc.emailId,
    additionalEmailIds: doc.additionalEmailIds || [],
    gstVatNo: doc.gstVatNo,
    creditDays: doc.creditDays,
    stateCode: doc.stateCode,
    panNo: doc.panNo,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

module.exports = { toVendorAgentDto };
