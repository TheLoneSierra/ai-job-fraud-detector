import express from "express";
import multer from "multer";
import { analyzeText } from "../controllers/analysisController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("document"), analyzeText);

export default router;
