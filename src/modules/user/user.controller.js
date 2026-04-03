const { userService } = require("./user.service");
const { toUserDto } = require("./user.dto");
const { sendNoContent, sendSuccess } = require("../../utils/response");

const userController = {
  async create(req, res, next) {
    try {
      const created = await userService.createUser(req.validated.body);
      sendSuccess(res, { statusCode: 201, data: toUserDto(created) });
    } catch (e) {
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const { items, total } = await userService.listUsers(req.validated.query);
      sendSuccess(res, {
        data: items.map((i) => toUserDto(i)),
        meta: { total },
      });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await userService.updateUser(
        req.validated.params.id,
        req.validated.body,
      );
      sendSuccess(res, { data: toUserDto(updated) });
    } catch (e) {
      next(e);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const updated = await userService.resetPassword(
        req.validated.params.id,
        req.validated.body.password,
      );
      sendSuccess(res, { data: toUserDto(updated) });
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      await userService.deleteUser(req.validated.params.id);
      sendNoContent(res);
    } catch (e) {
      next(e);
    }
  },
};

module.exports = { userController };
