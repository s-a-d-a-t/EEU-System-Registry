const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const authenticate  = require("../middleware/authMiddleware");

console.log("authenticate type:", typeof authenticate);
console.log("authenticate is:", authenticate);

// Create application
router.post(
    "/",
    authenticate,
    applicationController.createApplication  // ✅ Exists
);

// Get all applications
router.get(
    "/",
    authenticate,
    applicationController.getAllApplications  // ✅ Exists
);

// Get single application
router.get(
    "/:id",
    authenticate,
    applicationController.getApplicationsById  // ✅ FIXED: Added 's'
);

module.exports = router;