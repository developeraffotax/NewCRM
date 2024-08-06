import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../components/Loyout/Layout";
import { GoPlus } from "react-icons/go";
import { style } from "../../utlis/CommonStyle";
import NewJobModal from "../../components/Modals/NewJobModal";
import { CgClose } from "react-icons/cg";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import { format } from "date-fns";
import { MdInsertComment } from "react-icons/md";
import toast from "react-hot-toast";
import { useAuth } from "../../context/authContext";
import Loader from "../../utlis/Loader";

import { TbCalendarDue } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import JobDetail from "./JobDetail";
import { IoBriefcaseOutline } from "react-icons/io5";
import { Timer } from "../../utlis/Timer";
import JobCommentModal from "./JobCommentModal";

export default function AllJobs() {
  const { auth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [play, setPlay] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [activeBtn, setActiveBtn] = useState("");
  const [showJobHolder, setShowJobHolder] = useState(false);
  const [showDue, setShowDue] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [clientId, setClientId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isComment, setIsComment] = useState(false);
  const [jobId, setJobId] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [note, setNote] = useState("");
  const timerRef = useRef();

  const departments = [
    "All",
    "Bookkeeping",
    "Payroll",
    "Vat Return",
    "Personal Tax",
    "Accounts",
    "Company Sec",
    "Address",
  ];

  // ---------Stop Timer ----------->
  const handleStopTimer = () => {
    if (timerRef.current) {
      timerRef.current.stopTimer();
    }
  };

  // -------------- Department Lenght--------->
  const getDepartmentCount = (department) => {
    if (department === "All") {
      return tableData?.length;
    }
    return tableData.filter((item) => item?.job?.jobName === department)
      ?.length;
  };

  // Get All Users
  const getAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/user/get_all/users`
      );
      setUsers(data?.users.map((user) => user.name));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();

    // eslint-disable-next-line
  }, []);

  // ---------------All Client_Job Data----------->
  const allClientJobData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/client/all/client/job`
      );
      if (data) {
        setTableData(data?.clients);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message || "Error in client Jobs");
    }
  };

  useEffect(() => {
    allClientJobData();
    // eslint-disable-next-line
  }, []);

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
        setTableData((prevData) =>
          prevData.map((item) =>
            item._id === rowId
              ? { ...item, job: { ...item.job, jobStatus: newStatus } }
              : item
          )
        );
        toast.success("Job status updated!");
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  // ---------------Handle Update Lead ---------->
  const handleUpdateLead = async (rowId, lead) => {
    if (!rowId) {
      return toast.error("Job id is required!");
    }
    try {
      const { data } = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/client/update/lead/${rowId}`,
        {
          lead: lead,
        }
      );
      if (data) {
        setTableData((prevData) =>
          prevData.map((item) =>
            item._id === rowId
              ? { ...item, job: { ...item.job, lead: lead } }
              : item
          )
        );
        toast.success("Job lead updated!");
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  // ---------------Handle Update Lead ---------->
  const handleUpdateJobHolder = async (rowId, jobHolder) => {
    if (!rowId) {
      return toast.error("Job id is required!");
    }
    try {
      const { data } = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/client/update/jobholder/${rowId}`,
        {
          jobHolder: jobHolder,
        }
      );
      if (data) {
        setTableData((prevData) =>
          prevData.map((item) =>
            item._id === rowId
              ? { ...item, job: { ...item.job, jobHolder: jobHolder } }
              : item
          )
        );
        toast.success("Job holder updated!");
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  // --------------Filter Data By Department----------->

  const filterByDep = (department) => {
    const filteredData = tableData.filter(
      (item) => item.job.jobName === department
    );

    setFilterData(filteredData);
  };
  // <-----------Job Status------------->
  const getStatus = (jobDeadline, yearEnd) => {
    const deadline = new Date(jobDeadline);
    const yearEndDate = new Date(yearEnd);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      deadline.setHours(0, 0, 0, 0) < today ||
      yearEndDate.setHours(0, 0, 0, 0) < today
    ) {
      return "Overdue";
    } else if (
      deadline.setHours(0, 0, 0, 0) === today ||
      yearEndDate.setHours(0, 0, 0, 0) === today
    ) {
      return "Due";
    }
    return "";
  };

  // -------------------Open Detail Modal------->
  const getSingleJobDetail = (id) => {
    setClientId(id);
    setShowDetail(true);
  };

  // ---------Handle Delete Job-------------
  const handleDeleteJob = async (id) => {
    const filterData = tableData.filter((item) => item._id !== id);
    setTableData(filterData);
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/v1/client/delete/job/${id}`
      );
      if (data) {
        setShowDetail(false);
        toast.success("Client job deleted successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "companyName",
        header: "Company Name",
        size: 10,
        Cell: ({ cell, row }) => {
          const companyName = cell.getValue();

          return (
            <div
              className="cursor-pointer text-sky-500 hover:text-sky-600 w-full h-full"
              onClick={() => {
                getSingleJobDetail(row.original._id);
                setCompanyName(companyName);
              }}
            >
              {companyName}
            </div>
          );
        },
      },
      {
        accessorKey: "clientName",
        header: "Client Name",
        size: 50,
      },
      {
        accessorKey: "job.jobHolder",
        header: "Job Holder",
        Cell: ({ cell, row }) => {
          const jobholder = cell.getValue();

          return (
            <select
              value={jobholder || ""}
              onChange={(e) =>
                handleUpdateJobHolder(row.original._id, e.target.value)
              }
              className="w-[6rem] h-[2rem] rounded-md border-2 border-orange-500 outline-none"
            >
              <option value="">Select</option>
              {users.map((jobHold, i) => (
                <option value={jobHold} key={i}>
                  {jobHold}
                </option>
              ))}
            </select>
          );
        },
        filterFn: "equals",
        filterSelectOptions: users.map((jobhold) => jobhold),
        filterVariant: "select",
        size: 50,
      },
      {
        accessorKey: "job.jobName",
        header: "Departments",
        filterFn: "equals",
        filterSelectOptions: [
          "Bookkeeping",
          "Payroll",
          "Vat Return",
          "Personal Tax",
          "Accounts",
          "Company Sec",
          "Address",
        ],
        filterVariant: "select",
        size: 50,
      },
      {
        accessorKey: "totalHours",
        header: "Hours",
        filterFn: "equals",
        size: 50,
      },
      {
        accessorKey: "job.yearEnd",
        header: "Year End",
        Cell: ({ cell }) => format(new Date(cell.getValue()), "dd-MMM-yyyy"),
        filterFn: "equals",
        filterSelectOptions: [
          "Expired",
          "Today",
          "Tomorrow",
          "In 7 days",
          "In 15 days",
          "Month Wise",
        ],
        filterVariant: "select",
        size: 50,
      },
      {
        accessorKey: "job.jobDeadline",
        header: "Deadline",
        Cell: ({ cell }) => format(new Date(cell.getValue()), "dd-MMM-yyyy"),
        filterFn: "equals",
        filterSelectOptions: [
          "Expired",
          "Today",
          "Tomorrow",
          "In 7 days",
          "In 15 days",
          "Month Wise",
        ],
        filterVariant: "select",
        size: 50,
      },
      {
        accessorKey: "currentDate",
        header: "Job Date",
        Cell: ({ cell }) => format(new Date(cell.getValue()), "dd-MMM-yyyy"),
        filterFn: "equals",
        filterSelectOptions: [
          "Expired",
          "Today",
          "Tomorrow",
          "In 7 days",
          "In 15 days",
          "Month Wise",
        ],
        filterVariant: "select",
        size: 50,
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => {
          const status = getStatus(
            row.original.job.jobDeadline,
            row.original.job.yearEnd
          );
          return status;
        },
        filterFn: (row, id, filterValue) => {
          const status = getStatus(
            row.original.job.jobDeadline,
            row.original.job.yearEnd
          );
          if (status === undefined || status === null) return false;
          return status.toString().toLowerCase() === filterValue.toLowerCase();
        },
        filterSelectOptions: ["Overdue", "Due"],
        filterVariant: "select",
        size: 50,
      },
      {
        accessorKey: "job.jobStatus",
        header: "Job Status",
        Cell: ({ cell, row }) => {
          const statusValue = cell.getValue();

          return (
            <select
              value={statusValue}
              onChange={(e) =>
                handleStatusChange(row.original._id, e.target.value)
              }
              className="w-[6rem] h-[2rem] rounded-md border-2 border-sky-500 outline-none"
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
          );
        },
        filterFn: "equals",
        filterSelectOptions: [
          "Select",
          "Data",
          "Progress",
          "Queries",
          "Approval",
          "Submission",
          "Billing",
          "Feedback",
        ],
        filterVariant: "select",
        size: 50,
      },
      {
        accessorKey: "job.lead",
        header: "Lead",
        Cell: ({ cell, row }) => {
          const leadValue = cell.getValue(); // Get the current lead value for the row

          return (
            <select
              value={leadValue || ""}
              onChange={(e) =>
                handleUpdateLead(row.original._id, e.target.value)
              }
              className="w-[6rem] h-[2rem] rounded-md border-none bg-transparent outline-none"
            >
              <option value="">Select</option>
              {users.map((lead, i) => (
                <option value={lead} key={i}>
                  {lead}
                </option>
              ))}
            </select>
          );
        },
        filterFn: "equals",
        filterSelectOptions: users.map((lead) => lead),
        filterVariant: "select",
        size: 50,
      },
      {
        accessorKey: "totalTime",
        header: "Est. Time",
        Cell: ({ cell, row }) => {
          const statusValue = cell.getValue();
          return (
            <div className="flex items-center gap-1">
              <span className="text-[1rem]">⏳</span>
              <span>{statusValue}</span>
            </div>
          );
        },
        size: 30,
      },
      {
        accessorKey: "timertracker",
        header: "Time Tr.",
        Cell: ({ cell, row }) => {
          // const statusValue = cell.getValue();
          console.log("Job_id:", row.original._id);

          return (
            <div
              className="flex items-center gap-1 w-full h-full "
              onClick={() => setPlay(!play)}
            >
              <span className="text-[1rem] cursor-pointer">
                <Timer
                  ref={timerRef}
                  clientId={auth.user.id}
                  jobId={row.original._id}
                  setIsShow={setIsShow}
                  note={note}
                />
              </span>
            </div>
          );
        },
        size: 50,
      },
      {
        accessorKey: "comment",
        header: "Comments",
        Cell: ({ cell, row }) => {
          // const statusValue = cell.getValue();

          return (
            <div
              className="flex items-center gap-1 w-full h-full"
              onClick={() => {
                setJobId(row.original._id);
                setIsComment(true);
              }}
            >
              <span className="text-[1rem] cursor-pointer">
                <MdInsertComment className="h-5 w-5 text-orange-600 " />
              </span>
              <span>({"03"})</span>
            </div>
          );
        },
        size: 10,
      },
    ],

    [users, play, auth]
  );

  return (
    <Layout>
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen px-4 py-4">
          <Loader />
        </div>
      ) : (
        <div className="w-full min-h-screen py-4 px-2 sm:px-4 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className=" text-xl sm:text-2xl font-semibold ">Job</h1>
              <span className="" onClick={() => setShow(!show)}>
                {show ? (
                  <IoIosArrowDropup className="h-5 w-5 cursor-pointer" />
                ) : (
                  <IoIosArrowDropdown className="h-5 w-5 cursor-pointer" />
                )}
              </span>
            </div>
            <button
              className={`${style.button1} text-[15px] `}
              onClick={() => setIsOpen(true)}
            >
              <GoPlus className="h-5 w-5 text-white " /> Add Client
            </button>
          </div>
          {/* Filters */}
          <div className="flex items-center gap-2 mt-3">
            {departments?.map((dep, i) => (
              <div
                className={`py-1 rounded-tl-md rounded-tr-md px-1 cursor-pointer font-[500] text-[14px] ${
                  active === dep &&
                  " border-2 border-b-0 text-orange-600 border-gray-300"
                }`}
                key={i}
                onClick={() => {
                  setActive(dep);
                  filterByDep(dep);
                }}
              >
                {dep} ({getDepartmentCount(dep)})
              </div>
            ))}
            <span
              className={` p-1 rounded-md hover:shadow-md bg-gray-50 mb-1  cursor-pointer border  ${
                activeBtn === "jobHolder" &&
                showJobHolder &&
                "bg-orange-600 text-white"
              }`}
              onClick={() => {
                setActiveBtn("jobHolder");
                setShowJobHolder(!showJobHolder);
              }}
            >
              <IoBriefcaseOutline className="h-6 w-6  cursor-pointer " />
            </span>
            <span
              className={` p-1 rounded-md hover:shadow-md mb-1 bg-gray-50 cursor-pointer border ${
                activeBtn === "due" && showDue && "bg-orange-600 text-white"
              }`}
              onClick={() => {
                setActiveBtn("due");
                setShowDue(!showDue);
              }}
            >
              <TbCalendarDue className="h-6 w-6  cursor-pointer" />
            </span>
          </div>
          {/*  */}
          <hr className="mb-1 bg-gray-300 w-full h-[1px]" />
          {/* ---------------------Table---------------- */}
          <div className="w-full h-screen  relative">
            {/* overflow-y-scroll  */}
            <div className="h-screen hidden1 overflow-y-scroll   relative ">
              <MaterialReactTable
                columns={columns}
                data={active === "All" ? tableData : filterData}
                enableRowSelection
                getRowId={(originalRow) => originalRow.id}
                enableColumnActions={false}
                enableColumnFilters={true}
                enableSorting={true}
                enableGlobalFilter={true}
                enableRowNumbers={true}
                state={{ isLoading: loading }}
                enablePagination={true}
                density="compact"
                size="small"
                height="94vh"
                sx={{
                  minWidth: 650,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
                muiTableHeadCellProps={{
                  style: {
                    fontWeight: "bold",
                    fontSize: "14px",
                    backgroundColor: "#f0f0f0",
                    color: "#000",
                  },
                }}
                muiTableProps={{
                  sx: {
                    "& .MuiTableHead-root": {
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f0f0f0",
                      zIndex: 1,
                    },
                    tableLayout: "auto",
                    fontSize: "14px",
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
      {/* Add Modal */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-screen z-[999] bg-gray-100 flex items-center justify-center py-6  px-4">
          <span
            className="absolute  top-[4px] right-[.8rem]  cursor-pointer z-10 p-1 rounded-lg bg-white/50 hover:bg-gray-300/70 transition-all duration-150 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <CgClose className="h-5 w-5 text-black" />
          </span>
          <NewJobModal
            setIsOpen={setIsOpen}
            allClientJobData={allClientJobData}
          />
        </div>
      )}

      {/* Job Details */}

      {showDetail && (
        <div className="fixed right-0 top-[3.8rem] z-[999] bg-gray-100 w-[35%] h-[calc(100vh-3.8rem)] py-3 px-3 ">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{companyName}</h3>
            <span
              className="p-1 rounded-md bg-gray-50 border  hover:shadow-md hover:bg-gray-100"
              onClick={() => setShowDetail(false)}
            >
              <IoClose className="h-5 w-5 cursor-pointer" />
            </span>
          </div>
          <JobDetail
            clientId={clientId}
            handleStatus={handleStatusChange}
            allClientJobData={allClientJobData}
            handleDeleteJob={handleDeleteJob}
          />
        </div>
      )}
      {/* Comment Modal  */}

      {isComment && (
        <div className="fixed top-0 left-0 w-full h-screen z-[999] bg-black/60 flex items-center justify-center">
          {/* <JobCommentModal
            setIsComment={setIsComment}
            jobId={jobId}
            setJobId={setJobId}
          /> */}
        </div>
      )}

      {/* Stop Timer */}
      {isShow && (
        <div className="fixed top-0 left-0 z-[999] w-full h-full bg-gray-300/80 flex items-center justify-center">
          <div className="w-[32rem] rounded-md bg-white shadow-md">
            <div className="flex  flex-col gap-3 ">
              <div className=" w-full flex items-center justify-between py-2 mt-1 px-4">
                <h3 className="text-[19px] font-semibold text-gray-800">
                  Enter your note here
                </h3>
                <span
                  onClick={() => {
                    setIsShow(false);
                  }}
                >
                  <IoClose className="text-black cursor-pointer h-6 w-6 " />
                </span>
              </div>
              <hr className="w-full h-[1px] bg-gray-500 " />
              <div className=" w-full px-4 py-2 flex-col gap-4">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add note here..."
                  className="w-full h-[6rem] rounded-md resize-none py-1 px-2 shadow border-2 border-gray-700"
                />
                <div className="flex items-center justify-end mt-4">
                  <button className={`${style.btn}`} onClick={handleStopTimer}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
