"use client"

import React from "react"
import LordIconScript from "../components/lordiconScript"
import EditTaskModal from "../popups/editTaskModal"

export default function Tasks({ tasks, setTasks, newTask, setNewTask }) {
    const departmentOptions = [
        "Claims",
        "Finance / Underwriting",
        "Healthcare Delivery",
        "Hospitality Rx",
        "HRT",
        "Human Resources",
        "Informatics",
        "Information Technology",
        "Legal",
        "LV: Advocacy/Comms",
        "LV: Hospitality",
        "LV: Network",
        "LV: NHS",
        "Medical Management",
        "New Membership / HIPAA",
        "Office Services",
        "Operations",
        "PMO",
    ]

    const [isEditOpen, setIsEditOpen] = React.useState(false)
    const [taskBeingEdited, setTaskBeingEdited] = React.useState(null)

    const addTask = () => {
        if (newTask.title && newTask.department && newTask.comment) {
            const updatedTasks = [...tasks, newTask]
            setTasks(updatedTasks)
            setNewTask({ title: "", hours: 0, resources: 1, duration: 1, comment: "", department: "" })
        }
    }

    const deleteTask = (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?")
        if (confirmDelete) {
            const updatedTasks = [...tasks]
            updatedTasks.splice(index, 1)
            setTasks(updatedTasks)
        }
    }

    const handleEditTask = (index) => {
        setTaskBeingEdited({ ...tasks[index], index })
        setIsEditOpen(true)
    }

    const saveEditedTask = (updatedTask) => {
        const updatedTasks = [...tasks]
        updatedTasks[updatedTask.index] = {
            title: updatedTask.title,
            department: updatedTask.department,
            comment: updatedTask.comment,
            hours: updatedTask.hours,
            resources: updatedTask.resources,
            duration: updatedTask.duration,
        }
        setTasks(updatedTasks)
    }

    return (
        <div
            className={`min-h-screen w-full p-4 sm:p-6 md:p-8 ${isEditOpen ? "backdrop-blur-sm" : ""} transition-all duration-300`}
        >
            {/* Lord Icon Loader */}
            <LordIconScript />

            {/* Add Task Form */}
            <div className="mx-auto mb-6 md:mb-8">
                <div className="rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-6 hover:shadow-xl md:hover:shadow-2xl transition-all bg-white dark:bg-gray-800">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">Add New Task</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        <InputField
                            label="Task Title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            placeholder="Enter task title"
                        />
                        <SelectField
                            label="Department"
                            value={newTask.department}
                            onChange={(e) => setNewTask({ ...newTask, department: e.target.value })}
                            options={departmentOptions}
                        />
                        <InputField
                            label="Comment"
                            value={newTask.comment}
                            onChange={(e) => setNewTask({ ...newTask, comment: e.target.value })}
                            placeholder="Enter your comment"
                        />
                        <InputField
                            label="Hours"
                            type="number"
                            min="0"
                            value={newTask.hours}
                            onChange={(e) => setNewTask({ ...newTask, hours: +e.target.value })}
                        />
                        <InputField
                            label="Resources"
                            type="number"
                            min="1"
                            value={newTask.resources}
                            onChange={(e) => setNewTask({ ...newTask, resources: +e.target.value })}
                        />
                        <InputField
                            label="Duration (days)"
                            type="number"
                            min="1"
                            value={newTask.duration}
                            onChange={(e) => setNewTask({ ...newTask, duration: +e.target.value })}
                        />
                    </div>

                    <button
                        onClick={addTask}
                        className="mt-4 md:mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium transition-all hover:scale-105 w-full sm:w-auto"
                    >
                        + Add Task
                    </button>
                </div>
            </div>

            {/* Responsive Tasks Table */}
            <div className="w-full mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl overflow-hidden">
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        <table className="w-full min-w-[650px]">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr className="text-left text-gray-700 dark:text-gray-300 text-xs sm:text-sm uppercase font-semibold">
                                    <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4">Project Name</th>
                                    <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4">Department</th>
                                    <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4">Hours</th>
                                    <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4">Resources</th>
                                    <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4">Comment</th>
                                    <th className="px-3 sm:px-4 md:px-6 py-3 md:py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {tasks.map((task, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                        <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 font-medium text-gray-800 dark:text-gray-100 text-sm">
                                            {task.title}
                                        </td>
                                        <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 text-gray-600 dark:text-gray-300 text-sm">
                                            {task.department}
                                        </td>
                                        <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 text-indigo-600 font-medium text-sm">
                                            {task.hours}
                                        </td>
                                        <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 text-indigo-600 font-medium text-sm">
                                            {task.resources}
                                        </td>
                                        <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 text-gray-600 dark:text-gray-300 text-sm max-w-[150px] md:max-w-[200px] truncate">
                                            {task.comment}
                                        </td>
                                        <td className="px-3 sm:px-4 md:px-6 py-3 md:py-4 flex justify-center items-center gap-2 md:gap-4">
                                            <button onClick={() => deleteTask(index)} className="cursor-pointer">
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/hwjcdycb.json"
                                                    trigger="hover"
                                                    stroke="bold"
                                                    colors="primary:#6366f1,secondary:#a5b4fc"
                                                    style={{ width: "24px", height: "24px" }}
                                                ></lord-icon>
                                            </button>
                                            <button onClick={() => handleEditTask(index)} className="cursor-pointer">
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/fikcyfpp.json"
                                                    trigger="hover"
                                                    stroke="bold"
                                                    colors="primary:#6366f1,secondary:#a5b4fc"
                                                    style={{ width: "24px", height: "24px" }}
                                                ></lord-icon>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {tasks.length === 0 && (
                            <div className="p-6 md:p-8 text-center text-gray-500 dark:text-gray-400">
                                No tasks added yet. Start by adding a task above.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditOpen && (
                <EditTaskModal task={taskBeingEdited} onClose={() => setIsEditOpen(false)} onSave={saveEditedTask} />
            )}
        </div>
    )
}

// 🔥 Reusable InputField
function InputField({ label, ...props }) {
    return (
        <div className="space-y-1 md:space-y-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">{label}</label>
            <input
                {...props}
                className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 hover:border-indigo-400 hover:shadow-md transition-all duration-300"
            />
        </div>
    )
}

// 🔥 Reusable SelectField
function SelectField({ label, value, onChange, options }) {
    return (
        <div className="space-y-1 md:space-y-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">{label}</label>
            <select
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 hover:border-indigo-400 hover:shadow-md transition-all duration-300 appearance-none"
            >
                <option value="">Select {label}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}
