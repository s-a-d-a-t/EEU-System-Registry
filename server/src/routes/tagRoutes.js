const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/applicationController");
const authenticate = require("../middleware/authMiddleware");

// Distinct frontend/backend stack tags for filter UI / autocomplete
router.get(
    "/",
    authenticate,
    applicationController.getTags
);

module.exports = router;
