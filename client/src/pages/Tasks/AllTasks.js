<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlay, FaStop, FaUser } from "react-icons/fa";
=======
import { useEffect, useMemo, useState } from "react";
>>>>>>> 320833a98d1f83bc52d5f33af85d0e1ee44988d1
import Layout from "../../components/Loyout/Layout";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { data } from "../../utlis/DummyData";
import axios from "axios";
import { format } from "date-fns";
import { FaCirclePlay } from "react-icons/fa6";
import { IoStopCircle } from "react-icons/io5";
import { MdInsertComment } from "react-icons/md";

<<<<<<< HEAD
const Timer = () => {
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerId, setTimerId] = useState(null);

  const startTimer = async () => {
    const start = new Date();
    setStartTime(start);

    try {
      await axios.post("/api/timer/start", { startTime: start });
    } catch (error) {
      console.error("Error sending start time:", error);
    }

    const id = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
    setTimerId(id);
  };

  const stopTimer = async () => {
    clearInterval(timerId);
    const stop = new Date();
    setStopTime(stop);

    try {
      await axios.post("/api/timer/stop", { stopTime: stop });
    } catch (error) {
      console.error("Error sending stop time:", error);
    }

    setElapsedTime(0);
    setTimerId(null);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerId);
    };
  }, [timerId]);

  return (
    <Layout>
      <div className="">Tasks</div>
      {/* <div className="flex flex-col items-center p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <div className="flex items-center mb-4">
          <FaUser size="2x" className="text-gray-600 mr-3" />
          <span className="text-lg font-semibold text-gray-800">John Doe</span>
        </div>
        <div className="text-2xl font-bold text-gray-800 mb-6">
          {Math.floor(elapsedTime / 3600)
            .toString()
            .padStart(2, "0")}
          :
          {Math.floor((elapsedTime % 3600) / 60)
            .toString()
            .padStart(2, "0")}
          :{(elapsedTime % 60).toString().padStart(2, "0")}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={startTimer}
            disabled={startTime && !stopTime}
            className="flex items-center justify-center px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaPlay className="mr-2" />
            Start
          </button>
          <button
            onClick={stopTimer}
            disabled={!startTime || stopTime}
            className="flex items-center justify-center px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaStop className="mr-2" />
            Stop
          </button>
        </div>
      </div> */}
=======
export default function AllTasks() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [statusFvalue, setStatusFvalue] = useState("");
  const [tableData, setTableData] = useState(data);
  const [play, setPlay] = useState(false);

  // Get All Users
  const getAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/user/get_all/users`
      );
      setUsers(data?.users.map((user) => user.name));
      console.log("users", data?.users);
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

  // Handle Status Change
  const handleStatusChange = async (rowId, newStatus) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/job/${rowId}`,
        {
          status: newStatus,
        }
      );
      // Update table data after successful status change
      setTableData((prevData) =>
        prevData.map((item) =>
          item.id === rowId
            ? { ...item, job: { ...item.job, jobStatus: newStatus } }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const handleCheckboxChange = (rowIndex) => {
    setSelectedRows((prev) => {
      if (prev.includes(rowIndex)) {
        return prev.filter((index) => index !== rowIndex);
      } else {
        return [...prev, rowIndex];
      }
    });
  };

  // Job Status
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

  const columns = useMemo(
    () => [
      // {
      //   accessorKey: "sr",
      //   header: "Sr",
      //   size: 50,
      //   Cell: ({ row }) => (
      //     <div className="flex items-center gap-1">
      //       <input
      //         type="checkbox"
      //         value={selectedRows.includes(row.index)}
      //         onChange={() => handleCheckboxChange(row.index)}
      //         style={{ height: "18px", width: "18px" }}
      //       />
      //       {row.index + 1}
      //     </div>
      //   ),
      // },
      {
        accessorKey: "companyName",
        header: "Company Name",
        size: 10,
      },
      {
        accessorKey: "clientName",
        header: "Client Name",
        size: 50,
      },
      {
        accessorKey: "job.jobHolder",
        header: "Job Holder",
        filterFn: "equals",
        filterSelectOptions: users.map((user) => user),
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
                handleStatusChange(row.original.id, e.target.value)
              }
              className="w-[7rem] h-[2rem] rounded-md border-2 border-sky-500 outline-none"
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

          console.log("Lead Value:", leadValue);
          console.log("Lead Val1:", row.original.job.lead);

          return (
            <select
              value={leadValue || ""} // Ensure that value is set correctly
              onChange={(e) =>
                handleStatusChange(row.original.id, e.target.value)
              }
              className="w-[7rem] h-[2rem] rounded-md border-2 border-orange-500 outline-none"
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
        header: "Time Extimate",
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
        header: "Time Tracked",
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

    [users, selectedRows, play]
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    // columnFilterDisplayMode: "popover",
    onColumnHeaderClick: (column) => {
      if (column.id === "job.jobHolder") {
        table.toggleColumnFilterPopup(column.id);
      }
    },
  });

  return (
    <Layout>
      <div className="h-[100vh] overflow-hidden flex flex-col">
        <h1>All Tasks</h1>
        <div className="h-full overflow-y-auto">
          <MaterialReactTable
            columns={columns}
            data={tableData}
            enableRowSelection
            getRowId={(originalRow) => originalRow.id}
            enableColumnActions={false}
            enableColumnFilters={true}
            enableSorting={true}
            enableGlobalFilter={true}
            enablePagination={true}
            muiTableHeadCellProps={{
              style: {
                fontWeight: "bold",
              },
            }}
            muiTableProps={{
              sx: {
                tableLayout: "auto",
              },
            }}
          />
        </div>
      </div>
>>>>>>> 320833a98d1f83bc52d5f33af85d0e1ee44988d1
    </Layout>
  );
};

export default Timer;
