import React, { useState } from "react";
import Layout from "../../components/Loyout/Layout";
import { GoPlus } from "react-icons/go";
import { style } from "../../utlis/CommonStyle";
import NewJobModal from "../../components/Modals/NewJobModal";
import { CgClose } from "react-icons/cg";

export default function AllJobs() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Layout>
      <div className="w-full h-full py-4 px-2 sm:px-4 ">
        <div className="flex items-center justify-between">
          <h1 className=" text-2xl sm:text-3xl font-semibold ">Job Planning</h1>
          <button
            className={`${style.button1}`}
            onClick={() => setIsOpen(true)}
          >
            <GoPlus className="h-5 w-5 text-white " /> Add Tasks
          </button>
        </div>
        <hr className="my-5 bg-gray-300 w-full h-[2px]" />
      </div>
      {/* Add Modal */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-screen z-[999] bg-gray-100 flex items-center justify-center py-6 px-4">
          <span
            className="absolute top-[2px] right-[.5rem] cursor-pointer z-10 p-1 rounded-lg bg-white/50 hover:bg-gray-300/70 transition-all duration-150 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <CgClose className="h-5 w-5 text-black" />
          </span>
          <NewJobModal setIsOpen={setIsOpen} />
        </div>
      )}
    </Layout>
  );
}
