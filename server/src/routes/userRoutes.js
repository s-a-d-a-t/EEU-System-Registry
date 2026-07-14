const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const validate = require("../middleware/validate");
const updateUserSchema = require("../validations/userValidation")

// Get all users
router.get(
    "/",
    authenticate,
    authorize("ADMIN", "SUPER_ADMIN"),

    userController.getAllUsers
);

// Get user by ID
router.get(
    "/:id",
    authenticate,
    authorize("ADMIN", "SUPER_ADMIN"),
    userController.getUserById
);

// Update user
router.put(
    "/:id",
    authenticate,
    authorize("ADMIN", "SUPER_ADMIN"),
    validate(updateUserSchema),
    userController.updateUser
);

// Delete user
router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN", "SUPER_ADMIN"),
    userController.deleteUser
);

module.exports = router;