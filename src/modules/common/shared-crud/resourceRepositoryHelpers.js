function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyPopulate(queryBuilder, populate) {
  if (!populate) return queryBuilder;

  if (Array.isArray(populate)) {
    return populate.reduce(
      (builder, populateItem) => builder.populate(populateItem),
      queryBuilder,
    );
  }

  return queryBuilder.populate(populate);
}

async function runPagedQuery({
  model,
  query,
  page,
  limit,
  sortBy,
  sortDir,
  populate,
}) {
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortDir === "asc" ? 1 : -1 };

  const itemsQuery = applyPopulate(model.find(query), populate)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const [items, total] = await Promise.all([
    itemsQuery,
    model.countDocuments(query),
  ]);
  return { items, total };
}

function findActiveById(model, id, populate) {
  const queryBuilder = model.findOne({ _id: id, isDeleted: false });
  return applyPopulate(queryBuilder, populate).lean();
}

function updateActiveById(model, id, patch, populate) {
  const queryBuilder = model.findOneAndUpdate(
    { _id: id, isDeleted: false },
    patch,
    { new: true },
  );
  return applyPopulate(queryBuilder, populate).lean();
}

function softDeleteActiveById(model, id, extraPatch = {}) {
  return model
    .findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), ...extraPatch },
      { new: true },
    )
    .lean();
}

function createCounterFieldHelpers({
  model,
  counterModel,
  counterId,
  fieldName,
}) {
  async function getNextValue() {
    const counter = await counterModel
      .findByIdAndUpdate(
        counterId,
        { $inc: { seq: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .lean();

    return counter.seq;
  }

  async function assignIfMissing(docId) {
    const nextValue = await getNextValue();
    await model.updateOne(
      {
        _id: docId,
        $or: [{ [fieldName]: { $exists: false } }, { [fieldName]: null }],
      },
      { $set: { [fieldName]: nextValue } },
    );
  }

  async function ensureLegacyValues() {
    const legacyRows = await model
      .find({
        isDeleted: false,
        $or: [{ [fieldName]: { $exists: false } }, { [fieldName]: null }],
      })
      .sort({ createdAt: 1 })
      .select("_id")
      .lean();

    for (const row of legacyRows) {
      await assignIfMissing(row._id);
    }
  }

  async function createWithAutoValue(data) {
    const nextValue = await getNextValue();
    return model.create({ ...data, [fieldName]: nextValue });
  }

  return {
    ensureLegacyValues,
    createWithAutoValue,
  };
}

module.exports = {
  createCounterFieldHelpers,
  escapeRegex,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
};
