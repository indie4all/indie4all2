import express from "express";
const router = express.Router();
import ai_controller from "../controllers/aiController";

// Create a new model
router.post('/models/create', ai_controller.createModel);
// Create a new model
router.post('/models/update', ai_controller.updateModel);
// Create a new section
router.post('/sections/create', ai_controller.createSection);
// Create a new widget
router.post('/widgets/create/:type', ai_controller.createWidget);
// Update a widget in the model
router.post('/widgets/update', ai_controller.updateWidget);
// Get available chatbots
router.get('/chatbots', ai_controller.getChatbots);

export default router;