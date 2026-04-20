import { AppError } from "../../../utils/AppError.js";

function createResourceService({
  repository,
  notFoundMessage,
  createMethod,
  beforeCreate,
  mapCreatePayload,
  beforeUpdate,
  mapUpdatePatch,
}) {
  return {
    async create(payload) {
      if (beforeCreate) {
        await beforeCreate(payload);
      }

      const nextPayload = mapCreatePayload
        ? mapCreatePayload(payload)
        : payload;
      return repository[createMethod](nextPayload);
    },

    list(params) {
      return repository.findMany(params);
    },

    async get(id) {
      const found = await repository.findById(id);
      if (!found) throw new AppError(notFoundMessage, 404);
      return found;
    },

    async update(id, patch) {
      if (beforeUpdate) {
        await beforeUpdate(patch);
      }

      const nextPatch = mapUpdatePatch
        ? await mapUpdatePatch(patch, id)
        : patch;
      const updated = await repository.updateById(id, nextPatch);
      if (!updated) throw new AppError(notFoundMessage, 404);
      return updated;
    },

    async remove(id) {
      const deleted = await repository.softDeleteById(id);
      if (!deleted) throw new AppError(notFoundMessage, 404);
      return deleted;
    },
  };
}

export { createResourceService };
