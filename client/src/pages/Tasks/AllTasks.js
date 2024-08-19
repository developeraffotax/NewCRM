import React, { useEffect, useState } from "react";
import Layout from "../../components/Loyout/Layout";
import { style } from "../../utlis/CommonStyle";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import axios from "axios";
import AddProjectModal from "../../components/Tasks/AddProjectModal";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { IoCheckmarkDoneCircleSharp, IoClose } from "react-icons/io5";
import { MdAutoGraph, MdOutlineEdit } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useAuth } from "../../context/authContext";
import { TbCalendarDue } from "react-icons/tb";
import CompletedTasks from "./CompletedTasks";

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
        </div>
      ) : (
        <CompletedTasks setShowCompleted={setShowCompleted} />
      )}
    </Layout>
  );
};

export default AllTasks;
