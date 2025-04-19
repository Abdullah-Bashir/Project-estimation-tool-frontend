"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModalRoot from "./modalRoot";
import { X } from "lucide-react";

const departmentOptions = [
    "Claims", "Finance / Underwriting", "Healthcare Delivery", "Hospitality Rx", "HRT",
    "Human Resources", "Informatics", "Information Technology", "Legal", "LV: Advocacy/Comms",
    "LV: Hospitality", "LV: Network", "LV: NHS", "Medical Management", "New Membership / HIPAA",
    "Office Services", "Operations", "PMO"
];

export default function EditTaskModal({ task, onClose, onSave }) {
    const [updatedTask, setUpdatedTask] = useState(task);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(true);
        document.body.classList.add("overflow-hidden");
        return () => {
            document.body.classList.remove("overflow-hidden");
            setIsOpen(false);
        };
    }, []);

    if (!task) return null;

    const handleSave = () => {
        onSave(updatedTask);
        onClose();
    };

    return (
        <ModalRoot>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-[9999] px-4">
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                        />

                        {/* Modal Content */}
                        <motion.div
                            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300,
                            }}
                        >
                            <div className="flex justify-between items-center mb-5">
                                <motion.h2
                                    className="text-2xl font-bold text-gray-800 dark:text-white"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    Edit Task
                                </motion.h2>
                                <motion.button
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Close modal"
                                >
                                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </motion.button>
                            </div>

                            <motion.div
                                className="space-y-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <InputField
                                    label="Title"
                                    value={updatedTask.title}
                                    onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
                                />

                                {/* Department Dropdown */}
                                <SelectField
                                    label="Department"
                                    value={updatedTask.department}
                                    options={departmentOptions}
                                    onChange={(e) => setUpdatedTask({ ...updatedTask, department: e.target.value })}
                                />

                                <InputField
                                    label="Comment"
                                    value={updatedTask.comment}
                                    onChange={(e) => setUpdatedTask({ ...updatedTask, comment: e.target.value })}
                                />

                                <div className="grid grid-cols-3 gap-4">
                                    <InputField
                                        label="Hours"
                                        type="number"
                                        value={updatedTask.hours}
                                        onChange={(e) => setUpdatedTask({ ...updatedTask, hours: +e.target.value })}
                                    />
                                    <InputField
                                        label="Resources"
                                        type="number"
                                        value={updatedTask.resources}
                                        onChange={(e) => setUpdatedTask({ ...updatedTask, resources: +e.target.value })}
                                    />
                                    <InputField
                                        label="Duration"
                                        type="number"
                                        value={updatedTask.duration}
                                        onChange={(e) => setUpdatedTask({ ...updatedTask, duration: +e.target.value })}
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                className="flex justify-end gap-3 mt-6"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="px-5 py-2.5 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md hover:from-indigo-600 hover:to-indigo-700 transition-all"
                                >
                                    Save Changes
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ModalRoot>
    )
}

// 🔥 Reusable Input Field
const InputField = ({ label, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</label>
        <input
            {...props}
            className="px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500"
        />
    </div>
)

// 🔥 Reusable Select Field
const SelectField = ({ label, options, value, onChange }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500"
        >
            <option value="">Select {label}</option>
            {options.map((option, idx) => (
                <option key={idx} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
)
