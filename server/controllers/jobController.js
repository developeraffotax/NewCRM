import jobsModel from "../models/jobsModel.js";

// Create Job
export const createJob = async (req, res) => {
  try {
    const {
      clientName,
      regNumber,
      companyName,
      email,
      totalHours,
      currentDate,
      source,
      clientType,
      country,
      fee,
      ctLogin,
      pyeLogin,
      trLogin,
      vatLogin,
      authCode,
      utr,
      isActive,
      jobs,
    } = req.body;

    // Check for required fields
    if (!clientName || !companyName || !email || !totalHours || !currentDate) {
      return res.status(400).send({
        success: false,
        message: "Please fill the required fields!",
      });
    }

    if (jobs.length === 0) {
      return res.status(400).send({
        success: false,
        message: "At least one job is required!",
      });
    }

    const createdJobs = await Promise.all(
      jobs.map(async (job) => {
        const client = new jobsModel({
          clientName,
          regNumber,
          companyName,
          email,
          totalHours,
          currentDate,
          source,
          clientType,
          country,
          fee,
          ctLogin,
          pyeLogin,
          trLogin,
          vatLogin,
          authCode,
          utr,
          isActive,
          job: job,
        });

        // Save the client with the current job
        return await client.save();
      })
    );

    return res.status(200).send({
      success: true,
      message: "New client created and jobs added successfully",
      jobs: createdJobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while creating job!",
      error: error.message,
    });
  }
};

// Get All Clients

export const getAllClients = async (req, res) => {
  try {
    const clients = await jobsModel.find({}).sort({ updatedAt: -1 });

    res.status(200).send({
      success: true,
      message: "All clients",
      clients: clients,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while get all job!",
      error: error,
    });
  }
};

// Update Client Status

export const updateStatus = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { status } = req.body;
    if (!status) {
      return res.status(400).send({
        success: false,
        message: "Status is required!",
      });
    }

    if (!jobId) {
      return res.status(400).send({
        success: false,
        message: "Job id is required!",
      });
    }

    const clientJob = await jobsModel.findByIdAndUpdate(
      { _id: jobId },
      { $set: { "job.jobStatus": status } },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Job status updated successfully!",
      clientJob: clientJob,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update job status !",
      error: error,
    });
  }
};

// Update Client Lead
export const updateLead = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { lead } = req.body;
    if (!lead) {
      return res.status(400).send({
        success: false,
        message: "Lead user is required!",
      });
    }

    if (!jobId) {
      return res.status(400).send({
        success: false,
        message: "Job id is required!",
      });
    }

    const clientJob = await jobsModel.findByIdAndUpdate(
      { _id: jobId },
      { $set: { "job.lead": lead } },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Lead user updated successfully!",
      clientJob: clientJob,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update job lead !",
      error: error,
    });
  }
};

// Update Client Lead
export const updateJobHolder = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { jobHolder } = req.body;
    if (!jobHolder) {
      return res.status(400).send({
        success: false,
        message: "Job Holder is required!",
      });
    }

    if (!jobId) {
      return res.status(400).send({
        success: false,
        message: "Job id is required!",
      });
    }

    const clientJob = await jobsModel.findByIdAndUpdate(
      { _id: jobId },
      { $set: { "job.jobHolder": jobHolder } },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Job holder updated successfully!",
      clientJob: clientJob,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update job holder !",
      error: error,
    });
  }
};

// Delete Client Jobs

export const deleteClientJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).send({
        success: false,
        message: "Job id is required!",
      });
    }

    const isExisting = await jobsModel.findById({ _id: jobId });

    if (!isExisting) {
      return res.status(400).send({
        success: false,
        message: "Job not found!",
      });
    }

    await jobsModel.findByIdAndDelete({
      _id: isExisting._id,
    });

    res.status(200).send({
      success: true,
      message: " Job delete successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in delete job !",
      error: error,
    });
  }
};

// Get Single Client Job
export const singleClientJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).send({
        success: false,
        message: "Job id is required!",
      });
    }

    const clientJob = await jobsModel.findById({ _id: jobId });

    if (!clientJob) {
      return res.status(400).send({
        success: false,
        message: "Job not found!",
      });
    } else {
      res.status(200).send({
        success: true,
        clientJob: clientJob,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get single job!",
      error: error,
    });
  }
};

// Get Client with all jobs
export const getClientWithJobs = async (req, res) => {
  try {
    const { companyName } = req.query;

    if (!companyName) {
      return res.status(400).send({
        success: false,
        message: "Company Name is required!",
      });
    }

    const clientJobs = await jobsModel
      .find({ companyName: companyName })
      .select("job");

    if (!clientJobs) {
      return res.status(400).send({
        success: false,
        message: "Job not found!",
      });
    } else {
      res.status(200).send({
        success: true,
        clientJobs: clientJobs,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get single job!",
      error: error,
    });
  }
};

// Update Client Jobs

export const updateClientJob = async (req, res) => {
  try {
    const {
      clientName,
      regNumber,
      companyName,
      email,
      totalHours,
      currentDate,
      source,
      clientType,
      country,
      fee,
      ctLogin,
      pyeLogin,
      trLogin,
      vatLogin,
      authCode,
      utr,
      isActive,
      jobs,
    } = req.body;

    // Validation
    if (!clientName) {
      return res.status(400).send({
        success: false,
        message: "Client name is required!",
      });
    }
    if (!companyName) {
      return res.status(400).send({
        success: false,
        message: "Company name is required!",
      });
    }
    if (!jobs || jobs.length === 0) {
      return res.status(400).send({
        success: false,
        message: "At least one job is required!",
      });
    }

    // Iterate over each job and either update or create
    for (const jobData of jobs) {
      if (jobData.clientId) {
        // If clientId exists, update the job
        await jobsModel.findByIdAndUpdate(
          jobData.clientId,
          {
            clientName,
            regNumber,
            companyName,
            email,
            totalHours,
            currentDate,
            source,
            clientType,
            country,
            fee,
            ctLogin,
            pyeLogin,
            trLogin,
            vatLogin,
            authCode,
            utr,
            isActive,
            job: jobData,
          },
          { new: true }
        );
      } else {
        // If clientId does not exist, create a new job entry
        await jobsModel.create({
          clientName,
          regNumber,
          companyName,
          email,
          totalHours,
          currentDate,
          source,
          clientType,
          country,
          fee,
          ctLogin,
          pyeLogin,
          trLogin,
          vatLogin,
          authCode,
          utr,
          isActive,
          job: jobData,
        });
      }
    }

    res.status(200).send({
      success: true,
      message: "Client job(s) updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating client job(s)!",
      error: error.message,
    });
  }
};

// Create Comment

export const createComment = async (req, res) => {
  try {
    const { comment, jobId } = req.body;

    const job = await jobsModel.findById(jobId);
    if (!job) {
      return res.status(400).send({
        success: false,
        message: "Job not found!",
      });
    }

    const newComment = {
      user: req.user,
      comment: comment,
      commentReplies: [],
    };

    job.comments.push(newComment);

    // Create Notification

    await job.save();

    res.status(200).send({
      success: true,
      message: "Comment Posted!",
      job: job,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in job comments!",
      error: error,
    });
  }
};

// Add Comment Reply
export const commentReply = async (req, res) => {
  try {
    const { commentReply, jobId, commentId } = req.body;

    const job = await jobsModel.findById(jobId);
    if (!job) {
      return res.status(400).send({
        success: false,
        message: "Job not found!",
      });
    }
    const comment = job.comments.find((item) => item._id.equals(commentId));
    if (!comment) {
      return res.status(400).send({
        success: false,
        message: "Invalid comment id!",
      });
    }

    // Replay
    const newReply = {
      user: req.user,
      reply: commentReply,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    comment.commentReplies.push(newReply);

    await job.save();

    // Create Notification

    res.status(200).send({
      success: true,
      message: "Reply Posted!",
      job: job,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in job comment reply!",
      error: error,
    });
  }
};
