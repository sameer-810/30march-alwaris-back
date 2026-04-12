import express from "express";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { authLoginSchema } from "./auth.validation.js";
import { authController } from "./auth.controller.js";

const router = express.Router();

router.post("/login", validateRequest(authLoginSchema), authController.login);

export default router;
