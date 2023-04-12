const express = require("express");
const router = express.Router();
const resource_controller = require("../controllers/resourceController");

// Get a remote resource
router.get('/', resource_controller.get);

router.post('/', resource_controller.post);

module.exports = router;