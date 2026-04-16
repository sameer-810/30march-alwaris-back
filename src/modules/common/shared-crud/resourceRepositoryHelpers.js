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

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return { items, total, totalPages, page, limit, hasNextPage, hasPrevPage };
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

  async function createWithAutoValue(data, maxRetries = 3) {
    const doc = new model(data);

    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        doc[fieldName] = await getNextValue();
        await doc.validate();
        return await doc.save();
      } catch (error) {
        // 11000 is MongoDB's Duplicate Key Error code.
        // If the collision was exactly on our sequence field, retry.
        const isDuplicateKey = error.code === 11000;
        const isTargetField =
          error.keyPattern && error.keyPattern[fieldName] === 1;

        if (isDuplicateKey && isTargetField) {
          attempt++;
          continue; // Loop naturally grabs the next sequence and attempts to save again
        }

        throw error; // If it's a different error (e.g. timeout, or different unique field), throw it.
      }
    }

    throw new Error(
      `Failed to generate a unique ${fieldName} after ${maxRetries} attempts.`,
    );
  }

  return {
    createWithAutoValue,
  };
}

export {
  createCounterFieldHelpers,
  escapeRegex,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
};
