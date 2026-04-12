function toPortDto(doc) {
  return {
    id: String(doc._id),
    code: typeof doc.code === "number" ? doc.code : null,
    portCode: doc.portCode,
    portName: doc.portName,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export { toPortDto };
