function toLineOfBixDto(doc) {
  return {
    id: String(doc._id),
    counter: typeof doc.counter === "number" ? doc.counter : null,
    code: doc.code,
    lineOfBix: doc.lineOfBix,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export { toLineOfBixDto };
