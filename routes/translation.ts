import express from "express";
const router = express.Router();
import translation_controller from "../controllers/translationController";

// Check if the translation service is available
router.use((req, res, next) => {
    if (!process.env.TRANSLATION_ACCESS_TOKEN) {
        res.status(500).send("Translation service not available");
        return;
    }
    next();
});

// Create a new translation
router.post('/', translation_controller.post);

// Gets the status of the current 
router.get('/status', translation_controller.status);

export default router;