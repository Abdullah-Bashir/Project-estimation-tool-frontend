"use client";

import { useEffect, useState, useRef } from "react";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, AlertCircle } from "lucide-react";
import { generateExcel } from "../components/excelGenerator";



export default function Reports() {
    const [tasks, setTasks] = useState([]);
    const [capability, setCapability] = useState("");
    const [pillar, setPillar] = useState("");
    const [methodology, setMethodology] = useState("");
    const [rockSize, setRockSize] = useState("");
    const [useCase, setUseCase] = useState("");
    const [email, setEmail] = useState(""); // <-- NEW
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [missingFields, setMissingFields] = useState([]);

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        setTasks(storedTasks);
        setCapability(localStorage.getItem("capability") || "");
        setPillar(localStorage.getItem("pillar") || "");
        setMethodology(localStorage.getItem("methodology") || "");
        setEmail(localStorage.getItem("email") || ""); // <-- NEW
    }, []);

    const calculateRockSize = () => {
        const missing = [];
        if (!capability) missing.push("Capability");
        if (!pillar) missing.push("Pillar");
        if (!methodology) missing.push("Methodology");
        if (!email) missing.push("Email"); // <-- NEW

        if (missing.length > 0) {
            setMissingFields(missing);
            setIsValidationModalOpen(true);
            return;
        }

        const totalHours = tasks.reduce((sum, task) => sum + Number(task.hours || 0), 0);

        if (totalHours < 400) setRockSize("Small Rock");
        else if (totalHours < 1500) setRockSize("Medium Rock");
        else if (totalHours < 5000) setRockSize("Big Rock");
        else setRockSize("Boulder");

        if (totalHours >= 4000) setUseCase("Org-wide rollouts, platform upgrades, AI/ML initiatives");
        else if (totalHours >= 2000) setUseCase("Department-level transformations, app modernization");
        else if (totalHours >= 800) setUseCase("System integrations, data cleanup/migration, process redesign");
        else setUseCase("New forms, small apps, workflow automations, pilot efforts");

        setIsModalOpen(true);
    };

    const handleCapabilityChange = (value) => {
        setCapability(value);
        localStorage.setItem("capability", value);
    };

    const handlePillarChange = (value) => {
        setPillar(value);
        localStorage.setItem("pillar", value);
    };

    const handleMethodologyChange = (value) => {
        setMethodology(value);
        localStorage.setItem("methodology", value);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        localStorage.setItem("email", value);
    };

    // Add these above your main component
    const calculateTotalHours = (tasks) =>
        tasks.reduce((sum, task) => sum + Number(task.hours || 0), 0);

    const calculateTotalResources = (tasks) =>
        tasks.reduce((sum, task) => sum + Number(task.resources || 0), 0);

    return (
        <div className="min-h-screen p-4 flex justify-center transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-md w-full mx-2">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-10 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Reports</h1>
                    <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
                        <button
                            className="flex items-center gap-2 bg-[#003399] hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-md font-medium text-sm sm:text-base"
                            onClick={async () => {
                                const { generatePdf } = await import("../components/pdfGenerator");
                                generatePdf(tasks, rockSize, useCase);
                            }}
                        >
                            <FaFilePdf className="text-lg" /> Export PDF
                        </button>


                        <button
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-md font-medium text-sm sm:text-base"
                            onClick={() => generateExcel(tasks, rockSize, useCase)}
                        >
                            <FaFileExcel className="text-lg" /> Export Excel
                        </button>

                    </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-8 sm:mb-12">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Executive Summary</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <SummaryCard label="Total Hours" value={tasks.reduce((sum, task) => sum + Number(task.hours || 0), 0)} />
                        <SummaryCard label="Total Resources" value={tasks.reduce((sum, task) => sum + Number(task.resources || 0), 0)} />
                    </div>
                </div>

                {/* Enhanced Dropdowns + Email */}
                <div className="mb-8 sm:mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <EnhancedDropdownField
                        label="Select Capability *"
                        value={capability}
                        onChange={handleCapabilityChange}
                        options={["Build (New capabilities)", "Maintain (Keep lights on)", "Retire (Eliminate capabilities)"]}
                    />
                    <EnhancedDropdownField
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
                    <EnhancedDropdownField
                        label="Select Methodology *"
                        value={methodology}
                        onChange={handleMethodologyChange}
                        options={["Predictive", "Agile", "Hybrid"]}
                    />
                </div>

                {/* Email Input */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enter Email Address *
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-md border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                </div>

                {/* Calculate Button */}
                <div className="text-center mb-5">
                    <motion.button
                        className="cursor-pointer px-6 py-3 rounded-md font-bold text-white text-sm sm:text-base bg-[#003399] hover:bg-indigo-700"
                        onClick={calculateRockSize}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Calculate Rock Size
                    </motion.button>
                </div>

                {/* Tasks Table */}
                <TaskTable tasks={tasks} />

                {/* Rock Size Modal */}
                <RockSizeModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    rockSize={rockSize}
                    useCase={useCase}
                    tasks={tasks}
                />

                {/* Validation Modal */}
                <ValidationModal
                    isOpen={isValidationModalOpen}
                    onClose={() => setIsValidationModalOpen(false)}
                    missingFields={missingFields}
                />
            </div>
        </div>
    );
}



function SummaryCard({ label, value }) {
    return (
        <div className="text-left">
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase">{label}</div>
            <div className="text-2xl md:text-3xl font-bold text-[#00CCFF] dark:text-white">{value}</div>
        </div>
    )
}

function TaskTable({ tasks }) {
    return (
        <div className="mt-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">Tasks</h2>
            <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full border border-gray-300 dark:border-gray-700">
                    <thead className="bg-[#003399] text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">TITLE</th>
                            <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">DEPARTMENT</th>
                            <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">HOURS</th>
                            <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">RESOURCES</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                        {tasks.map((task, index) => (
                            <tr
                                key={index}
                                className={`transition hover:bg-gray-100 dark:hover:bg-gray-700 ${index % 2 !== 0 ? "bg-[#f0f8ff] dark:bg-gray-900" : ""}`}
                            >
                                <td className="px-4 py-3 text-xs sm:text-sm text-gray-800 dark:text-gray-200">{task.title}</td>
                                <td className="px-4 py-3 text-xs sm:text-sm text-gray-800 dark:text-gray-200">{task.department}</td>
                                <td className="px-4 py-3 text-xs sm:text-sm text-gray-800 dark:text-gray-200">{task.hours}</td>
                                <td className="px-4 py-3 text-xs sm:text-sm text-gray-800 dark:text-gray-200">{task.resources}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {tasks.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-8 text-sm sm:text-base">
                        No tasks available to report.
                    </div>
                )}
            </div>
        </div>
    )
}

function RockSizeModal({ isModalOpen, setIsModalOpen, rockSize, useCase, tasks }) {
    const details = [
        { label: "Predicted Size", value: rockSize },
        { label: "Use Case", value: useCase },
        { label: "Resources", value: tasks.reduce((sum, task) => sum + Number(task.resources || 0), 0) },
        { label: "Hours", value: tasks.reduce((sum, task) => sum + Number(task.hours || 0), 0) },
    ]

    return (
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
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-0 w-full max-w-xl"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-[#003399] px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Collaborative Rock Estimator Size</h2>
                            <motion.button
                                whileHover={{ rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 rounded-full hover:bg-blue-900/20 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </motion.button>
                        </div>

                        <div className="p-6">
                            <div className="space-y-6">
                                {details.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`grid grid-cols-3 ${index % 2 !== 0 ? "bg-[#f0f8ff] dark:bg-gray-900" : ""}`}
                                    >
                                        <div className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300 border-r dark:border-gray-700">
                                            {item.label}
                                        </div>
                                        <div className="p-3 col-span-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            {item.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-sm font-medium rounded-lg bg-[#003399] text-white hover:bg-indigo-700 transition-all"
                                >
                                    Close
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

function ValidationModal({ isOpen, onClose, missingFields }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-0 w-full max-w-md"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-red-500 px-6 py-4 rounded-t-xl flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-white" />
                                <h2 className="text-xl font-bold text-white">Missing Information</h2>
                            </div>
                            <motion.button
                                whileHover={{ rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-1.5 rounded-full hover:bg-red-400/20 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </motion.button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-gray-700 dark:text-gray-300 mb-3">
                                    Please fill in the following required fields before calculating the rock size:
                                </p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {missingFields.map((field, index) => (
                                        <li key={index} className="text-red-600 dark:text-red-400">
                                            {field}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="px-5 py-2.5 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
                                >
                                    Got it
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

function EnhancedDropdownField({ label, value, onChange, options }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="flex flex-col text-left">
            <label className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-semibold mb-1">{label}</label>
            <div className="relative" ref={dropdownRef}>
                <motion.button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none flex justify-between items-center text-sm"
                    whileHover={{ borderColor: "#818cf8" }}
                >
                    <span className={value ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"}>
                        {value || `Select ${label.replace(" *", "")}`}
                    </span>
                    <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                    </motion.div>
                </motion.button>

                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.ul
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        >
                            {options.map((opt, i) => (
                                <motion.li
                                    key={i}
                                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                                    onClick={() => {
                                        onChange(opt)
                                        setIsDropdownOpen(false)
                                    }}
                                    whileHover={{ backgroundColor: "#eef2ff", x: 2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {opt}
                                </motion.li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
