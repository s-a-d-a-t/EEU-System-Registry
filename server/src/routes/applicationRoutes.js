const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/applicationController");
const authenticate = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");
const authorize = require("../middleware/authorize");

const validate = require("../middleware/validate");
const {
    createApplicationSchema,
    updateApplicationSchema
} = require("../validations/applicationValidation");

// Create application
router.post(
    "/",
    authenticate,
    authorize("CONTRIBUTOR", "ADMIN", "SUPER_ADMIN"),
    validate(createApplicationSchema),
    applicationController.createApplication
);

// Get all applications — public (guests see published only)
router.get(
    "/",
    optionalAuth,
    applicationController.getAllApplications
);

// Get single application — public (guests see published only)
router.get(
    "/:id",
    optionalAuth,
    applicationController.getApplicationById
);

// Update application
router.put(
    "/:id",
    authenticate,
    authorize("CONTRIBUTOR", "ADMIN", "SUPER_ADMIN"),
    validate(updateApplicationSchema),
    applicationController.updateApplication
);

// Delete application
router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN", "SUPER_ADMIN"),
    applicationController.deleteApplication
);

module.exports = router;