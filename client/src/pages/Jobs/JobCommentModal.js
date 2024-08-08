import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../../context/authContext";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import toast from "react-hot-toast";
import axios from "axios";
import { style } from "../../utlis/CommonStyle";
import { BiLoaderCircle } from "react-icons/bi";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { format } from "date-fns";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import Loader from "../../utlis/Loader";

export default function JobCommentModal({ setIsComment, jobId, setJobId }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [shopReply, setShowReply] = useState(false);
  const [commentData, setCommentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commentReply, setCommentReply] = useState("");
  const [commentId, setCommentId] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [showReplyEmoji, setShowReplyEmoji] = useState(false);
  const [commentLikes, setCommentLikes] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  console.log("commentLikes:", commentLikes);

  // Add Emojis
  const onEmojiClick = (event) => {
    setComment((prevComment) => prevComment + event.emoji);
  };
  const onEmojiClickReply = (event) => {
    setCommentReply((prevComment) => prevComment + event.emoji);
  };

  //   Get Single Job
  const getSingleJobComment = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/client/job/comments/${jobId}`
      );
      console.log("Comments:", data.comments.comments);
      if (data) {
        setIsLoading(false);
        setCommentData(data.comments.comments);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getSingleJobComment();
    // eslint-disable-next-line
  }, [jobId]);

  //   Add Comment
  const handleComment = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!jobId) {
      return toast.error("Job_id is required!");
    }
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/comments/post/comment`,
        {
          comment: comment,
          jobId: jobId,
        }
      );
      if (data) {
        setComment("");
        getSingleJobComment();
        setLoading(false);
        toast.success("Comment Posted!");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);

      toast.error(error.response.data.message);
    }
  };

  //   Add Comment Reply
  const handleCommentReply = async (e) => {
    e.preventDefault();
    setReplyLoading(true);
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/comments/reply/comment`,
        { commentReply: commentReply, jobId: jobId, commentId: commentId }
      );
      if (data) {
        setReplyLoading(false);
        setCommentReply("");
        getSingleJobComment();
        toast.success("Reply added successfully!");
      }
    } catch (error) {
      console.log(error);
      setReplyLoading(false);
      toast.error(error.response.data.message);
    }
  };

  // -----Like Counts----->
  useEffect(() => {
    setCommentLikes(
      commentData.reduce((acc, comment) => {
        acc[comment._id] = comment.likes.includes(auth.user.id);
        return acc;
      }, {})
    );
    setLikeCounts(
      commentData.reduce((acc, comment) => {
        acc[comment._id] = comment.likes.length;
        return acc;
      }, {})
    );
  }, [commentData, auth.user]);

  // -------Like Comment------>
  const likeComment = async (commentId) => {
    try {
      setCommentLikes((prevLike) => ({
        ...prevLike,
        [commentId]: true,
      }));

      setLikeCounts((prevCounts) => ({
        ...prevCounts,
        [commentId]: prevCounts[commentId] + 1,
      }));

      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/comments/like/comment`,
        { jobId: jobId, commentId: commentId }
      );
      if (data) {
        toast.success("Liked!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setCommentLikes((prevLikes) => ({
        ...prevLikes,
        [commentId]: false,
      }));
      setLikeCounts((prevCounts) => ({
        ...prevCounts,
        [commentId]: prevCounts[commentId] - 1,
      }));
    }
  };

  // --------Unlike Comment--------->
  const unlikeComment = async (commentId) => {
    try {
      setCommentLikes((prevLike) => ({
        ...prevLike,
        [commentId]: false,
      }));

      setLikeCounts((prevCounts) => ({
        ...prevCounts,
        [commentId]: prevCounts[commentId] - 1,
      }));

      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/comments/unlike/comment`,
        { jobId: jobId, commentId: commentId }
      );
      if (data) {
        toast.success("Comment unliked!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setCommentLikes((prevLikes) => ({
        ...prevLikes,
        [commentId]: true,
      }));
      setLikeCounts((prevCounts) => ({
        ...prevCounts,
        [commentId]: prevCounts[commentId] + 1,
      }));
    }
  };

  // --------AutoScroll------->
  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [commentData]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[45rem] max-h-[36rem] rounded-md shadow-md bg-gray-50 border flex flex-col gap-2">
        <div className="flex items-center justify-between py-2 px-3">
          <h3 className="text-[18px] font-semibold text-black">Comments</h3>
          <span
            onClick={() => {
              setJobId("");
              setIsComment(false);
            }}
          >
            <IoClose className="text-black cursor-pointer h-6 w-6 " />
          </span>
        </div>
        <hr className="w-full h-[1px] bg-gray-500" />
        {/* -----------------Display-Comments------------ */}
        <div
          className="w-full max-h-[75%] bg-white overflow-y-auto py-3 px-3 flex flex-col gap-2"
          id="message-container"
        >
          <>
            {isLoading ? (
              <div className="max-h-[15rem] w-full">
                <Loader />
              </div>
            ) : (
              <>
                {commentData &&
                  commentData?.map((comment, i) => (
                    <div
                      className=" w-full flex flex-col gap-1 border border-gray-200 py-1 rounded-md "
                      key={comment._id}
                    >
                      {/*  */}
                      <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-1">
                          <img
                            src={
                              comment?.user?.avatar
                                ? comment?.user?.avatar
                                : "/profile1.jpeg"
                            }
                            alt="Avatar"
                            className="rounded-full w-[2.2rem] h-[2.2rem] border-2 border-orange-500"
                          />
                          <span className="font-medium text-black text-[16px]">
                            {comment?.user?.name}
                          </span>
                        </div>
                        <span className="text-[12px] font-light text-gray-500">
                          {format(
                            new Date(comment?.createdAt),
                            "MMM dd 'at' p"
                          )}
                        </span>
                      </div>
                      <hr className="w-full h-[1px] bg-gray-500" />
                      {/* M */}
                      <div className="w-full px-2 py-1 ">
                        {comment?.comment}
                      </div>
                      <hr className="w-full h-[1px] bg-gray-500" />
                      <div className="flex items-center justify-between px-4 ">
                        <span
                          className="flex items-center cursor-pointer"
                          onClick={() =>
                            commentLikes[comment?._id]
                              ? unlikeComment(comment?._id)
                              : likeComment(comment?._id)
                          }
                        >
                          {commentLikes[comment._id] ? (
                            <AiFillLike className="h-5 w-5 text-orange-600" />
                          ) : (
                            <AiOutlineLike className="h-5 w-5 text-gray-900 dark:text-white" />
                          )}
                          ({likeCounts[comment?._id] || 0})
                        </span>
                        <span
                          className="flex gap-1 cursor-pointer relative "
                          onClick={() => {
                            setCommentId(comment?._id);
                            setShowReply(!shopReply);
                          }}
                        >
                          <span className="h-[12px] font-medium text-orange-500 hover:text-orange-600 transition-all duration-200 ">
                            Reply
                          </span>
                          <span className="">
                            ({comment?.commentReplies.length})
                          </span>
                        </span>
                      </div>
                      {/* ----------Comm_Replies----------- */}
                      {shopReply && comment._id === commentId && (
                        <>
                          <hr className="w-full h-[1px] bg-gray-200" />
                          <div className="flex items-start gap-1 w-full mt-1 px-4 ">
                            <form
                              onSubmit={handleCommentReply}
                              className="w-full border border-orange-500 rounded-md px-2 py-1"
                            >
                              <textarea
                                placeholder="Enter your reply here..."
                                onClick={() => setShowReplyEmoji(false)}
                                value={commentReply}
                                required
                                onChange={(e) =>
                                  setCommentReply(e.target.value)
                                }
                                className="h-[2.4rem] w-full rounded-md  outline-none  resize-none py-1 px-2"
                              ></textarea>
                              <div className="flex items-center justify-between  ">
                                <div className="relative " title="Add Emoji">
                                  <span
                                    onClick={() =>
                                      setShowReplyEmoji(!showReplyEmoji)
                                    }
                                  >
                                    <BsEmojiSmile className="text-yellow-600 z-20 h-6 w-6 cursor-pointer" />
                                  </span>
                                  {showReplyEmoji && (
                                    <span className="fixed bottom-[10rem] right-[30rem] z-40">
                                      <EmojiPicker
                                        onEmojiClick={onEmojiClickReply}
                                      />
                                    </span>
                                  )}
                                </div>

                                <button
                                  disabled={replyLoading || !comment}
                                  className={`${style.btn} ${
                                    !comment &&
                                    "cursor-not-allowed opacity-[.5]"
                                  }   ${
                                    replyLoading && "cursor-no-drop"
                                  } shadow`}
                                >
                                  {replyLoading ? (
                                    <BiLoaderCircle className="w-5 h-5 animate-spin text-white" />
                                  ) : (
                                    "Reply"
                                  )}
                                </button>
                              </div>
                            </form>
                          </div>
                        </>
                      )}
                      {shopReply &&
                        comment?.commentReplies?.map((commentReply, i) => (
                          <div className="w-full " key={commentReply._id}>
                            <div className="flex flex-col gap-2 ml-8 py-1 px-1 ">
                              {/* map */}
                              <div className="flex flex-col ga1 rounded-md border py-1">
                                <div className="flex items-center justify-between px-2">
                                  <div className="flex items-center gap-1">
                                    <img
                                      src={
                                        commentReply?.user?.avatar
                                          ? commentReply?.user?.avatar
                                          : "/profile1.jpeg"
                                      }
                                      alt="Avatar"
                                      className="rounded-full w-[2rem] h-[2rem] border-2 border-sky-500"
                                    />
                                    <span className="font-medium text-black text-[16px]">
                                      {commentReply?.user?.name}
                                    </span>
                                  </div>
                                  <span className="text-[12px] font-light text-gray-500">
                                    {format(
                                      new Date(commentReply?.createdAt),
                                      "MMM dd 'at' p"
                                    )}
                                  </span>
                                </div>
                                {/* M */}
                                <div className="w-full px-2 py-1 ">
                                  {commentReply?.reply}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
              </>
            )}
          </>
        </div>
        {/* Add Comm... */}
        <div className="flex flex-col gap-4 px-4 py-1 mb-2">
          <div className="flex items-start gap-1 w-full  ">
            <div className="w-[3.7rem] h-[3.7rem]">
              <img
                src={auth?.user?.avatar ? auth?.user?.avatar : "/profile1.jpeg"}
                alt="Avatar"
                className="rounded-full w-[3.4rem] h-[3.4rem] border-2 border-orange-500"
              />
            </div>
            <form
              onSubmit={handleComment}
              className="w-full border border-orange-500 rounded-md px-2 py-1"
            >
              <textarea
                placeholder="Enter your comment here... 🙄"
                onClick={() => setShowPicker(false)}
                value={comment}
                required
                onChange={(e) => setComment(e.target.value)}
                className="h-[3.3rem] w-full rounded-md  outline-none  resize-none py-1 px-2"
              ></textarea>
              <div className="flex items-center justify-between  ">
                <div className="relative " title="Add Emoji">
                  <span onClick={() => setShowPicker(!showPicker)}>
                    <BsEmojiSmile className="text-yellow-600 z-20 h-6 w-6 cursor-pointer" />
                  </span>
                  {showPicker && (
                    <span className="absolute bottom-5 right-5 z-40">
                      <EmojiPicker onEmojiClick={onEmojiClick} />
                    </span>
                  )}
                </div>

                <button
                  disabled={loading || !comment}
                  className={`${style.btn} ${
                    !comment && "cursor-not-allowed opacity-[.5]"
                  }   ${loading && "cursor-no-drop"} shadow`}
                >
                  {loading ? (
                    <BiLoaderCircle className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
