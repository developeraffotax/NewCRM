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
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
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
import { MdAutoGraph } from "react-icons/md";
import { useLocation } from "react-router-dom";

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
  const [active1, setActive1] = useState("");
  const timerRef = useRef();
  const [showStatus, setShowStatus] = useState(false);
  const location = useLocation();

  // Extract the current path
  const currentPath = location.pathname;

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

  const dateStatus = ["Due", "Overdue"];

  const status = [
    "Data",
    "Progress",
    "Queries",
    "Approval",
    "Submission",
    "Billing",
    "Feedback",
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

  // -------Due & Overdue count------->
  const getDueAndOverdueCountByDepartment = (department) => {
    const filteredData = tableData.filter(
      (item) => item.job.jobName === department || department === "All"
    );

    const dueCount = filteredData.filter(
      (item) => getStatus(item.job.jobDeadline, item.job.yearEnd) === "Due"
    ).length;
    const overdueCount = filteredData.filter(
      (item) => getStatus(item.job.jobDeadline, item.job.yearEnd) === "Overdue"
    ).length;

    return { due: dueCount, overdue: overdueCount };
  };
  // --------------Status Length---------->
  const getStatusCount = (status, department) => {
    return tableData.filter((item) =>
      department === "All"
        ? item?.job?.jobStatus === status
        : item?.job?.jobStatus === status && item?.job?.jobName === department
    )?.length;
  };
  // --------------Job_Holder Length---------->

  const getJobHolderCount = (user, department) => {
    return tableData.filter((item) =>
      department === "All"
        ? item?.job?.jobHolder === user
        : item?.job?.jobHolder === user && item?.job?.jobName === department
    )?.length;
  };

  // --------------Filter Data By Department ----------->

  const filterByDep = (value) => {
    const filteredData = tableData.filter(
      (item) =>
        item.job.jobName === value ||
        item.job.jobStatus === value ||
        item.job.jobHolder === value
    );

    setFilterData([...filteredData]);
  };

  // -------------- Filter Data By Department || Status || Placeholder ----------->

  // Testing
  const filterByDepStat = (value, dep) => {
    let filteredData = [];

    if (dep === "All") {
      filteredData = tableData.filter(
        (item) =>
          item.job.jobStatus === value ||
          item.job.jobHolder === value ||
          getStatus(item.job.jobDeadline, item.job.yearEnd) === value ||
          getStatus(item.job.jobDeadline, item.job.yearEnd) === value
      );
    } else {
      filteredData = tableData.filter((item) => {
        const jobMatches = item.job.jobName === dep;
        const statusMatches = item.job.jobStatus === value;
        const holderMatches = item.job.jobHolder === value;

        return (
          (holderMatches && jobMatches) ||
          (statusMatches && jobMatches) ||
          (jobMatches &&
            getStatus(item.job.jobDeadline, item.job.yearEnd) === value) ||
          (jobMatches &&
            getStatus(item.job.jobDeadline, item.job.yearEnd) === value)
        );
      });
    }

    setFilterData([...filteredData]);
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

  // ---------------Handle Update Job Holder ---------->
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

  // <-----------Job Status------------->
  const getStatus = (jobDeadline, yearEnd) => {
    const deadline = new Date(jobDeadline);
    const yearEndDate = new Date(yearEnd);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const yearEndDateOnly = new Date(yearEndDate);
    yearEndDateOnly.setHours(0, 0, 0, 0);

    if (deadlineDate < today || yearEndDateOnly < today) {
      return "Overdue";
    } else if (
      deadlineDate.getTime() === today.getTime() ||
      yearEndDateOnly.getTime() === today.getTime()
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

  // ---------------Handle Update Dates-------->
  const handleUpdateDates = async (jobId, date, type) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/client/update/dates/${jobId}`,
        type === "yearEnd"
          ? { yearEnd: date }
          : type === "jobDeadline"
          ? { jobDeadline: date }
          : { currentDate: date }
      );
      if (data) {
        toast.success("Date updated successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  //  --------------Table Columns Data--------->
  const columns = useMemo(
    () => [
      {
        accessorKey: "companyName",
        header: "Company Name",
        size: 170,
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
        header: "Client",
        size: 110,
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
              className="w-[6rem] h-[2rem] rounded-md border border-orange-300 outline-none"
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
        size: 130,
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
        size: 110,
      },
      {
        accessorKey: "totalHours",
        header: "Hours",
        filterFn: "equals",
        size: 50,
      },
      // End  year
      {
        accessorKey: "job.yearEnd",
        header: "Year End",

        Cell: ({ cell, row }) => {
          const [date, setDate] = useState(
            format(new Date(cell.getValue()), "yyyy-MM-dd")
          );

          const handleDateChange = (newDate) => {
            setDate(newDate);
            handleUpdateDates(row.original._id, newDate, "yearEnd");
          };

          return (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onBlur={(e) => handleDateChange(e.target.value)}
              className="h-[2rem] w-[6.5rem] cursor-pointer rounded-md border border-gray-200 outline-none"
            />
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue = row.getValue(columnId);
          if (!cellValue) return false;

          const cellDate = new Date(cellValue);
          const today = new Date();

          switch (filterValue) {
            case "Expired":
              return cellDate < today;
            case "Today":
              return cellDate.toDateString() === today.toDateString();
            case "Tomorrow":
              const tomorrow = new Date(today);
              tomorrow.setDate(today.getDate() + 1);
              return cellDate.toDateString() === tomorrow.toDateString();
            case "In 7 days":
              const in7Days = new Date(today);
              in7Days.setDate(today.getDate() + 7);
              return cellDate <= in7Days && cellDate > today;
            case "In 15 days":
              const in15Days = new Date(today);
              in15Days.setDate(today.getDate() + 15);
              return cellDate <= in15Days && cellDate > today;
            case "Month Wise":
              return (
                cellDate.getFullYear() === today.getFullYear() &&
                cellDate.getMonth() === today.getMonth()
              );
            default:
              return false;
          }
        },
        filterSelectOptions: [
          "Expired",
          "Today",
          "Tomorrow",
          "In 7 days",
          "In 15 days",
          "Month Wise",
        ],
        filterVariant: "select",
        size: 120,
      },
      // Job DeadLine
      {
        accessorKey: "job.jobDeadline",
        header: "Deadline",
        Cell: ({ cell, row }) => {
          const [date, setDate] = useState(
            format(new Date(cell.getValue()), "yyyy-MM-dd")
          );

          const handleDateChange = (newDate) => {
            setDate(newDate);
            handleUpdateDates(row.original._id, newDate, "jobDeadline");
          };

          return (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onBlur={(e) => handleDateChange(e.target.value)}
              className=" h-[2rem] w-[6.5rem]
               cursor-pointer rounded-md border border-gray-200  outline-none"
            />
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue = row.getValue(columnId);
          if (!cellValue) return false;

          const cellDate = new Date(cellValue);
          const today = new Date();

          switch (filterValue) {
            case "Expired":
              return cellDate < today;
            case "Today":
              return cellDate.toDateString() === today.toDateString();
            case "Tomorrow":
              const tomorrow = new Date(today);
              tomorrow.setDate(today.getDate() + 1);
              return cellDate.toDateString() === tomorrow.toDateString();
            case "In 7 days":
              const in7Days = new Date(today);
              in7Days.setDate(today.getDate() + 7);
              return cellDate <= in7Days && cellDate > today;
            case "In 15 days":
              const in15Days = new Date(today);
              in15Days.setDate(today.getDate() + 15);
              return cellDate <= in15Days && cellDate > today;
            case "Month Wise":
              return (
                cellDate.getFullYear() === today.getFullYear() &&
                cellDate.getMonth() === today.getMonth()
              );
            default:
              return false;
          }
        },
        filterSelectOptions: [
          "Expired",
          "Today",
          "Tomorrow",
          "In 7 days",
          "In 15 days",
          "Month Wise",
        ],
        filterVariant: "select",
        size: 120,
      },
      //  Current Date
      {
        accessorKey: "currentDate",
        header: "Job Date",
        Cell: ({ cell, row }) => {
          const [date, setDate] = useState(
            format(new Date(cell.getValue()), "yyyy-MM-dd")
          );

          const handleDateChange = (newDate) => {
            setDate(newDate);
            handleUpdateDates(row.original._id, newDate, "currentDate");
          };

          return (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onBlur={(e) => handleDateChange(e.target.value)}
              className=" h-[2rem] w-[6.5rem]
               cursor-pointer rounded-md border border-gray-200  outline-none"
            />
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue = row.getValue(columnId);
          if (!cellValue) return false;

          const cellDate = new Date(cellValue);
          const today = new Date();

          switch (filterValue) {
            case "Expired":
              return cellDate < today;
            case "Today":
              return cellDate.toDateString() === today.toDateString();
            case "Tomorrow":
              const tomorrow = new Date(today);
              tomorrow.setDate(today.getDate() + 1);
              return cellDate.toDateString() === tomorrow.toDateString();
            case "In 7 days":
              const in7Days = new Date(today);
              in7Days.setDate(today.getDate() + 7);
              return cellDate <= in7Days && cellDate > today;
            case "In 15 days":
              const in15Days = new Date(today);
              in15Days.setDate(today.getDate() + 15);
              return cellDate <= in15Days && cellDate > today;
            case "Month Wise":
              return (
                cellDate.getFullYear() === today.getFullYear() &&
                cellDate.getMonth() === today.getMonth()
              );
            default:
              return false;
          }
        },
        filterSelectOptions: [
          "Expired",
          "Today",
          "Tomorrow",
          "In 7 days",
          "In 15 days",
          "Month Wise",
        ],
        filterVariant: "select",
        size: 120,
      },
      //  -----Due & Over Due Status----->
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => {
          const status = getStatus(
            row.original.job.jobDeadline,
            row.original.job.yearEnd
          );

          return (
            <span
              className={`text-white px-4  rounded-[2rem] ${
                status === "Due"
                  ? "bg-green-500  py-[6px] "
                  : status === "Overdue"
                  ? "bg-red-500  py-[6px] "
                  : "bg-transparent"
              }`}
            >
              {status}
            </span>
          );
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
        size: 100,
      },
      //
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
              className="w-[6rem] h-[2rem] rounded-md border border-sky-300 outline-none"
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
        size: 110,
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
        size: 100,
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
        size: 90,
      },
      {
        accessorKey: "timertracker",
        header: "Time Tr.",
        Cell: ({ cell, row }) => {
          // const statusValue = cell.getValue();
          // console.log("row", row.original.job.jobName);

          return (
            <div
              className="flex items-center justify-center gap-1 w-full h-full "
              onClick={() => setPlay(!play)}
            >
              <span className="text-[1rem] cursor-pointer  ">
                <Timer
                  ref={timerRef}
                  clientId={auth.user.id}
                  jobId={row.original._id}
                  setIsShow={setIsShow}
                  note={note}
                  taskLink={currentPath}
                  pageName={"Jobs"}
                  taskName={row.original.companyName}
                  setNote={setNote}
                />
              </span>
            </div>
          );
        },
        size: 110,
      },
      {
        accessorKey: "comments",
        header: "Comments",
        Cell: ({ cell, row }) => {
          const comments = cell.getValue();

          return (
            <div
              className="flex items-center justify-center gap-1 w-full h-full"
              onClick={() => {
                setJobId(row.original._id);
                setIsComment(true);
              }}
            >
              <span className="text-[1rem] cursor-pointer">
                <MdInsertComment className="h-5 w-5 text-orange-600 " />
              </span>
              <span>({comments?.length})</span>
            </div>
          );
        },
        size: 100,
      },
    ],

    [users, play, auth, note]
  );

  const table = useMaterialReactTable({
    columns,
    data: active === "All" && !active1 ? tableData : filterData,
    getRowId: (originalRow) => originalRow.id,
    // enableRowSelection: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    columnFilterDisplayMode: "popover",
    muiTableContainerProps: { sx: { maxHeight: "650px" } },
    enableColumnActions: false,
    enableColumnFilters: true,
    enableSorting: true,
    enableGlobalFilter: true,
    enableRowNumbers: true,
    enableColumnResizing: true,
    enableTopToolbar: true,
    enableBottomToolbar: true,
    // state: { isLoading: loading },

    enablePagination: true,
    initialState: {
      pagination: { pageSize: 20 },
      pageSize: 20,
      density: "compact",
    },

    muiTableHeadCellProps: {
      style: {
        fontWeight: "600",
        fontSize: "15px",
        backgroundColor: "#f0f0f0",
        color: "#000",
        padding: ".7rem 0.3rem",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: "1px solid rgba(203, 201, 201, 0.5)",
      },
    },
    muiTableProps: {
      sx: {
        "& .MuiTableHead-root": {
          backgroundColor: "#f0f0f0",
        },
        tableLayout: "auto",
        fontSize: "14px",
        border: "1px solid rgba(81, 81, 81, .5)",
        caption: {
          captionSide: "top",
        },
      },
    },
  });

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
              Add Client
            </button>
          </div>
          {/*  */}

          {/* -----------Filters By Deparment--------- */}
          <div className="flex items-center flex-wrap gap-2 mt-3">
            {departments?.map((dep, i) => {
              getDueAndOverdueCountByDepartment(dep);
              return (
                <div
                  className={`py-1 rounded-tl-md rounded-tr-md px-1 cursor-pointer font-[500] text-[14px] ${
                    active === dep &&
                    " border-2 border-b-0 text-orange-600 border-gray-300"
                  }`}
                  key={i}
                  onClick={() => {
                    setActive(dep);
                    filterByDep(dep);
                    setActive1("");
                  }}
                >
                  {dep} ({getDepartmentCount(dep)})
                </div>
              );
            })}
            {/*  */}
            {/* -------------Filter Open Buttons-------- */}
            <span
              className={` p-1 rounded-md hover:shadow-md bg-gray-50 mb-1  cursor-pointer border  ${
                activeBtn === "jobHolder" && "bg-orange-500 text-white"
              }`}
              onClick={() => {
                setActiveBtn("jobHolder");
                setShowJobHolder(!showJobHolder);
              }}
              title="Filter by Job Holder"
            >
              <IoBriefcaseOutline className="h-6 w-6  cursor-pointer " />
            </span>
            <span
              className={` p-1 rounded-md hover:shadow-md mb-1 bg-gray-50 cursor-pointer border ${
                activeBtn === "due" && "bg-orange-500 text-white"
              }`}
              onClick={() => {
                setActiveBtn("due");
                setShowDue(!showDue);
              }}
              title="Filter by Status"
            >
              <TbCalendarDue className="h-6 w-6  cursor-pointer" />
            </span>
            <span
              className={` p-1 rounded-md hover:shadow-md mb-1 bg-gray-50 cursor-pointer border ${
                activeBtn === "status" && "bg-orange-500 text-white"
              }`}
              onClick={() => {
                setActiveBtn("status");
                setShowStatus(!showStatus);
              }}
              title="Filter by Job Status"
            >
              <MdAutoGraph className="h-6 w-6  cursor-pointer" />
            </span>
            <span
              className={` p-1 rounded-md hover:shadow-md mb-1 bg-gray-50 cursor-pointer border `}
              onClick={() => {
                setActive("All");
                setActiveBtn("");
                setShowStatus(false);
                setShowJobHolder(false);
                setShowDue(false);
                setActive1("");
              }}
              title="Clear filters"
            >
              <IoClose className="h-6 w-6  cursor-pointer" />
            </span>
          </div>
          {/*  */}
          <hr className="mb-1 bg-gray-300 w-full h-[1px]" />

          {/* ----------Job_Holder Summery Filters---------- */}
          {showJobHolder && activeBtn === "jobHolder" && (
            <>
              <div className="w-full  py-2 ">
                <h3 className="text-[19px] font-semibold text-black">
                  Job Holder Summary
                </h3>
                <div className="flex items-center flex-wrap gap-4">
                  {users?.map((user, i) => (
                    <div
                      className={`py-1 rounded-tl-md rounded-tr-md px-1 cursor-pointer font-[500] text-[14px] ${
                        active1 === user &&
                        "  border-b-2 text-orange-600 border-orange-600"
                      }`}
                      key={i}
                      onClick={() => {
                        setActive1(user);
                        filterByDepStat(user, active);
                      }}
                    >
                      {user} ({getJobHolderCount(user, active)})
                    </div>
                  ))}
                </div>
              </div>
              <hr className="mb-1 bg-gray-300 w-full h-[1px]" />
            </>
          )}

          {/* ----------Date Status Summery Filters---------- */}
          {showDue && activeBtn === "due" && (
            <>
              <div className="w-full py-2">
                <h3 className="text-[19px] font-semibold text-black">
                  Date Status Summary
                </h3>
                <div className="flex items-center flex-wrap gap-4">
                  {dateStatus?.map((stat, i) => {
                    const { due, overdue } =
                      getDueAndOverdueCountByDepartment(active);
                    return (
                      <div
                        className={`py-1 rounded-tl-md rounded-tr-md px-1 cursor-pointer font-[500] text-[14px] ${
                          active1 === stat &&
                          " border-b-2 text-orange-600 border-orange-600"
                        }`}
                        key={i}
                        onClick={() => {
                          setActive1(stat);
                          filterByDepStat(stat, active);
                        }}
                      >
                        {stat === "Due" ? (
                          <span>Due {due}</span>
                        ) : (
                          <span>Overdue {overdue}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <hr className="mb-1 bg-gray-300 w-full h-[1px]" />
            </>
          )}

          {/* ----------Status Summery Filters---------- */}
          {showStatus && activeBtn === "status" && (
            <>
              <div className="w-full  py-2 ">
                <h3 className="text-[19px] font-semibold text-black">
                  Status Summary
                </h3>
                <div className="flex items-center flex-wrap gap-4">
                  {status?.map((stat, i) => (
                    <div
                      className={`py-1 rounded-tl-md rounded-tr-md px-1 cursor-pointer font-[500] text-[14px] ${
                        active1 === stat &&
                        "  border-b-2 text-orange-600 border-orange-600"
                      }`}
                      key={i}
                      onClick={() => {
                        setActive1(stat);
                        filterByDepStat(stat, active);
                      }}
                    >
                      {stat} ({getStatusCount(stat, active)})
                    </div>
                  ))}
                </div>
              </div>
              <hr className="mb-1 bg-gray-300 w-full h-[1px]" />
            </>
          )}

          {/* ---------------------Data Table---------------- */}
          <div className="w-full h-screen  relative">
            <div className="h-screen hidden1 overflow-y-scroll   relative ">
              <MaterialReactTable table={table} />
            </div>
          </div>
        </div>
      )}
      {/* ------------Add Client_Job Modal -------------*/}
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

      {/*---------------Job Details---------------*/}

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
      {/* ------------Comment Modal---------*/}

      {isComment && (
        <div className="fixed bottom-4 right-4 w-[30rem] max-h-screen z-[999]  flex items-center justify-center">
          <JobCommentModal
            setIsComment={setIsComment}
            jobId={jobId}
            setJobId={setJobId}
            users={users}
          />
        </div>
      )}

      {/* -------------Stop Timer Btn-----------*/}
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
