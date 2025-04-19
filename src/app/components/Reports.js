"use client"

import { useEffect, useState } from "react"
import { FaFilePdf, FaFileExcel } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"

function Reports() {
    const [tasks, setTasks] = useState([])
    const [capability, setCapability] = useState("")
    const [pillar, setPillar] = useState("")
    const [methodology, setMethodology] = useState("")
    const [rockSize, setRockSize] = useState("")
    const [useCase, setUseCase] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]")
        const storedCapability = localStorage.getItem("capability") || ""
        const storedPillar = localStorage.getItem("pillar") || ""
        const storedMethodology = localStorage.getItem("methodology") || ""

        setTasks(storedTasks)
        setCapability(storedCapability)
        setPillar(storedPillar)
        setMethodology(storedMethodology)
    }, [])

    const calculateRockSize = () => {
        const totalHours = tasks.reduce((sum, task) => sum + Number(task.hours || 0), 0)

        if (totalHours < 400) setRockSize("Small Rock")
        else if (totalHours < 1500) setRockSize("Medium Rock")
        else if (totalHours < 5000) setRockSize("Big Rock")
        else setRockSize("Boulder")

        if (totalHours >= 4000) setUseCase("Org-wide rollouts, platform upgrades, AI/ML initiatives")
        else if (totalHours >= 2000) setUseCase("Department-level transformations, app modernization")
        else if (totalHours >= 800) setUseCase("System integrations, data cleanup/migration, process redesign")
        else setUseCase("New forms, small apps, workflow automations, pilot efforts")

        setIsModalOpen(true)
    }

    const handleCapabilityChange = (e) => {
        setCapability(e.target.value)
        localStorage.setItem("capability", e.target.value)
    }

    const handlePillarChange = (e) => {
        setPillar(e.target.value)
        localStorage.setItem("pillar", e.target.value)
    }

    const handleMethodologyChange = (e) => {
        setMethodology(e.target.value)
        localStorage.setItem("methodology", e.target.value)
    }

    return (
        <div className="min-h-screen p-4 flex justify-center transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-md w-full max-w-5xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-10 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Reports</h1>

                    <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
                        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-md font-medium text-sm sm:text-base flex-1 sm:flex-initial justify-center">
                            <FaFilePdf className="text-lg" />
                            Export PDF
                        </button>
                        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-md font-medium text-sm sm:text-base flex-1 sm:flex-initial justify-center">
                            <FaFileExcel className="text-lg" />
                            Export Excel
                        </button>
                    </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-8 sm:mb-12">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Executive Summary</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-left">
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase">Total Hours</div>
                            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                                {tasks.reduce((sum, task) => sum + Number(task.hours || 0), 0)}
                            </div>
                        </div>

                        <div className="text-left">
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase">Total Resources</div>
                            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                                {tasks.reduce((sum, task) => sum + Number(task.resources || 0), 0)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dropdowns */}
                <div className="mb-8 sm:mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <DropdownField
                        label="Select Capability *"
                        value={capability}
                        onChange={handleCapabilityChange}
                        options={["Build (New capabilities)", "Maintain (Keep lights on)", "Retire (Eliminate capabilities)"]}
                    />
                    <DropdownField
                        label="Select Pillar *"
                        value={pillar}
                        onChange={handlePillarChange}
                        options={[
                            "Innovation",
                            "Navigation of Healthcare Reform",
                            "Organizational & Staff",
                            "Participant Engagement",
                            "Strategic Growth",
                        ]}
                    />
                    <DropdownField
                        label="Select Methodology *"
                        value={methodology}
                        onChange={handleMethodologyChange}
                        options={["Predictive", "Agile", "Hybrid"]}
                    />
                </div>

                {/* Calculate Button */}
                <div className="text-center mb-5">
                    <button
                        className={`cursor-pointer px-4 sm:px-6 py-2 sm:py-3 rounded-md font-bold text-white text-sm sm:text-base ${capability && pillar && methodology ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
                        disabled={!capability || !pillar || !methodology}
                        onClick={calculateRockSize}
                    >
                        Calculate Rock Size
                    </button>
                </div>

                {/* Task Table */}
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">Tasks</h2>
                <div className="overflow-x-auto -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden border border-gray-300 dark:border-gray-700 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300"
                                        >
                                            Title
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300"
                                        >
                                            Department
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300"
                                        >
                                            Hours
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300"
                                        >
                                            Resources
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                    {tasks.map((task, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                            <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200 whitespace-normal break-words">
                                                {task.title}
                                            </td>
                                            <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200 whitespace-normal break-words">
                                                {task.department}
                                            </td>
                                            <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                                                {task.hours}
                                            </td>
                                            <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                                                {task.resources}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {tasks.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-8 text-sm sm:text-base">
                        No tasks available to report.
                    </div>
                )}
            </div>

            {/* Rock Size Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-md"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">Rock Size Calculated</h2>
                            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-2">
                                <strong>Predicted Size:</strong> {rockSize}
                            </p>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 italic">{useCase}</p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition text-sm sm:text-base"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function DropdownField({ label, value, onChange, options }) {
    return (
        <div className="flex flex-col text-left">
            <label className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-semibold mb-1">{label}</label>
            <select
                className="border border-gray-300 dark:border-gray-700 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none text-sm w-full"
                value={value}
                onChange={onChange}
            >
                <option value="">Select</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Reports
