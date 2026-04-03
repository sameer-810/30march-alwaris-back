function toEmployeeDto(doc) {
  return {
    id: String(doc._id),
    employeeId: doc.employeeId,
    isActive: doc.isActive,
    isApproved: doc.isApproved,
    employeeName: doc.employeeName,
    department: doc.department,
    address: doc.address,
    city: doc.city,
    pincode: doc.pincode,
    state: doc.state,
    country: doc.country,
    contactNo: doc.contactNo,
    emailId: doc.emailId,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

module.exports = { toEmployeeDto };
