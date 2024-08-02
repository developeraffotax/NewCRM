import React, { useEffect, useMemo, useState } from "react";
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
import { FaCirclePlay } from "react-icons/fa6";
import { IoStopCircle } from "react-icons/io5";
import { MdInsertComment } from "react-icons/md";
import toast from "react-hot-toast";
import { useAuth } from "../../context/authContext";
import Loader from "../../utlis/Loader";

import { TbCalendarDue } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import JobDetail from "./JobDetail";
import { IoBriefcaseOutline } from "react-icons/io5";

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

  // -------------- Department Lenght--------->
  const getDepartmentCount = (department) => {
    if (department === "All") {
      return tableData?.length;
    }
    return tableData?.filter((item) => item?.job?.jobName === department)?.length;
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
              className="cursor-pointer text-orange-500 hover:text-orange-600 w-full h-full"
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
        accessorKey: "timerestimate",
        header: "Est. Time",
        Cell: ({ cell, row }) => {
          // const statusValue = cell.getValue();
          return (
            <div className="flex items-center gap-1">
              <span className="text-[1rem]">⏳</span>
              <span>{"3h"}</span>
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

          return (
            <div
              className="flex items-center gap-1 w-full h-full "
              onClick={() => setPlay(!play)}
            >
              <span className="text-[1rem] cursor-pointer">
                {play ? (
                  <IoStopCircle className="h-5 w-5 text-red-600 animate-pulse" />
                ) : (
                  <FaCirclePlay className="h-5 w-5 text-sky-600 " />
                )}
              </span>
              <span>{"3h"}</span>
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
            <div className="flex items-center gap-1 w-full h-full ">
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

    [users, play]
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
          <div className="w-full h-screen">
            {/* overflow-y-scroll  */}
            <div className="h-screen hidden1 overflow-y-scroll  ">
              <MaterialReactTable
                columns={columns}
                data={active === "All" ? tableData : filterData}
                enableRowSelection
                getRowId={(originalRow) => originalRow.id}
                enableColumnActions={false}
                enableColumnFilters={true}
                enableSorting={true}
                enableGlobalFilter={true}
                // enableRowNumbers={true}
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
        <div className="fixed top-14 left-0 w-full h-screen z-[999] bg-gray-100 flex items-center justify-center py-6  px-4">
          <span
            className="absolute top-[2px] right-[.5rem] cursor-pointer z-10 p-1 rounded-lg bg-white/50 hover:bg-gray-300/70 transition-all duration-150 flex items-center justify-center"
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

      {showDetail && (
        <div className="fixed right-0 top-[3.8rem] z-[999] bg-gray-100 w-[40%] h-[calc(100vh-3.8rem)] py-3 px-3 ">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{companyName}</h3>
            <span
              className="p-1 rounded-md bg-gray-50 border  hover:shadow-md hover:bg-gray-100"
              onClick={() => setShowDetail(false)}
            >
              <IoClose className="h-5 w-5 cursor-pointer" />
            </span>
          </div>
          <JobDetail clientId={clientId} handleStatus={handleStatusChange} />
        </div>
      )}
    </Layout>
  );
}
