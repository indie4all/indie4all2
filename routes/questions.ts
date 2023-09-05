import express from "express";
const router = express.Router();
import question_controller from "../controllers/questionsController";

// Get a remote resource
router.get('/', question_controller.get);


export default router;