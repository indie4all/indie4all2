const express = require("express");
const router = express.Router();
const model_controller = require("../controllers/modelController");

// Save a given model
router.post('/save', model_controller.save);

// Preview a given model
router.post('/preview', model_controller.preview);

// Export a given model as an HTML page
router.post('/publish', model_controller.publish);

// Export a given model as a SCORM package
router.post('/scorm', model_controller.scorm);

module.exports = router;