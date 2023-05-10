import express from "express";
const router = express.Router();
import translation_controller from "../controllers/translationController";
import { AzureTranslationService } from "../services/translation/AzureTranslationService";


// Check if the translation service is available
router.use((req: any, res: any, next) => {

    if (process.env.TRANSLATION_TYPE !== "AZURE") {
        res.status(500).send("Translation service not available");
        return;
    }
    req.translator = new AzureTranslationService();
    next();
});

// Create a new translation
router.post('/', translation_controller.post);

// Gets the status of the current 
router.get('/status', translation_controller.status);

export default router;