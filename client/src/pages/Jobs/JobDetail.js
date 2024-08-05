import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoGoal } from "react-icons/go";
import { MdDateRange, MdInsertComment } from "react-icons/md";
import { RiTimerLine } from "react-icons/ri";
import { format } from "date-fns";
import { MdOutlineInsertComment } from "react-icons/md";
import Loader from "../../utlis/Loader";
import { Timer } from "../../utlis/Timer";
import { useAuth } from "../../context/authContext";
import { FaRegUser } from "react-icons/fa";

export default function JobDetail({ clientId, handleStatus }) {
  const [clientDetail, setClientDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("jobDetail");
  const { auth } = useAuth();

  //    Single Client

  const getClient = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/client/single/client/${clientId}`
      );
      if (data) {
        setLoading(false);

        setClientDetail(data.clientJob);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error?.response?.data?.message || "Error in client Jobs");
    }
  };

  useEffect(() => {
    getClient();
    // eslint-disable-next-line
  }, [clientId]);

  // ---------------Handle Status Change---------->
  const handleStatusChange = async (rowId, newStatus) => {
    if (!rowId) {
      return toast.error("Job id is required!");
    }
    try {
      const { data } = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/client/update/status/${rowId}`,
        {
          status: newStatus,
        }
      );
      if (data) {
        getClient();
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full  mt-2 overflow-y-scroll h-[calc(100vh-7rem)] pb-4 hidden1 ">
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-gray-500 w-[30%]">
                <GoGoal className="h-4 w-4 text-gray-500" /> Status
              </span>
              <select
                value={clientDetail?.job?.jobStatus}
                onChange={(e) => {
                  handleStatusChange(clientDetail._id, e.target.value);
                  handleStatus(clientDetail._id, e.target.value);
                }}
                className="w-[8rem] h-[2rem] rounded-md border border-sky-500 outline-none"
              >
                <option value="">Select</option>
                <option value="Data">Data</option>
                <option value="Progress">Progress</option>
                <option value="Queries">Queries</option>
                <option value="Approval">Approval</option>
                <option value="Submission">Submission</option>
                <option value="Billing">Billing</option>
                <option value="Feedback">Feedback</option>
              </select>
            </div>
            {/*  */}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-gray-500 w-[30%]">
                <FaRegUser className="h-4 w-4 text-gray-500" /> Job Holder
              </span>
              <span className="text-[17px] font-medium text-gray-800">
                {clientDetail?.job?.jobHolder}
              </span>
            </div>
            {/*  */}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-gray-500 w-[30%]">
                <MdDateRange className="h-4 w-4 text-gray-500" /> Due Date
              </span>
              <span className="text-[17px] font-medium text-gray-800">
                {format(
                  new Date(
                    clientDetail?.job?.jobDeadline ||
                      "2024-07-26T00:00:00.000+00:00"
                  ),
                  "dd-MMM-yyyy"
                )}
              </span>
            </div>
            {/*  */}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-gray-500 w-[30%]">
                <RiTimerLine className="h-4 w-4 text-gray-500" /> Stack Timer
              </span>
              <span className="text-[17px] font-medium text-gray-800">
                <Timer clientId={auth?.user?.id} jobId={clientDetail?._id} />
              </span>
            </div>
            {/*  */}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-gray-500 w-[30%]">
                <MdOutlineInsertComment className="h-4 w-4 text-gray-500" />{" "}
                Comments
              </span>
              <span
                className="text-[17px] font-medium text-gray-800 relative"
                onClick={() => setActiveTab("comments")}
              >
                <span className=" absolute top-[-.5rem] right-[-.8rem] w-[1.1rem] h-[1.1rem] flex items-center justify-center font-medium rounded-full bg-green-500 text-white p-1 text-[12px]">
                  10
                </span>
                <span className="text-[1rem] cursor-pointer  ">
                  <MdInsertComment className="h-6 w-6 text-orange-500 hover:text-orange-600 " />
                </span>
              </span>
            </div>
            {/*  */}
          </div>
          <hr className="h-[1.5px] w-full bg-gray-400 my-3" />
          {/* ------------Tabs---------- */}
          <div className="flex items-center  gap-4 ">
            <button
              className={` text-[14px] font-medium cursor-pointer py-1  ${
                activeTab === "jobDetail" && "border-b-2 border-orange-600"
              } `}
              onClick={() => setActiveTab("jobDetail")}
            >
              Job Detail
            </button>
            <button
              className={` text-[14px] font-medium cursor-pointer py-1  ${
                activeTab === "salesDetail" && "border-b-2 border-orange-600"
              } `}
              onClick={() => setActiveTab("salesDetail")}
            >
              Sales Detail
            </button>
            <button
              className={` text-[14px] font-medium cursor-pointer py-1  ${
                activeTab === "loginInfo" && "border-b-2 border-orange-600"
              } `}
              onClick={() => setActiveTab("loginInfo")}
            >
              Login Info
            </button>
            <button
              className={` text-[14px] font-medium cursor-pointer py-1  ${
                activeTab === "departmentInfo" && "border-b-2 border-orange-600"
              } `}
              onClick={() => setActiveTab("departmentInfo")}
            >
              Department Detail
            </button>
          </div>
          <hr className="h-[1.5px] w-full bg-gray-400 my-3" />

          <div className="w-full">
            {activeTab === "jobDetail" ? (
              <div className="flex flex-col">
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 rounded-tl-md">
                    Client Name
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 rounded-tr-md">
                    {clientDetail?.clientName}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium  py-2 px-2 ">
                    Company Name
                  </span>

                  <span className="border border-gray-300 text-gray-600 py-2 px-2">
                    <span className=" py-1 px-5 rounded-[1.5rem] shadow-md bg-cyan-500 text-white">
                      {clientDetail?.companyName}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 ">
                    Registeration Name
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 ">
                    {clientDetail?.regNumber}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 ">
                    Email
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 ">
                    {clientDetail?.email}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 rounded-bl-md ">
                    Hours
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 rounded-br-md ">
                    {clientDetail?.totalHours}
                  </span>
                </div>
              </div>
            ) : activeTab === "salesDetail" ? (
              <div className="flex flex-col">
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 rounded-tl-md">
                    Date
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 rounded-tr-md">
                    {clientDetail?.currentDate}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium  py-2 px-2 ">
                    Source
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2">
                    {clientDetail?.source}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 ">
                    Client Type
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2  ">
                    <span className=" py-1 px-5 rounded-[1.5rem] shadow-md bg-pink-600 text-white">
                      {clientDetail?.clientType}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 ">
                    Courtry
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 ">
                    {clientDetail?.country}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 rounded-bl-md ">
                    Fee
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 rounded-br-md ">
                    {clientDetail?.fee}
                  </span>
                </div>
              </div>
            ) : activeTab === "loginInfo" ? (
              <div className="flex flex-col">
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 rounded-tl-md">
                    CT Login
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 rounded-tr-md">
                    {clientDetail?.ctLogin}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium  py-2 px-2 ">
                    PYE Login
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2">
                    {clientDetail?.pyeLogin}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 ">
                    TR Login
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2  ">
                    {clientDetail?.trLogin}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 ">
                    VAT Login
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 ">
                    {clientDetail?.vatLogin}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 ">
                    Authentication Code
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 ">
                    <span className=" py-1 px-5 rounded-[1.5rem] shadow-md bg-teal-500 text-white">
                      {clientDetail?.authCode}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 rounded-bl-md ">
                    UTR
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 rounded-br-md ">
                    {clientDetail?.utr}
                  </span>
                </div>
              </div>
            ) : activeTab === "departmentInfo" ? (
              <div className="flex flex-col">
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 rounded-tl-md">
                    Department Name
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 rounded-tr-md">
                    <span className=" py-1 px-5 rounded-[1.5rem] shadow-md bg-indigo-500 text-white">
                      {clientDetail?.job.jobName}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium  py-2 px-2 ">
                    Year End
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2">
                    {format(
                      new Date(
                        clientDetail?.job?.yearEnd ||
                          "2024-07-26T00:00:00.000+00:00"
                      ),
                      "dd-MMM-yyyy"
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 ">
                    Deadline
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2  ">
                    {format(
                      new Date(
                        clientDetail?.job?.jobDeadline ||
                          "2024-07-26T00:00:00.000+00:00"
                      ),
                      "dd-MMM-yyyy"
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 ">
                    Work Date
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 ">
                    {format(
                      new Date(
                        clientDetail?.job?.workDeadline ||
                          "2024-07-26T00:00:00.000+00:00"
                      ),
                      "dd-MMM-yyyy"
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2  ">
                    Hours
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2  ">
                    {clientDetail?.job?.hours}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2  ">
                    Fee
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 ">
                    {clientDetail?.job?.fee}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 ">
                    Lead
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 ">
                    {clientDetail?.job?.lead}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="border border-gray-300 text-black font-medium py-2 px-2 rounded-bl-md ">
                    Job Holder
                  </span>
                  <span className="border border-gray-300 text-gray-600 py-2 px-2 rounded-br-md ">
                    {clientDetail?.job?.jobHolder}
                  </span>
                </div>
              </div>
            ) : (
              "Comments"
            )}
          </div>
        </div>
      )}
    </>
  );
}
