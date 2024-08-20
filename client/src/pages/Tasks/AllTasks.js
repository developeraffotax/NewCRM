import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../components/Loyout/Layout";
import { style } from "../../utlis/CommonStyle";
import {
  IoIosArrowDropdown,
  IoIosArrowDropup,
  IoMdDownload,
} from "react-icons/io";
import axios from "axios";
import AddProjectModal from "../../components/Tasks/AddProjectModal";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { IoCheckmarkDoneCircleSharp, IoClose } from "react-icons/io5";
import { MdAutoGraph, MdInsertComment, MdOutlineEdit } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useAuth } from "../../context/authContext";
import { TbCalendarDue } from "react-icons/tb";
import CompletedTasks from "./CompletedTasks";
import AddTaskModal from "../../components/Tasks/AddTaskModal";
import { Box, Button } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Loader from "../../utlis/Loader";
import { format } from "date-fns";
import { Timer } from "../../utlis/Timer";
import { useLocation } from "react-router-dom";
import { GrCopy } from "react-icons/gr";

const AllTasks = () => {
  const { auth } = useAuth();
  const [show, setShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [openAddProject, setOpenAddProject] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [showProject, setShowProject] = useState(false);
  const [active, setActive] = useState("All");
  const [activeBtn, setActiveBtn] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [tasksData, setTasksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  // Timer
  const [play, setPlay] = useState(false);
  const timerRef = useRef();
  const [isShow, setIsShow] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const dateStatus = ["Due", "Overdue"];

  const status = ["Todo", "Progress", "Review", "Onhold"];

  //---------- Get All Users-----------
  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/user/get_all/users`
      );
      setUsers(data?.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line
  }, []);

  //---------- Get All Projects-----------
  const getAllProjects = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/projects/get_all/project`
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

  // ---------Delete Project-------->
  const handleDeleteConfirmation = (projectId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProject(projectId);
        Swal.fire("Deleted!", "Your job has been deleted.", "success");
      }
    });
  };
  const deleteProject = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/v1/projects/delete/project/${id}`
      );
      if (data) {
        getAllProjects();
        // toast.success("Project Deleted!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateStatus = (projectId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this project!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateProjectStatus(projectId);
        Swal.fire(
          "Project Completed!",
          "Your project has been updated.",
          "success"
        );
      }
    });
  };

  const updateProjectStatus = async (id) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/projects/update/status/${id}`
      );
      if (data) {
        getAllProjects();
        setShowProject(false);
        // toast.success("Project completed!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  // ------------------------------Tasks----------------->

  // -------Get All Tasks----->
  const getAllTasks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/tasks/get/all`
      );
      setTasksData(data?.tasks);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTasks();
    // eslint-disable-next-line
  }, []);

  // -----------Update Task-Project-------->
  const updateTaskProject = async (taskId, projectId) => {
    if (!taskId || !projectId) {
      toast.error("Project/Task id is required!");
      return;
    }
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/tasks/update/project/${taskId}`,
        { projectId: projectId }
      );
      if (data?.success) {
        const updateTask = data?.task;
        toast.success("Project updated!");
        setTasksData((prevData) =>
          prevData.map((item) =>
            item._id === updateTask._id ? updateTask : item
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // -----------Update JobHolder -/- Lead | Status-------->
  const updateTaskJLS = async (taskId, jobHolder, lead, status) => {
    if (!taskId) {
      toast.error("Project/Task id is required!");
      return;
    }
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/tasks/update/task/JLS/${taskId}`,
        { jobHolder, lead, status }
      );
      if (data?.success) {
        const updateTask = data?.task;
        toast.success("Task updated successfully!");
        setTasksData((prevData) =>
          prevData.map((item) =>
            item._id === updateTask._id ? updateTask : item
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // -----------Update Alocate Task-------->
  const updateAlocateTask = async (
    taskId,
    allocateTask,
    startDate,
    deadline
  ) => {
    if (!taskId) {
      toast.error("Project/Task id is required!");
      return;
    }
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/tasks/update/allocate/task/${taskId}`,
        { allocateTask, startDate, deadline }
      );
      if (data?.success) {
        const updateTask = data?.task;
        // toast.success("Task updated successfully!");
        setTasksData((prevData) =>
          prevData.map((item) =>
            item._id === updateTask._id ? updateTask : item
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // -----------Handle Custom date filter------
  const getCurrentMonthYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
  };

  // <-----------Task Status------------->
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

  // -----------Copy Task------->

  const copyTask = async (originalTask) => {
    // Make a deep copy of the task
    const taskCopy = { ...originalTask };

    // Empty the 'task' field
    taskCopy.task = "";

    // Remove the '_id' field
    delete taskCopy._id;
    // console.log("Copied Task:", taskCopy);
    // setTasksData((prevData) => [...prevData, taskCopy]);

    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/tasks/create/task`,
      {
        projectId: taskCopy.project._id,
        jobHolder: taskCopy.jobHolder,
        task: taskCopy.task,
        hours: taskCopy.hours,
        startDate: taskCopy.startDate,
        deadline: taskCopy.deadline,
        lead: taskCopy.lead,
        label: taskCopy.label,
      }
    );
    if (data) {
      console.log("Copied Task:", data.task);

      setTasksData((prevData) => [...prevData, data.task]);
    }
  };

  // ----------------------Table Data--------->

  const columns = useMemo(
    () => [
      {
        accessorKey: "project.projectName",
        header: "Project",
        minSize: 170,
        maxSize: 200,
        size: 190,
        grow: true,
        Cell: ({ cell, row }) => {
          const projectId = row.original.project._id;

          return (
            <select
              value={projectId}
              onChange={(e) => {
                const selectedProjectId = e.target.value;
                updateTaskProject(row.original._id, selectedProjectId); // Update the task with the selected project ID
              }}
              className="w-full h-[2rem] rounded-md bg-transparent border-none outline-none"
            >
              <option value="">Select Project</option>
              {projects &&
                projects.map((proj) => (
                  <option value={proj._id} key={proj._id}>
                    {proj?.projectName}
                  </option>
                ))}
            </select>
          );
        },
        filterFn: "equals",
        filterSelectOptions: projects?.map((project) => project?.projectName),
        filterVariant: "select",
      },

      {
        accessorKey: "jobHolder",
        header: "Job Holder",
        Cell: ({ cell, row }) => {
          const jobholder = cell.getValue();

          return (
            <select
              value={jobholder || ""}
              className="w-[6rem] h-[2rem] rounded-md border border-orange-300 outline-none"
              onChange={(e) =>
                updateTaskJLS(row.original?._id, e.target.value, "", "")
              }
            >
              <option value="">Select Job holder</option>
              {users?.map((jobHold, i) => (
                <option value={jobHold?.name} key={i}>
                  {jobHold.name}
                </option>
              ))}
            </select>
          );
        },
        filterFn: "equals",
        filterSelectOptions: users.map((jobhold) => jobhold),
        filterVariant: "select",
        size: 130,
        minSize: 80,
        maxSize: 150,
        grow: true,
      },

      {
        accessorKey: "task",
        header: "Tasks",
        Cell: ({ cell, row }) => {
          const task = cell.getValue();
          const [allocateTask, setAllocateTask] = useState(task);

          const updateAllocateTask = (task) => {
            updateAlocateTask(row.original._id, allocateTask, "", "");
          };
          return (
            <div className="w-full h-full">
              <input
                type="text"
                placeholder="Enter Task..."
                value={allocateTask}
                onChange={(e) => setAllocateTask(e.target.value)}
                onBlur={(e) => updateAllocateTask(e.target.value)}
                className="w-full h-[2.3rem] focus:border border-gray-300 px-1 outline-none rounded"
              />
            </div>
          );
        },
        filterFn: "equals",
        filterVariant: "select",
        size: 220,
        minSize: 180,
        maxSize: 250,
        grow: true,
      },
      {
        accessorKey: "hours",
        header: "Hrs",
        filterFn: "equals",
        size: 90,
      },
      // End  year
      {
        accessorKey: "startDate",
        header: "Start Date",
        Cell: ({ cell, row }) => {
          const [date, setDate] = useState(
            format(new Date(cell.getValue()), "dd-MMM-yyyy")
          );

          const handleDateChange = (newDate) => {
            setDate(newDate);
            updateAlocateTask(row.original._id, "", date, "");
          };

          return (
            <div className="w-full flex items-center justify-center">
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onBlur={(e) => handleDateChange(e.target.value)}
                className={`h-[2rem] w-[6rem] cursor-pointer text-center rounded-md border border-gray-200 outline-none `}
              />
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue = row.getValue(columnId);
          if (!cellValue) return false;

          const cellDate = new Date(cellValue);

          if (filterValue.includes("-")) {
            const [year, month] = filterValue.split("-");
            const cellYear = cellDate.getFullYear().toString();
            const cellMonth = (cellDate.getMonth() + 1)
              .toString()
              .padStart(2, "0");

            return year === cellYear && month === cellMonth;
          }

          // Other filter cases
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
            case "30 Days":
              const in30Days = new Date(today);
              in30Days.setDate(today.getDate() + 30);
              return cellDate <= in30Days && cellDate > today;
            case "60 Days":
              const in60Days = new Date(today);
              in60Days.setDate(today.getDate() + 60);
              return cellDate <= in60Days && cellDate > today;
            case "Last 12 months":
              const lastYear = new Date(today);
              lastYear.setFullYear(today.getFullYear() - 1);
              return cellDate >= lastYear && cellDate <= today;
            default:
              return false;
          }
        },
        filterSelectOptions: [
          "Select",
          "Expired",
          "Today",
          "Tomorrow",
          "In 7 days",
          "In 15 days",
          "30 Days",
          "60 Days",
          "Custom date",
        ],
        filterVariant: "custom",
        size: 110,
        minSize: 80,
        maxSize: 140,
        grow: true,
        Filter: ({ column }) => {
          const [filterValue, setFilterValue] = useState("Select");
          const [customDate, setCustomDate] = useState(getCurrentMonthYear());

          useEffect(() => {
            if (filterValue === "Custom date") {
              column.setFilterValue(customDate);
            }
            //eslint-disable-next-line
          }, [customDate, filterValue]);

          const handleFilterChange = (e) => {
            setFilterValue(e.target.value);
            column.setFilterValue(e.target.value);
          };

          const handleCustomDateChange = (e) => {
            setCustomDate(e.target.value);
            column.setFilterValue(e.target.value);
          };

          return filterValue === "Custom date" ? (
            <input
              type="month"
              value={customDate}
              onChange={handleCustomDateChange}
              className="h-[2rem] w-[9rem] cursor-pointer text-center rounded-md border border-gray-200 outline-none"
            />
          ) : (
            <select
              value={filterValue}
              onChange={handleFilterChange}
              className="h-[2rem] w-[9rem] cursor-pointer text-center rounded-md border border-gray-200 outline-none"
            >
              {column.columnDef.filterSelectOptions.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        },
      },

      // Job DeadLine
      {
        accessorKey: "deadline",
        header: "Deadline",
        Cell: ({ cell, row }) => {
          const [date, setDate] = useState(
            format(new Date(cell.getValue()), "dd-MMM-yyyy")
          );

          const handleDateChange = (newDate) => {
            setDate(newDate);
            updateAlocateTask(row.original._id, "", "", date);
          };

          const cellDate = new Date(date);
          const today = new Date();
          const isExpired = cellDate < today;

          return (
            <div className="w-full flex items-center justify-center">
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onBlur={(e) => handleDateChange(e.target.value)}
                className={`h-[2rem] w-[6rem] cursor-pointer text-center rounded-md border border-gray-200 outline-none ${
                  isExpired ? "text-red-500" : ""
                }`}
              />
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue = row.getValue(columnId);
          if (!cellValue) return false;

          const cellDate = new Date(cellValue);

          if (filterValue.includes("-")) {
            const [year, month] = filterValue.split("-");
            const cellYear = cellDate.getFullYear().toString();
            const cellMonth = (cellDate.getMonth() + 1)
              .toString()
              .padStart(2, "0");

            return year === cellYear && month === cellMonth;
          }

          // Other filter cases
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
            case "30 Days":
              const in30Days = new Date(today);
              in30Days.setDate(today.getDate() + 30);
              return cellDate <= in30Days && cellDate > today;
            case "60 Days":
              const in60Days = new Date(today);
              in60Days.setDate(today.getDate() + 60);
              return cellDate <= in60Days && cellDate > today;
            case "Last 12 months":
              const lastYear = new Date(today);
              lastYear.setFullYear(today.getFullYear() - 1);
              return cellDate >= lastYear && cellDate <= today;
            default:
              return false;
          }
        },
        filterSelectOptions: [
          "Select",
          "Expired",
          "Today",
          "Tomorrow",
          "In 7 days",
          "In 15 days",
          "30 Days",
          "60 Days",
          // "Last 12 months",
          "Custom date",
        ],
        filterVariant: "custom",
        size: 110,
        minSize: 80,
        maxSize: 140,
        grow: true,
        Filter: ({ column }) => {
          const [filterValue, setFilterValue] = useState("Select");
          const [customDate, setCustomDate] = useState(getCurrentMonthYear());

          useEffect(() => {
            if (filterValue === "Custom date") {
              column.setFilterValue(customDate);
            }
            //eslint-disable-next-line
          }, [customDate, filterValue]);

          const handleFilterChange = (e) => {
            setFilterValue(e.target.value);
            column.setFilterValue(e.target.value);
          };

          const handleCustomDateChange = (e) => {
            setCustomDate(e.target.value);
            column.setFilterValue(e.target.value);
          };

          return filterValue === "Custom date" ? (
            <input
              type="month"
              value={customDate}
              onChange={handleCustomDateChange}
              className="h-[2rem] w-[9rem] cursor-pointer text-center rounded-md border border-gray-200 outline-none"
            />
          ) : (
            <select
              value={filterValue}
              onChange={handleFilterChange}
              className="h-[2rem] w-[9rem] cursor-pointer text-center rounded-md border border-gray-200 outline-none"
            >
              {column.columnDef.filterSelectOptions.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        },
      },

      //  -----Due & Over Due Status----->
      {
        accessorKey: "datestatus",
        header: "Status",
        Cell: ({ row }) => {
          const status = getStatus(
            row.original.startDate,
            row.original.deadline
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
            row.original.startDate,
            row.original.deadline
          );
          if (status === undefined || status === null) return false;
          return status.toString().toLowerCase() === filterValue.toLowerCase();
        },
        filterSelectOptions: ["Overdue", "Due"],
        filterVariant: "select",
        size: 100,
        minSize: 100,
        maxSize: 120,
        grow: true,
      },
      //
      {
        accessorKey: "status",
        header: "Task Status",
        Cell: ({ cell, row }) => {
          const statusValue = cell.getValue();

          return (
            <select
              value={statusValue}
              onChange={(e) =>
                updateTaskJLS(row.original?._id, "", "", e.target.value)
              }
              className="w-[6rem] h-[2rem] rounded-md border border-sky-300 outline-none"
            >
              <option value="">Select Status</option>
              <option value="Todo">Todo</option>
              <option value="Progress">Progress</option>
              <option value="Review">Review</option>
              <option value="Onhold">Onhold</option>
            </select>
          );
        },
        filterFn: "equals",
        filterSelectOptions: ["Select", "Todo", "Progress", "Review", "Onhold"],
        filterVariant: "select",
        size: 130,
      },
      {
        accessorKey: "lead",
        header: "Lead",
        Cell: ({ cell, row }) => {
          const leadValue = cell.getValue();

          return (
            <select
              value={leadValue || ""}
              onChange={(e) =>
                updateTaskJLS(row.original?._id, "", e.target.value, "")
              }
              className="w-[6rem] h-[2rem] rounded-md border-none bg-transparent outline-none"
            >
              <option value="">Select Lead</option>
              {users.map((lead, i) => (
                <option value={lead?.name} key={i}>
                  {lead?.name}
                </option>
              ))}
            </select>
          );
        },
        filterFn: "equals",
        filterSelectOptions: users.map((lead) => lead),
        filterVariant: "select",
        size: 110,
        minSize: 100,
        maxSize: 140,
        grow: true,
      },
      {
        accessorKey: "estimate_Time",
        header: "Est. Time",
        Cell: ({ cell, row }) => {
          const estimateTime = cell.getValue();
          return (
            <div className="flex items-center gap-1">
              <span className="text-[1rem]">⏳</span>
              <span>{estimateTime}</span>
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
                  clientId={auth?.user?.id}
                  jobId={row?.original?._id}
                  setIsShow={setIsShow}
                  note={note}
                  taskLink={currentPath}
                  pageName={"Tasks"}
                  taskName={row.original.project.projectName}
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
            <div className="flex items-center justify-center gap-1 w-full h-full">
              <span className="text-[1rem] cursor-pointer">
                <MdInsertComment className="h-5 w-5 text-orange-600 " />
              </span>
            </div>
          );
        },
        size: 100,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ cell, row }) => {
          return (
            <div
              className="flex items-center justify-center gap-1 w-full h-full"
              title="Copy this column"
            >
              <span
                className="text-[1rem] cursor-pointer"
                onClick={() => copyTask(row.original)}
              >
                <GrCopy className="h-5 w-5 text-cyan-600 " />
              </span>
            </div>
          );
        },
        size: 80,
      },
    ],
    // eslint-disable-next-line
    [projects, auth?.user?.id, currentPath, users, play]
  );

  const table = useMaterialReactTable({
    columns,
    data: tasksData,
    // getRowId: (originalRow) => originalRow?.id,
    // enableRowSelection: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    columnFilterDisplayMode: "popover",
    muiTableContainerProps: { sx: { maxHeight: "720px" } },
    enableColumnActions: false,
    enableColumnFilters: true,
    enableSorting: true,
    enableGlobalFilter: true,
    enableRowNumbers: true,
    enableColumnResizing: true,
    enableTopToolbar: true,
    enableBottomToolbar: true,
    // enableEditing: true,
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
        fontSize: "14px",
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

    renderTopToolbarCustomActions: ({ table }) => {
      const handleClearFilters = () => {
        table.setColumnFilters([]);
        table.setGlobalFilter("");
      };

      return (
        <Box
          sx={{
            display: "flex",
            gap: "7px",
            padding: "2px",
            flexWrap: "wrap",
          }}
        >
          <Button
            // onClick={handleExportData}
            // startIcon={<FileDownloadIcon />}
            className="w-[2rem] rounded-full"
          >
            <IoMdDownload className="h-5 w-5 text-gray-700" />
          </Button>
          <Button
            onClick={handleClearFilters}
            // startIcon={<ClearIcon />}
            className="w-[2rem] rounded-full"
          >
            <IoClose className="h-5 w-5 text-gray-700" />
          </Button>
        </Box>
      );
    },
  });

  return (
    <Layout>
      {!showCompleted ? (
        <div className=" relative w-full min-h-screen py-4 px-2 sm:px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className=" text-xl sm:text-2xl font-semibold ">Tasks</h1>
              <span className="" onClick={() => setShow(!show)}>
                {show ? (
                  <IoIosArrowDropup className="h-5 w-5 cursor-pointer" />
                ) : (
                  <IoIosArrowDropdown className="h-5 w-5 cursor-pointer" />
                )}
              </span>
            </div>

            {/* Project Buttons */}
            <div className="flex items-center gap-4">
              {auth?.user?.role === "Admin" && (
                <div
                  className=" relative w-[8rem]  border-2 border-gray-200 rounded-md py-1 px-2 flex items-center justify-between gap-1"
                  onClick={() => setShowProject(!showProject)}
                >
                  <span className="text-[15px] text-gray-900 cursor-pointer">
                    Projects
                  </span>
                  <span
                    onClick={() => setShowProject(!showProject)}
                    className="cursor-pointer"
                  >
                    {!showProject ? (
                      <IoIosArrowDown className="h-5 w-5 text-black cursor-pointer" />
                    ) : (
                      <IoIosArrowUp className="h-5 w-5 text-black cursor-pointer" />
                    )}
                  </span>
                  {/* -----------Projects------- */}
                  {showProject && (
                    <div className="absolute top-9 right-[-3.5rem] flex flex-col gap-2 max-h-[16rem] overflow-y-auto hidden1 z-[99] border rounded-sm shadow-sm bg-gray-50 py-2 px-2 w-[14rem]">
                      {projects &&
                        projects?.map((project) => (
                          <div
                            key={project._id}
                            className="w-full flex items-center justify-between gap-1 rounded-md bg-white border py-1 px-1 hover:bg-gray-100"
                          >
                            <p className="text-[13px] w-[8rem] ">
                              {project?.projectName}
                            </p>
                            <div className="flex items-center gap-1">
                              <span
                                title="Complete this Project"
                                onClick={() => handleUpdateStatus(project._id)}
                              >
                                <IoCheckmarkDoneCircleSharp className="h-5 w-5 cursor-pointer text-green-500 hover:text-green-600 transition-all duration-200" />
                              </span>
                              <span
                                onClick={() => {
                                  setProjectId(project._id);
                                  setOpenAddProject(true);
                                }}
                                title="Edit Project"
                              >
                                <MdOutlineEdit className="h-5 w-5 cursor-pointer hover:text-sky-500 transition-all duration-200" />
                              </span>
                              <span
                                title="Delete Project"
                                onClick={() =>
                                  handleDeleteConfirmation(project._id)
                                }
                              >
                                <AiTwotoneDelete className="h-5 w-5 cursor-pointer hover:text-red-500 transition-all duration-200" />
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
              <button
                className={`${style.button1} text-[15px] `}
                onClick={() => setOpenAddProject(true)}
                style={{ padding: ".4rem 1rem" }}
              >
                Add Project
              </button>
              <button
                className={`${style.button1} text-[15px] `}
                onClick={() => setIsOpen(true)}
                style={{ padding: ".4rem 1rem" }}
              >
                Add Task
              </button>
            </div>
          </div>
          {/*  */}
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
                  setActiveBtn("");
                  // filterByDep(dep);
                  // setShowCompleted(false);
                  // setActive1("");
                  // setFilterId("");
                }}
              >
                All (0)
              </div>
              {projects?.map((proj, i) => {
                // getDueAndOverdueCountByDepartment(proj);
                return (
                  <div
                    className={`py-1 rounded-tl-md rounded-tr-md px-1 cursor-pointer font-[500] text-[14px] ${
                      active === proj?.projectName &&
                      " border-2 border-b-0 text-orange-600 border-gray-300"
                    }`}
                    key={i}
                    onClick={() => {
                      setActive(proj?.projectName);
                      setActiveBtn("");
                      // filterByDep(dep);
                      // setShowCompleted(false);
                      // setActive1("");
                      // setFilterId("");
                    }}
                  >
                    {proj?.projectName} (0)
                  </div>
                );
              })}
              <div
                className={`py-1 rounded-tl-md rounded-tr-md px-1 cursor-pointer font-[500] text-[14px] ${
                  activeBtn === "completed" &&
                  showCompleted &&
                  " border-2 border-b-0 text-orange-600 border-gray-300"
                }`}
                onClick={() => {
                  setActiveBtn("completed");
                  setShowCompleted(true);
                  setActive("");
                }}
              >
                Completed
              </div>
              {/*  */}
              {/* -------------Filter Open Buttons-------- */}
              {/* <span
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
                setFilterId("");
              }}
              title="Clear filters"
            >
              <IoClose className="h-6 w-6  cursor-pointer" />
            </span> */}
            </div>
            {/*  */}
            <hr className="mb-1 bg-gray-300 w-full h-[1px]" />
            {loading ? (
              <div className="flex items-center justify-center w-full h-screen px-4 py-4">
                <Loader />
              </div>
            ) : (
              <div className="w-full min-h-[70vh] relative">
                <div className="h-full hidden1 overflow-y-scroll relative">
                  <MaterialReactTable table={table} />
                </div>
                {/* <span className="absolute bottom-4 left-[32%] z-10 font-semibold text-[15px] text-gray-900">
                  Total Hrs: {0}
                </span> */}
              </div>
            )}
          </div>

          {/* ----------------Add Project-------- */}
          {openAddProject && (
            <div className="fixed top-0 left-0 w-full h-screen z-[999] bg-gray-100/70 flex items-center justify-center py-6  px-4">
              <AddProjectModal
                users={users}
                setOpenAddProject={setOpenAddProject}
                getAllProjects={getAllProjects}
                projectId={projectId}
                setProjectId={setProjectId}
              />
            </div>
          )}

          {/* -----------Add Task-------------- */}
          {isOpen && (
            <div className="fixed top-0 left-0 w-full h-screen z-[999] bg-gray-100/70 flex items-center justify-center py-6  px-4">
              <AddTaskModal
                users={users}
                setIsOpen={setIsOpen}
                projects={projects}
                taskId={taskId}
                setTaskId={setTaskId}
                getAllTasks={getAllTasks}
              />
            </div>
          )}
        </div>
      ) : (
        <CompletedTasks setShowCompleted={setShowCompleted} />
      )}
    </Layout>
  );
};

export default AllTasks;
