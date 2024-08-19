import React from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

export default function CompletedTasks({ setShowCompleted }) {
  return (
    <div className="relative w-full min-h-screen py-4 px-2 sm:px-4">
      <button
        className=" absolute top-1  p-[2px] rounded-full left-2 bg-gray-300/30 hover:bg-gray-300/50"
        onClick={() => setShowCompleted(false)}
      >
        <MdOutlineKeyboardBackspace className="h-6 w-6 cursor-pointer text-orange-500" />
      </button>
      <div className="flex items-center mt-4">
        <h1 className=" text-xl sm:text-2xl font-semibold ">Completed Tasks</h1>
      </div>
    </div>
  );
}
