"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineDashboard } from "react-icons/md";
import { FaTasks, FaPlus } from "react-icons/fa";
import { HiOutlineDocumentReport, HiOutlinePencil } from "react-icons/hi";
import Dashboard from "@/app/components/Dashboard";
import Tasks from "@/app/components/Tasks";
import Reports from "@/app/components/Reports";
import ThemeToggle from "./components/ThemeToggle";
import MobileNavigation from "./components/MobileNavigation";
import {
  useGetAllProjectsQuery,
  useDeleteProjectMutation,
} from "@/app/redux/api/projectDetailApi";
import { FiChevronDown } from "react-icons/fi";
import { toast } from "react-toastify";
import { MdAdminPanelSettings } from "react-icons/md";
import { useRouter } from "next/navigation";
import { TfiWrite } from "react-icons/tfi";
import Summary from "./components/summary";

const createEmptyProject = () => ({
  title: "New Project",
  reports: {
    email: "",
    capability: "Maintain (Keep lights on)",
    methodology: "Bulmahn, Wayne",
    pillar: "Organizational & Staff",
    rockSize: "",
    useCase: "",
    totalHours: 0,
    totalResources: 0,
    summary: "",
    tasks: [],
  },
});

export default function Home() {
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("Project Name");
  const [rockSize, setRockSize] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: projects = [] } = useGetAllProjectsQuery();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    hours: 0,
    resources: 1,
    duration: 1,
    comment: "",
    department: "",
  });
  const [deleteProject] = useDeleteProjectMutation();

  const dropdownRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteProject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      await deleteProject(id).unwrap();
      toast.success("Project deleted successfully!");

      const currentProject = JSON.parse(localStorage.getItem("currentProject"));
      if (currentProject && currentProject._id === id) {
        const newProject = createEmptyProject();
        localStorage.setItem("currentProject", JSON.stringify(newProject));
        localStorage.setItem("tasks", JSON.stringify([]));
        localStorage.setItem(
          "newTask",
          JSON.stringify({
            title: "",
            hours: 0,
            resources: 1,
            duration: 1,
            comment: "",
            department: "",
          })
        );
      }

      setShowDropdown(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project.");
    }
  };

  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    const storedProject = localStorage.getItem("currentProject");
    const storedTasks = localStorage.getItem("tasks");
    const storedNewTask = localStorage.getItem("newTask");

    if (storedTab) setActiveTab(storedTab);
    else setActiveTab("dashboard");

    if (storedProject) {
      const project = JSON.parse(storedProject);
      setProjectName(project.title || "Project Name");
      setRockSize(project.reports?.rockSize || "");
      setTasks(project.reports?.tasks || []);
    }

    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedNewTask) setNewTask(JSON.parse(storedNewTask));

    setLoading(false);
  }, []);

  useEffect(() => {
    const handleCustomStorageChange = (event) => {
      if (event.detail.key === "currentProject") {
        const updatedProject = JSON.parse(event.detail.newValue);
        setRockSize(updatedProject.reports?.rockSize || "");
      }
    };

    window.addEventListener("customStorageChange", handleCustomStorageChange);
    return () =>
      window.removeEventListener(
        "customStorageChange",
        handleCustomStorageChange
      );
  }, []);

  useEffect(() => {
    if (activeTab) localStorage.setItem("activeTab", activeTab);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("newTask", JSON.stringify(newTask));
  }, [activeTab, tasks, newTask]);

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
    const updatedProject = JSON.parse(localStorage.getItem("currentProject"));
    updatedProject.title = e.target.value;
    localStorage.setItem("currentProject", JSON.stringify(updatedProject));
  };

  const handleEditClick = () => setIsEditing(true);
  const handleBlur = () => setIsEditing(false);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleBlur();
  };

  const handleCreateProject = () => {
    const newProject = createEmptyProject();
    localStorage.setItem("currentProject", JSON.stringify(newProject));
    setProjectName(newProject.title);
    window.location.reload();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "tasks":
        return (
          <Tasks
            tasks={tasks}
            setTasks={setTasks}
            newTask={newTask}
            setNewTask={setNewTask}
          />
        );
      case "reports":
        return <Reports />;
      case "summary":
        return <Summary tasks={tasks} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-all">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <motion.p
            className="text-gray-600 dark:text-gray-300 font-semibold tracking-wide text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Project Manager Loading...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white transition-all duration-300 relative px-2">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center md:mb-4 gap-4 py-2 md:px-8 px-4">
        <div className="flex items-center justify-between w-full">
          <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          <div
            className="flex flex-row items-center justify-center gap-2 relative mt-2"
            ref={dropdownRef}
          >
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <FiChevronDown className="text-xl" />
            </div>

            {isEditing ? (
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={projectName}
                  onChange={handleProjectNameChange}
                  onBlur={handleBlur}
                  onKeyPress={handleKeyPress}
                  autoFocus
                  className="w-full max-w-[250px] sm:max-w-none text-2xl sm:text-3xl font-bold bg-transparent border-b-2 border-indigo-500 focus:outline-none pb-1 dark:text-white placeholder-gray-400"
                  placeholder="Enter Project Name"
                />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4 cursor-text hover:bg-gray-100 dark:hover:bg-gray-800/50 px-2 py-2 rounded-lg transition-colors"
                onClick={handleEditClick}
              >
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                    {projectName}
                  </h1>
                  <HiOutlinePencil className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
              </motion.div>
            )}


            {showDropdown && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-14 left-0 w-52 bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden z-50"
              >
                {projects.map((project) => (
                  <li
                    key={project._id}
                    className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm font-medium"
                  >
                    <span
                      onClick={() => {
                        setProjectName(project.title);
                        setRockSize(project.reports?.rockSize || "");
                        localStorage.setItem(
                          "currentProject",
                          JSON.stringify(project)
                        );
                        window.dispatchEvent(
                          new CustomEvent("customStorageChange", {
                            detail: {
                              key: "currentProject",
                              newValue: JSON.stringify(project),
                            },
                          })
                        );
                        setShowDropdown(false);
                      }}
                      className="flex-1"
                    >
                      {project.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project._id);
                      }}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </div>

          <div className="ml-0 sm:ml-4">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Static Content + Tabs (Left) */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:px-10 px-4 mt-2 mb-4 gap-4">
        {/* Left Side */}
        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">
            Project Sizing Estimation Tool
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-4">
            Streamline early-stage planning by collecting effort and size
            estimates from teams to assess project scope.
          </p>

          <div className="flex justify-between">
            <div className="hidden md:flex flex-wrap gap-2 md:gap-4">
              <TabButton
                icon={<MdOutlineDashboard />}
                label="Dashboard"
                isActive={activeTab === "dashboard"}
                onClick={() => setActiveTab("dashboard")}
              />
              <TabButton
                icon={<FaTasks />}
                label="Estimator"
                isActive={activeTab === "tasks"}
                onClick={() => setActiveTab("tasks")}
              />
              <TabButton
                icon={<HiOutlineDocumentReport />}
                label="Reports"
                isActive={activeTab === "reports"}
                onClick={() => setActiveTab("reports")}
              />
              <TabButton
                icon={<TfiWrite />}
                label="Summary"
                isActive={activeTab === "summary"}
                onClick={() => setActiveTab("summary")}
              />
              <TabButton
                icon={<FaPlus />}
                label="Create Project"
                isActive={false}
                onClick={handleCreateProject}
              />
            </div>
            <div>
              {rockSize && (
                  <div className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full text-sm font-medium text-blue-800 dark:text-blue-200">
                    Rock Size: {rockSize}
                  </div>
                )}
            </div>
          </div>

        </div>
      </div>

      {/* Dynamic Content */}
      <div className="w-full sm:px-4 rounded-2xl mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabButton({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 cursor-pointer ${
        isActive
          ? "bg-[#003399] text-white"
          : "bg-white dark:bg-gray-800 text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-base font-semibold">{label}</span>
    </button>
  );
}
