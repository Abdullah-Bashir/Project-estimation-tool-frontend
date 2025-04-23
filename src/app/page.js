"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MdOutlineDashboard } from "react-icons/md"
import { FaTasks } from "react-icons/fa"
import { HiOutlineDocumentReport, HiOutlinePencil } from "react-icons/hi"
import Dashboard from "@/app/components/Dashboard"
import Tasks from "@/app/components/Tasks"
import Reports from "@/app/components/Reports"
import ThemeToggle from "./components/ThemeToggle"
import MobileNavigation from "./components/MobileNavigation"

export default function Home() {

  const [activeTab, setActiveTab] = useState(null)
  const [loading, setLoading] = useState(true)
  const [projectName, setProjectName] = useState("Project Name")
  const [isEditing, setIsEditing] = useState(false)

  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    title: "",
    hours: 0,
    resources: 1,
    duration: 1,
    comment: "",
    department: "",
  })

  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab")
    const storedProjectName = localStorage.getItem("projectName")
    const storedTasks = localStorage.getItem("tasks")
    const storedNewTask = localStorage.getItem("newTask")

    if (storedTab) setActiveTab(storedTab)
    else setActiveTab("dashboard")

    if (storedProjectName) setProjectName(storedProjectName)
    if (storedTasks) setTasks(JSON.parse(storedTasks))
    if (storedNewTask) setNewTask(JSON.parse(storedNewTask))

    setLoading(false)
  }, [])

  useEffect(() => {
    if (activeTab) localStorage.setItem("activeTab", activeTab)
    if (projectName.trim() !== "") localStorage.setItem("projectName", projectName)
    localStorage.setItem("tasks", JSON.stringify(tasks))
    localStorage.setItem("newTask", JSON.stringify(newTask))
  }, [activeTab, projectName, tasks, newTask])

  const handleProjectNameChange = (e) => setProjectName(e.target.value)
  const handleEditClick = () => setIsEditing(true)
  const handleBlur = () => setIsEditing(false)
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleBlur()
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "tasks":
        return <Tasks tasks={tasks} setTasks={setTasks} newTask={newTask} setNewTask={setNewTask} />
      case "reports":
        return <Reports />
      default:
        return null
    }
  }

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
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
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
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white transition-all duration-300 relative px-2">

      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center md:mb-4 gap-4 py-2 md:px-8 px-4">

        <div className="flex items-center justify-between w-full">

          {/* Mobile Navigation */}
          <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Project Name */}
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex w-full sm:max-w-xl gap-2"
            >

              <input
                type="text"
                value={projectName}
                onChange={handleProjectNameChange}
                onBlur={handleBlur}
                onKeyPress={handleKeyPress}
                autoFocus
                className="w-full text-2xl sm:text-3xl font-bold bg-transparent border-b-2 border-indigo-500 focus:outline-none pb-1 dark:text-white placeholder-gray-400"
                placeholder="Enter Project Name"
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 cursor-text hover:bg-gray-100 dark:hover:bg-gray-800/50 px-2 py-2 rounded-lg transition-colors w-full sm:w-auto"
              onClick={handleEditClick}
            >

              <img
                src="/logo.png"
                alt="App Logo"
                style={{ height: "40px", width: "auto" }}
              />

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">{projectName}</h1>
              <button
                className="opacity-70 hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                onClick={handleEditClick}
              >
                <HiOutlinePencil className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

            </motion.div>
          )}

          <div className="ml-0 sm:ml-4">
            <ThemeToggle />
          </div>
        </div>

      </div>



      {/* Tabs - Row layout for desktop */}
      <div className="hidden md:flex w-full justify-start gap-4 mb-4 px-10">
        <TabButton
          icon={<MdOutlineDashboard />}
          label="Dashboard"
          isActive={activeTab === "dashboard"}
          onClick={() => setActiveTab("dashboard")}
        />
        <TabButton
          icon={<FaTasks />}
          label="Tasks"
          isActive={activeTab === "tasks"}
          onClick={() => setActiveTab("tasks")}
        />
        <TabButton
          icon={<HiOutlineDocumentReport />}
          label="Reports"
          isActive={activeTab === "reports"}
          onClick={() => setActiveTab("reports")}
        />
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
  )
}

function TabButton({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 cursor-pointer
        ${isActive
          ? "bg-[#003399] text-white"
          : "bg-white dark:bg-gray-800 text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 "
        }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-base font-semibold">{label}</span>
    </button>
  )
}
