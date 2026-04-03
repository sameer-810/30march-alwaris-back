function toTermsConditionDto(doc) {
  const line = doc.lineOfBixId || null;

  return {
    id: String(doc._id),
    counter: typeof doc.counter === "number" ? doc.counter : null,
    lineOfBixId: line?._id ? String(line._id) : null,
    code: line?.code || "",
    lineBix: line?.lineOfBix || "",
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

module.exports = { toTermsConditionDto };
