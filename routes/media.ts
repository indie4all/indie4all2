import express from "express";
const router = express.Router();
import media_controller from "../controllers/mediaController";

// Get a remote resource
router.get('/:folderId?', media_controller.get);
// Get the thumbnail of a remote resource
router.get('/thumbnail/:fileId', media_controller.thumbnail);
// Get the full content of a remote resource
router.get('/content/:fileId', media_controller.content);

export default router;