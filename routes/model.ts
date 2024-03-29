import express, { Request, Response } from "express";
const router = express.Router();
import model_controller from "../controllers/modelController";
import { AnalyticsService } from "../services/analytics/AnalyticsService";

router.use((req : Request, res: Response, next) => {
    const analyzer = AnalyticsService.create();
    analyzer.setField("user_id", req.session.id)
    analyzer.entrance(req.originalUrl);
    res.locals.analyzer = analyzer;
    next();
})

// Save a given model
router.post('/save', model_controller.save);

// Preview a given model
router.post('/preview', model_controller.preview);

// Export a given model as an HTML page
router.post('/publish', model_controller.publish);

//Export a given model to Netlify
router.post('/publishToNetlify', model_controller.publishToNetlify);

// Export a given model as a SCORM package
router.post('/scorm', model_controller.scorm);

export default router;