import express from "express";
const router = express.Router();
import resource_controller from "../controllers/resourceController";

// Get a remote resource
router.get('/', resource_controller.get);

router.post('/', resource_controller.post);

export default router;