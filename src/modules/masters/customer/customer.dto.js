function toCustomerDto(doc) {
  return {
    id: String(doc._id),
    code: doc.code,
    customerTypeId:
      typeof doc.customerTypeId === "object"
        ? String(doc.customerTypeId._id)
        : String(doc.customerTypeId),
    customerType:
      typeof doc.customerTypeId === "object"
        ? doc.customerTypeId.customerType
        : undefined,
    mail: doc.mail,
    customerName: doc.customerName,
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

module.exports = { toCustomerDto };
