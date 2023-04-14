import express from "express";
const router = express.Router();
import translation_controller from "../controllers/translationController";

// Create a new translation
router.post('/', translation_controller.post);

export default router;