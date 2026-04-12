const { userService } = require("./user.service");
const { toUserDto } = require("./user.dto");
const { sendNoContent, sendSuccess } = require("../../utils/response");
const { asyncHandler } = require("../../utils/asyncHandler");

const userController = {
  create: asyncHandler(async (req, res) => {
    const created = await userService.createUser(req.validated.body);
    sendSuccess(res, { statusCode: 201, data: toUserDto(created) });
  }),

  list: asyncHandler(async (req, res) => {
    const { items, ...meta } = await userService.listUsers(req.validated.query);
    sendSuccess(res, {
      data: items.map((i) => toUserDto(i)),
      meta,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const updated = await userService.updateUser(
      req.validated.params.id,
      req.validated.body,
    );
    sendSuccess(res, { data: toUserDto(updated) });
  }),

  resetPassword: asyncHandler(async (req, res) => {
    const updated = await userService.resetPassword(
      req.validated.params.id,
      req.validated.body.password,
    );
    sendSuccess(res, { data: toUserDto(updated) });
  }),

  remove: asyncHandler(async (req, res) => {
    await userService.deleteUser(req.validated.params.id);
    sendNoContent(res);
  }),
};

module.exports = { userController };
