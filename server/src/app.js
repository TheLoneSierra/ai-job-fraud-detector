import express from "express";
import cors from "cors";
import analysisRoutes from "./routes/analysisRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/analyze", analysisRoutes);

export default app;
