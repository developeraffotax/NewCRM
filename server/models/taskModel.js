import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
    },
    jobHolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    task: {
      type: String,
      trim: true,
    },
    hours: {
      type: String,
    },
    start_Date: {
      type: Date,
      default: new Date(),
    },
    deadline: {
      type: Date,
      default: new Date(),
    },
    job_Date: {
      type: Date,
      default: new Date(),
    },
    status: {
      type: String,
      default: "Process",
    },
    Lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    estimate_Time: {
      type: String,
      default: "Om",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tasks", taskSchema);
