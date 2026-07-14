const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/applicationController");

// Distinct frontend/backend stack tags for filter UI / autocomplete.
// Public — supports the guest browse/filter experience.
router.get(
    "/",
    applicationController.getTags
);

module.exports = router;
