import express from "express";
import { isAdmin, requiredSignIn } from "../middlewares/authMiddleware.js";
import {
  createTask,
  getAllTasks,
  getSingleTask,
  updateAlocateTask,
  updateJobHolderLS,
  updatetaskProject,
} from "../controllers/TaskController.js";

const router = express.Router();

// Create task
router.post("/create/task", requiredSignIn, createTask);

// Get All Tasks
router.get("/get/all", getAllTasks);

// Single task
router.get("/get/single/:id", getSingleTask);

// Update task/Project
router.put("/update/project/:id", requiredSignIn, updatetaskProject);

// Update JobHolder -/- Lead | Status
router.put("/update/task/JLS/:id", requiredSignIn, updateJobHolderLS);

// Update Allocate Task
router.put("/update/allocate/task/:id", requiredSignIn, updateAlocateTask);

export default router;
