const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/applicationController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// Create application
router.post(
    "/",
    authenticate,
    authorize("CONTRIBUTOR", "ADMIN", "SUPER_ADMIN"),
    applicationController.createApplication
);

// Get all applications
router.get(
    "/",
    authenticate,
    authorize("VIEWER", "CONTRIBUTOR", "ADMIN", "SUPER_ADMIN"),
    applicationController.getAllApplications
);

// Get single application
router.get(
    "/:id",
    authenticate,
    authorize("VIEWER", "CONTRIBUTOR", "ADMIN", "SUPER_ADMIN"),
    applicationController.getApplicationById
);

// Update application
router.put(
    "/:id",
    authenticate,
    authorize("CONTRIBUTOR", "ADMIN", "SUPER_ADMIN"),
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