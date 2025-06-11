"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Summary() {
  const [summary, setSummary] = useState("");
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    const storedProject = localStorage.getItem("currentProject");
    if (storedProject) {
      const project = JSON.parse(storedProject);
      setProjectData(project);
      setSummary(project.reports?.summary || "");
    }
  }, []);

  const projectName = typeof window !== "undefined" ? localStorage.getItem("projectName") : "";

  // Get the current project directly from localStorage
  const currentProject = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("currentProject")) : null;

  const tasks = currentProject?.reports?.tasks || [];
  const totalHours = currentProject?.reports?.totalHours || 0;
  const totalResources = currentProject?.reports?.totalResources || 0;

  const handleSummaryChange = (e) => {
    const newSummary = e.target.value;
    setSummary(newSummary);

    const storedProject = localStorage.getItem("currentProject");
    if (!storedProject) return;

    const project = JSON.parse(storedProject);
    if (!project.reports) project.reports = {};
    project.reports.summary = newSummary;

    localStorage.setItem("currentProject", JSON.stringify(project));
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      {/* Summary Cards - Similar to Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Resources
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalResources}
          </p>
        </motion.div>

        <motion.div
          className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Duration (MONTHS)
          </h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {totalHours}
          </p>
        </motion.div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Project Summary
        </label>
        <textarea
          value={summary}
          onChange={handleSummaryChange}
          placeholder="Write a detailed project summary..."
          rows={12}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
    </div>
  );
}