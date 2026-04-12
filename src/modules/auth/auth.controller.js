const { authService } = require("./auth.service");
const { sendSuccess } = require("../../utils/response");
const { asyncHandler } = require("../../utils/asyncHandler");

const authController = {
  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.validated.body);
    sendSuccess(res, { data: result });
  }),
};

module.exports = { authController };
