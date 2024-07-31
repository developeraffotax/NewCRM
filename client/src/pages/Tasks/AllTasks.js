import { useEffect, useMemo, useState } from "react";
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
    </Layout>
  );
}
