function toVendorTypeDto(doc) {
  return {
    id: String(doc._id),
    code: typeof doc.code === "number" ? doc.code : null,
    vendorType: doc.vendorType,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

module.exports = { toVendorTypeDto };
