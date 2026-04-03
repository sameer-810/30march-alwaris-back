const { authService } = require("./auth.service");
const { sendSuccess } = require("../../utils/response");

const authController = {
  async login(req, res, next) {
    try {
      const result = await authService.login(req.validated.body);
      sendSuccess(res, { data: result });
    } catch (e) {
      next(e);
    }
  },
};

module.exports = { authController };
