import express from "express";
import {
  createJob,
  deleteClientJob,
  getAllClients,
  singleClientJob,
  updateClientJob,
  updateJobHolder,
  updateLead,
  updateStatus,
} from "../controllers/jobController.js";
import { isAdmin, requiredSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Client
router.post("/create/client/job", requiredSignIn, createJob);

// Get All Client
router.get("/all/client/job", getAllClients);

// Update Client Job
router.post("/update/client/job/:id", requiredSignIn, updateClientJob);

// Update Status
router.patch("/update/status/:id", requiredSignIn, updateStatus);

// Update Lead
router.patch("/update/lead/:id", requiredSignIn, updateLead);

// Update Job Holder
router.patch("/update/jobholder/:id", requiredSignIn, updateJobHolder);

// Single Client Job
router.get("/single/client/:id", requiredSignIn, singleClientJob);

// Delete Client
router.delete("/delete/client/job/:id", requiredSignIn, deleteClientJob);

export default router;
