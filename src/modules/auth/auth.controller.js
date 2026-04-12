import { authService } from "./auth.service.js";
import { sendSuccess } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const authController = {
  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.validated.body);
    sendSuccess(res, { data: result });
  }),
};

export { authController };
