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

export default function JobCommentModal({ setIsComment, jobId, setJobId }) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  // Add Emojis
  const onEmojiClick = (event) => {
    console.log("Emoji1", event);

    setComment((prevComment) => prevComment + event.emoji);
  };

  //   Get Single Job
  const getSingleJob = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/`);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getSingleJob();
  }, [jobId]);

  //   Add Comment
  const handleComment = async (e) => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  //   Add Comment Reply
  const handleCommentReply = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full h-full py-4 px-4 flex items-center justify-center">
      <div className="w-[45rem] h-[37rem] rounded-md shadow-md bg-white flex flex-col gap-2">
        <div className="flex items-center justify-between py-2 px-4">
          <h3 className="text-[19px] font-semibold text-gray-800">Comments</h3>
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
        <div className="flex flex-col gap-4 px-4 py-1 mb-2">
          <div className="flex items-start gap-1 w-full  ">
            <div className="w-[3.6rem] h-[3.6rem]">
              <img
                src={auth?.user?.avatar ? auth?.user?.avatar : "/profile1.jpeg"}
                alt="Avatar"
                className="rounded-full w-[3.4rem] h-[3.4rem] border-2 border-orange-500"
              />
            </div>
            <form onSubmit={handleComment} className="w-full">
              <textarea
                placeholder="Enter your comment here... 🙄"
                onClick={() => setShowPicker(false)}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="h-[4rem] w-full rounded-md border outline-none border-orange-600 resize-none py-1 px-2"
              ></textarea>
              <div className="flex items-center justify-between  ">
                <div className="relative " title="Add Emoji">
                  <span onClick={() => setShowPicker(!showPicker)}>
                    <BsEmojiSmile className="text-yellow-600 z-20 h-6 w-6 cursor-pointer" />
                  </span>
                  {showPicker && (
                    <span className="absolute top-6 right-4 z-40">
                      <EmojiPicker onEmojiClick={onEmojiClick} />
                    </span>
                  )}
                </div>

                <button
                  disabled={loading}
                  className={`${style.btn}   ${loading && "cursor-no-drop"}`}
                >
                  {loading ? (
                    <BiLoaderCircle className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    "Post"
                  )}
                </button>
              </div>
            </form>
          </div>
          <hr className="w-full h-[1px] bg-gray-500" />
          <div className="">Comments</div>
        </div>
      </div>
    </div>
  );
}
