const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const validate = require("../middleware/validate");
const {
    createUserSchema,
    updateUserSchema
} = require("../validations/userValidation");

// User management is a Super Admin responsibility (SRS §3 / §7)

// Create user
router.post(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(createUserSchema),
    userController.createUser
);

// Get all users
router.get(
    "/",
    authenticate,
    authorize("SUPER_ADMIN"),
    userController.getAllUsers
);

// Get user by ID
router.get(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    userController.getUserById
);

// Update user (role, status, profile)
router.put(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    validate(updateUserSchema),
    userController.updateUser
);

// Delete user
router.delete(
    "/:id",
    authenticate,
    authorize("SUPER_ADMIN"),
    userController.deleteUser
);

module.exports = router;
