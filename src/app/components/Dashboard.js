"use client";

import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const [isMobile, setIsMobile] = useState(false);

    // Watch screen size
    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const projectName = typeof window !== "undefined" ? localStorage.getItem("projectName") : "";

    // Get the current project directly from localStorage
    const currentProject = JSON.parse(localStorage.getItem("currentProject"));

    const tasks = currentProject?.reports?.tasks || [];
    const totalHours = currentProject?.reports?.totalHours || 0;
    const totalResources = currentProject?.reports?.totalResources || 0;

    const departmentHours = {};

    tasks.forEach((task) => {
        if (task.department) {
            departmentHours[task.department] = (departmentHours[task.department] || 0) + Number(task.hours || 0);
        }
    });

    const chartLabels = Object.keys(departmentHours);
    const chartData = Object.values(departmentHours);

    const generateColors = (count) => {
        const colors = [
            'rgba(99, 102, 241, 0.6)', 'rgba(16, 185, 129, 0.6)', 'rgba(239, 68, 68, 0.6)',
            'rgba(251, 191, 36, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(139, 92, 246, 0.6)',
            'rgba(244, 114, 182, 0.6)', 'rgba(20, 184, 166, 0.6)', 'rgba(234, 88, 12, 0.6)',
            'rgba(22, 163, 74, 0.6)'
        ];
        return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
    };

    const barChartData = {
        labels: chartLabels,
        datasets: [{
            label: "Hours",
            data: chartData,
            backgroundColor: "#003399",
            borderColor: "#003399",
            borderWidth: 1,
            borderRadius: 6,
        }],
    };

    const pieChartData = {
        labels: chartLabels,
        datasets: [{
            data: chartData,
            backgroundColor: generateColors(chartLabels.length),
            borderColor: "rgba(255, 255, 255, 0.8)",
            borderWidth: isMobile ? 1 : 2,
        }],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                bodyFont: { size: isMobile ? 10 : 12 },
                titleFont: { size: isMobile ? 12 : 14 },
            },
        },
        scales: {
            y: {
                ticks: {
                    color: "#9CA3AF",
                    font: { size: isMobile ? 10 : 12 },
                },
                grid: { color: "#374151" },
            },
            x: {
                ticks: {
                    color: "#9CA3AF",
                    font: { size: isMobile ? 10 : 12 },
                    maxRotation: isMobile ? 45 : 0,
                    autoSkip: true,
                    maxTicksLimit: isMobile ? 5 : 10,
                },
                grid: { color: "#374151" },
            },
        },
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: isMobile ? "bottom" : "right",
                labels: {
                    font: { size: isMobile ? 10 : 12 },
                    color: "#9CA3AF",
                    boxWidth: isMobile ? 12 : 16,
                    padding: isMobile ? 10 : 20,
                },
            },
            tooltip: {
                bodyFont: { size: isMobile ? 10 : 12 },
                titleFont: { size: isMobile ? 12 : 14 },
            },
        },
    };

    if (!currentProject) {
        return (
            <div className="h-screen flex justify-center items-center text-gray-500 dark:text-gray-300 text-lg">
                No project data found. Please select a project.
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col gap-4 md:gap-8 transition-colors duration-300 mt-4 px-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Dashboard
            </h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <SummaryCard title="Total Tasks" value={tasks.length} />
                <SummaryCard title="Total Duration" value={totalHours} />
                <SummaryCard title="Total Resources" value={totalResources} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-4 md:mt-6">
                <ChartCard title="Duration by Department (Bar)">
                    {chartLabels.length > 0 ? (
                        <div className="w-full h-64 md:h-80">
                            <Bar data={barChartData} options={barChartOptions} />
                        </div>
                    ) : (
                        <NoData />
                    )}
                </ChartCard>

                <ChartCard title="Duration by Department (Pie)">
                    {chartLabels.length > 0 ? (
                        <div className="w-full h-64 md:h-80">
                            <Pie data={pieChartData} options={pieChartOptions} />
                        </div>
                    ) : (
                        <NoData />
                    )}
                </ChartCard>
            </div>

            {/* Task Table */}
            <TaskTable tasks={tasks} />
        </div>
    );
}

function SummaryCard({ title, value }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg shadow text-left">
            <h2 className="text-xs md:text-sm uppercase text-black dark:text-gray-400 mb-1">{title}</h2>
            <p className="text-xl md:text-2xl font-bold text-[#00CCFF]">{value}</p>
        </div>
    );
}

function ChartCard({ title, children }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg shadow flex flex-col items-center">
            <h2 className="text-sm md:text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 md:mb-4">
                {title}
            </h2>
            {children}
        </div>
    );
}

function NoData() {
    return <p className="text-center text-gray-400 text-sm py-8">No data available</p>;
}

function TaskTable({ tasks }) {

    return (
        <div className="mt-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">Department Estimates</h2>
            <div className="overflow-x-auto -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border border-gray-300 dark:border-gray-700 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                            <thead className="bg-[#003399]">
                                <tr>
                                    <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-white">DELIVERABLE</th>
                                    <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-white">DEPARTMENT</th>
                                    <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-white">DURATION</th>
                                    <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm font-semibold text-white">RESOURCES</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800">
                                {tasks.map((task, index) => (
                                    <tr
                                        key={index}
                                        className={`transition hover:bg-gray-100 dark:hover:bg-gray-700 ${index % 2 !== 0 ? "bg-[#f0f8ff] dark:bg-gray-900" : ""}`}
                                    >
                                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200 break-words">{task.title}</td>
                                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200 break-words">{task.department}</td>
                                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200">{task.hours}</td>
                                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200">{task.resources}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {tasks.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8 text-sm sm:text-base">
                    No tasks available to show.
                </div>
            )}
        </div>
    );
}


