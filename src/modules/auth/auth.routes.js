const express = require("express");
const { validateRequest } = require("../../middlewares/validateRequest");
const { authLoginSchema } = require("./auth.validation");
const { authController } = require("./auth.controller");

const router = express.Router();

router.post("/login", validateRequest(authLoginSchema), authController.login);

module.exports = router;
