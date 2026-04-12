function toCustomerTypeDto(doc) {
  return {
    id: String(doc._id),
    code: typeof doc.code === "number" ? doc.code : null,
    customerType: doc.customerType,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export { toCustomerTypeDto };
