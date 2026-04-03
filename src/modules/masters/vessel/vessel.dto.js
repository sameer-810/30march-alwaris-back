function toVesselDto(doc) {
  return {
    id: String(doc._id),
    code: typeof doc.code === "number" ? doc.code : null,
    vesselName: doc.vesselName,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

module.exports = { toVesselDto };
