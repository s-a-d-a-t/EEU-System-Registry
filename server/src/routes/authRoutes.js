const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const validate = require("../middleware/validate");
const authenticate = require("../middleware/authMiddleware");
const { registerSchema, loginSchema } = require("../validations/authValidations");

const authController = require("../controllers/authController");

// Throttle login attempts to slow brute-force attacks (FR-UM-09)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,                    // 5 attempts per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts. Please try again later."
    }
});

router.post(
    "/register",
    validate(registerSchema),
    authController.register
);

router.post(
    "/login",
    loginLimiter,
    validate(loginSchema),
    authController.login
);

router.post(
    "/logout",
    authenticate,
    authController.logout
);

module.exports = router;
