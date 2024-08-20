import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

export default function CompletedTasks({ setShowCompleted }) {
  const [show, setShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState("All");

  //---------- Get All Completed Projects-----------
  const getAllProjects = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/projects/get/completed/project`
      );
      setProjects(data?.projects);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProjects();
    // eslint-disable-next-line
  }, []);
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
      <div className="flex flex-col gap-2">
        {/* -----------Filters By Deparment--------- */}
        <div className="flex items-center flex-wrap gap-2 mt-3">
          <div
            className={`py-1 rounded-tl-md rounded-tr-md px-1 cursor-pointer font-[500] text-[14px] ${
              active === "All" &&
              " border-2 border-b-0 text-orange-600 border-gray-300"
            }`}
            onClick={() => {
              setActive("All");
            }}
          >
            All (0)
          </div>
          {projects?.map((proj, i) => {
            return (
              <div
                className={`py-1 rounded-tl-md rounded-tr-md px-1 cursor-pointer font-[500] text-[14px] ${
                  active === proj?.projectName &&
                  " border-2 border-b-0 text-orange-600 border-gray-300"
                }`}
                key={i}
                onClick={() => {
                  setActive(proj?.projectName);
                }}
              >
                {proj?.projectName} (0)
              </div>
            );
          })}
        </div>
        {/*  */}
        <hr className="translate-y-[-.5rem] bg-gray-300 w-full h-[1px]" />
      </div>
    </div>
  );
}
