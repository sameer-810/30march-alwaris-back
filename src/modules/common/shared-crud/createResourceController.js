import { sendNoContent, sendSuccess } from "../../../utils/response.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

function createResourceController({ service, toDto }) {
  return {
    create: asyncHandler(async (req, res) => {
      const created = await service.create(req.validated.body);
      sendSuccess(res, { statusCode: 201, data: toDto(created) });
    }),

    list: asyncHandler(async (req, res) => {
      const { items, ...meta } = await service.list(req.validated.query);
      sendSuccess(res, {
        data: items.map((item) => toDto(item)),
        meta,
      });
    }),

    get: asyncHandler(async (req, res) => {
      const found = await service.get(req.validated.params.id);
      sendSuccess(res, { data: toDto(found) });
    }),

    update: asyncHandler(async (req, res) => {
      const updated = await service.update(
        req.validated.params.id,
        req.validated.body,
      );
      sendSuccess(res, { data: toDto(updated) });
    }),

    remove: asyncHandler(async (req, res) => {
      await service.remove(req.validated.params.id);
      sendNoContent(res);
    }),
  };
}

export { createResourceController };
