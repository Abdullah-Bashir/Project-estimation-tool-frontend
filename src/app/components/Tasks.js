"use client";

import React from "react";
import LordIconScript from "../components/lordiconScript";
import EditTaskModal from "../popups/editTaskModal";

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
    ];

    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [taskBeingEdited, setTaskBeingEdited] = React.useState(null);

    const addTask = () => {
        if (newTask.title && newTask.department && newTask.comment) {
            const updatedTasks = [...tasks, newTask];
            setTasks(updatedTasks);
            setNewTask({ title: "", hours: null, resources: null, duration: null, comment: "", department: "" });
        }
    };

    const deleteTask = (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (confirmDelete) {
            const updatedTasks = [...tasks];
            updatedTasks.splice(index, 1);
            setTasks(updatedTasks);
        }
    };

    const handleEditTask = (index) => {
        setTaskBeingEdited({ ...tasks[index], index });
        setIsEditOpen(true);
    };

    const saveEditedTask = (updatedTask) => {
        const updatedTasks = [...tasks];
        updatedTasks[updatedTask.index] = {
            title: updatedTask.title,
            department: updatedTask.department,
            comment: updatedTask.comment,
            hours: updatedTask.hours,
            resources: updatedTask.resources,
            duration: updatedTask.duration,
        };
        setTasks(updatedTasks);
    };

    // New: Helper to ensure positive numbers only
    const handlePositiveNumberChange = (e, field) => {
        const value = Math.max(0, Number(e.target.value));
        setNewTask({ ...newTask, [field]: value });
    };

    return (
        <div className={`min-h-screen w-full p-6 ${isEditOpen ? "backdrop-blur-sm" : ""} transition-all duration-300`}>
            <LordIconScript />

            {/* Add Task Form */}
            <div className="mx-auto mb-6 md:mb-8">
                <div className="rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-6 hover:shadow-xl md:hover:shadow-2xl transition-all bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
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
                            value={newTask.hours}
                            onChange={(e) => handlePositiveNumberChange(e, "hours")}
                        />
                        <InputField
                            label="Resources"
                            type="number"
                            value={newTask.resources}
                            onChange={(e) => handlePositiveNumberChange(e, "resources")}
                        />
                        <InputField
                            label="Duration (days)"
                            type="number"
                            value={newTask.duration}
                            onChange={(e) => handlePositiveNumberChange(e, "duration")}
                        />
                    </div>

                    <button
                        onClick={addTask}
                        className="mt-4 md:mt-6 bg-[#003399] hover:bg-indigo-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Add Task
                    </button>
                </div>
            </div>

            {/* Responsive Tasks Table */}
            <div className="w-full mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        <table className="w-full min-w-[650px]">
                            <thead className="dark:bg-gray-700 bg-[#003399] text-white">
                                <tr className="text-left dark:text-gray-300 text-xs sm:text-sm uppercase font-semibold">
                                    <th className="px-4 sm:px-6 py-3 md:py-4 rounded-tl-xl">Project Name</th>
                                    <th className="px-4 sm:px-6 py-3 md:py-4">Department</th>
                                    <th className="px-4 sm:px-6 py-3 md:py-4">Hours</th>
                                    <th className="px-4 sm:px-6 py-3 md:py-4">Resources</th>
                                    <th className="px-4 sm:px-6 py-3 md:py-4">Comment</th>
                                    <th className="px-4 sm:px-6 py-3 md:py-4 rounded-tr-xl text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {tasks.map((task, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                        <td className="px-4 sm:px-6 py-3 md:py-4 font-medium text-gray-800 dark:text-gray-100 text-sm">
                                            {task.title}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 md:py-4 text-gray-600 dark:text-gray-300 text-sm">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200">
                                                {task.department}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 md:py-4 text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                                            {task.hours}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 md:py-4 text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                                            {task.resources}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 md:py-4 text-gray-600 dark:text-gray-300 text-sm max-w-[150px] md:max-w-[200px] truncate">
                                            {task.comment}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 md:py-4 flex justify-center items-center gap-2 md:gap-4">
                                            <button
                                                onClick={() => deleteTask(index)}
                                                className="cursor-pointer p-1.5 rounded-lg hover:bg-red-100/50 dark:hover:bg-red-900/30 transition-colors duration-200"
                                                aria-label="Delete task"
                                            >
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/hwjcdycb.json"
                                                    trigger="hover"
                                                    stroke="bold"
                                                    colors="primary:#ef4444,secondary:#fca5a5"
                                                    style={{ width: "22px", height: "22px" }}
                                                ></lord-icon>
                                            </button>
                                            <button
                                                onClick={() => handleEditTask(index)}
                                                className="cursor-pointer p-1.5 rounded-lg hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-colors duration-200"
                                                aria-label="Edit task"
                                            >
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/fikcyfpp.json"
                                                    trigger="hover"
                                                    stroke="bold"
                                                    colors="primary:#6366f1,secondary:#a5b4fc"
                                                    style={{ width: "22px", height: "22px" }}
                                                ></lord-icon>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {tasks.length === 0 && (
                            <div className="p-6 md:p-8 text-center text-gray-500 dark:text-gray-400">
                                <div className="flex flex-col items-center justify-center py-8">
                                    <lord-icon
                                        src="https://cdn.lordicon.com/msoeawqm.json"
                                        trigger="loop"
                                        colors="primary:#9ca3af,secondary:#d1d5db"
                                        style={{ width: "80px", height: "80px" }}
                                    ></lord-icon>
                                    <h3 className="mt-4 text-lg font-medium text-gray-500 dark:text-gray-400">No tasks added yet</h3>
                                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Start by adding a task above</p>
                                </div>
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
    );
}

// Enhanced InputField
function InputField({ label, type = "text", ...props }) {
    return (
        <div className="space-y-1 md:space-y-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">
                {label}
            </label>
            <input
                type={type}
                {...props}
                value={props.value ?? ""}
                min={type === "number" ? 0 : undefined} // <== New: prevent typing negatives
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md"
            />
        </div>
    );
}



// Enhanced SelectField Component
function SelectField({ label, value, onChange, options }) {
    const [isOpen, setIsOpen] = React.useState(false)
    const dropdownRef = React.useRef(null)

    // Close dropdown when clicking outside
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className="space-y-1 md:space-y-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">
                {label}
            </label>
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md flex justify-between items-center"
                >
                    <span className={value ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"}>
                        {value || `Select ${label}`}
                    </span>
                    <svg
                        className={`w-5 h-5 text-gray-400 dark:text-gray-300 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                        <ul className="py-1">
                            {options.map((option) => (
                                <li
                                    key={option}
                                    className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                                    onClick={() => {
                                        onChange({ target: { value: option } })
                                        setIsOpen(false)
                                    }}
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Hidden select for form submission */}
                <select value={value} onChange={onChange} className="sr-only" aria-hidden="true">
                    <option value="">{`Select ${label}`}</option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}
