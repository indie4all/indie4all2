import express from "express";
const router = express.Router();
import widget_controller from "../controllers/widgetController";

// Get a remote resource
router.get('/', widget_controller.get);


export default router;