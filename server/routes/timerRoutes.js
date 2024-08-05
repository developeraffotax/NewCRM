import express from "express";
import { requiredSignIn } from "../middlewares/authMiddleware.js";
import {
  startTimer,
  stopTimer,
  timerStatus,
  totalTime,
} from "../controllers/timerController.js";

const router = express.Router();

// Start Timer
router.post("/start/timer", requiredSignIn, startTimer);

// Stop Timer
router.put("/stop/timer/:id", requiredSignIn, stopTimer);

// Get timer Status
router.get("/status", requiredSignIn, timerStatus);

// Total time
router.get("/total_time/:id", requiredSignIn, totalTime);
export default router;
