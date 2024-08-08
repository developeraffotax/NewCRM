import jobsModel from "../models/jobsModel.js";

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
      user: req.user.user,
      comment: comment,
      commentReplies: [],
      likes: [],
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
      user: req.user.user,
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

// Like Comment
export const likeComment = async (req, res) => {
  try {
    const { jobId, commentId } = req.body;

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

    if (comment.likes.includes(req.user.id)) {
      return res.status(400).send({
        success: false,
        message: "Comment already liked!",
      });
    }

    comment.likes.push(req.user.id);
    await job.save();

    res.status(200).send({
      success: true,
      message: "Comment liked successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in like comment!",
      error: error,
    });
  }
};

// Unlike Comment
export const unLikeComment = async (req, res) => {
  try {
    const { jobId, commentId } = req.body;

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

    if (!comment.likes.includes(req.user.id)) {
      return res.status(400).send({
        success: false,
        message: "Post not liked yet!",
      });
    }

    comment.likes = comment.likes.filter((id) => id.toString() !== req.user.id);
    await job.save();

    res.status(200).send({
      success: true,
      message: "Comment unliked successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in unlike comment!",
      error: error,
    });
  }
};
