import projectModel from "../models/projectModel.js";
import taskModel from "../models/taskModel";

// Create Task
export const createTask = async (req, res) => {
  try {
    const {
      projectId,
      jobHolder,
      task,
      hours,
      start_Date,
      deadline,
      job_Date,
      status,
      Lead,
    } = req.body;

    if (!projectId) {
      return res.status(400).send({
        success: false,
        message: "Project Id is required!",
      });
    }
    if (!jobHolder || !Lead) {
      return res.status(400).send({
        success: false,
        message: "jobHolder & Lead are required!",
      });
    }

    const project = await projectModel.findById(projectId);
    if (!project) {
      return res.status(400).send({
        success: false,
        message: "Project not found!",
      });
    }

    const tasks = await taskModel.create({
      project: project,
      jobHolder,
      task,
      hours,
      start_Date,
      deadline,
      job_Date,
      status,
      Lead,
    });

    res.status(200).send({
      success: true,
      message: "Task created successfully!",
      task: tasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      messsage: "Error in create task!",
      error: error,
    });
  }
};

// Update Task
