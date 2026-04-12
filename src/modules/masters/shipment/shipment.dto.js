function toShipmentDto(doc) {
  return {
    id: String(doc._id),
    code: typeof doc.code === "number" ? doc.code : null,
    shipmentType: doc.shipmentType,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export { toShipmentDto };
