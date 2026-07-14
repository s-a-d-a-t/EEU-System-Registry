const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const {registerSchema,loginSchema} = require("../validations/authValidations");

const authController = require("../controllers/authController");

router.post(
    "/register",
    validate(registerSchema),
    authController.register
);

router.post(
    "/login",
    validate(loginSchema),
    authController.login
);

module.exports = router;