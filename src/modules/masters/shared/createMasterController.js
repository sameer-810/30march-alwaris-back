const { sendNoContent, sendSuccess } = require("../../../utils/response");

function createMasterController({ service, toDto }) {
  return {
    async create(req, res, next) {
      try {
        const created = await service.create(req.validated.body);
        sendSuccess(res, { statusCode: 201, data: toDto(created) });
      } catch (e) {
        next(e);
      }
    },

    async list(req, res, next) {
      try {
        const { items, total } = await service.list(req.validated.query);
        sendSuccess(res, {
          data: items.map((item) => toDto(item)),
          meta: { total },
        });
      } catch (e) {
        next(e);
      }
    },

    async get(req, res, next) {
      try {
        const found = await service.get(req.validated.params.id);
        sendSuccess(res, { data: toDto(found) });
      } catch (e) {
        next(e);
      }
    },

    async update(req, res, next) {
      try {
        const updated = await service.update(
          req.validated.params.id,
          req.validated.body,
        );
        sendSuccess(res, { data: toDto(updated) });
      } catch (e) {
        next(e);
      }
    },

    async remove(req, res, next) {
      try {
        await service.remove(req.validated.params.id);
        sendNoContent(res);
      } catch (e) {
        next(e);
      }
    },
  };
}

module.exports = { createMasterController };
