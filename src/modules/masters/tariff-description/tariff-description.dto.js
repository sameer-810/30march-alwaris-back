function toTariffDescriptionDto(doc) {
  return {
    id: String(doc._id),
    counter: typeof doc.counter === "number" ? doc.counter : null,
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export { toTariffDescriptionDto };
