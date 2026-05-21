import express from "express";
import multer from "multer";
import {
  analyzeText,
  extractDocumentText,
  searchCompanyIntel,
} from "../controllers/analysisController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/intel", searchCompanyIntel);
router.post("/extract", upload.single("document"), extractDocumentText);
router.post("/", upload.single("document"), analyzeText);

export default router;
