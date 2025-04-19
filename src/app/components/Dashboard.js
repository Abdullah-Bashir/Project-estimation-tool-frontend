'use client';

import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [totalHours, setTotalHours] = useState(0);
    const [totalResources, setTotalResources] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check for mobile viewport
        const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        // Load tasks data
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        setTasks(storedTasks);

        const hours = storedTasks.reduce((sum, task) => sum + Number(task.hours || 0), 0);
        const resources = storedTasks.reduce((sum, task) => sum + Number(task.resources || 0), 0);

        setTotalHours(hours);
        setTotalResources(resources);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const departmentHours = {};
    tasks.forEach(task => {
        if (task.department) {
            departmentHours[task.department] = (departmentHours[task.department] || 0) + Number(task.hours || 0);
        }
    });

    const chartLabels = Object.keys(departmentHours);
    const chartData = Object.values(departmentHours);

    // Generate dynamic colors based on number of departments
    const generateColors = (count) => {
        const colors = [
            'rgba(99, 102, 241, 0.6)',  // indigo
            'rgba(16, 185, 129, 0.6)',  // emerald
            'rgba(239, 68, 68, 0.6)',   // red
            'rgba(251, 191, 36, 0.6)',  // amber
            'rgba(59, 130, 246, 0.6)',  // blue
            'rgba(139, 92, 246, 0.6)',  // violet
            'rgba(244, 114, 182, 0.6)', // pink
            'rgba(20, 184, 166, 0.6)',  // teal
            'rgba(234, 88, 12, 0.6)',   // orange
            'rgba(22, 163, 74, 0.6)'    // green
        ];
        return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
    };

    const barChartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Hours',
                data: chartData,
                backgroundColor: 'rgba(99, 102, 241, 0.7)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1,
            },
        ],
    };

    const pieChartData = {
        labels: chartLabels,
        datasets: [
            {
                data: chartData,
                backgroundColor: generateColors(chartLabels.length),
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: isMobile ? 1 : 2,
            },
        ],
    };

    // Chart options with responsive settings
    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                bodyFont: {
                    size: isMobile ? 10 : 12
                },
                titleFont: {
                    size: isMobile ? 12 : 14
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    color: '#9CA3AF',
                    font: { size: isMobile ? 10 : 12 }
                },
                grid: { color: '#374151' }
            },
            x: {
                ticks: {
                    color: '#9CA3AF',
                    font: { size: isMobile ? 10 : 12 },
                    maxRotation: isMobile ? 45 : 0,
                    autoSkip: true,
                    maxTicksLimit: isMobile ? 5 : 10
                },
                grid: { color: '#374151' }
            },
        }
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: isMobile ? 'bottom' : 'right',
                labels: {
                    font: { size: isMobile ? 10 : 12 },
                    color: '#9CA3AF',
                    boxWidth: isMobile ? 12 : 16,
                    padding: isMobile ? 10 : 20
                }
            },
            tooltip: {
                bodyFont: {
                    size: isMobile ? 10 : 12
                },
                titleFont: {
                    size: isMobile ? 12 : 14
                }
            }
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-6 flex flex-col gap-4 md:gap-8 transition-colors duration-300">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2 md:mb-4">
                Dashboard
            </h1>

            {/* Summary Cards - Stack on mobile, row on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg shadow text-center">
                    <h2 className="text-xs md:text-sm uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Total Tasks
                    </h2>
                    <p className="text-xl md:text-2xl font-bold text-indigo-600">
                        {tasks.length}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg shadow text-center">
                    <h2 className="text-xs md:text-sm uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Total Hours
                    </h2>
                    <p className="text-xl md:text-2xl font-bold text-green-600">
                        {totalHours}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg shadow text-center">
                    <h2 className="text-xs md:text-sm uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Total Resources
                    </h2>
                    <p className="text-xl md:text-2xl font-bold text-pink-600">
                        {totalResources}
                    </p>
                </div>
            </div>

            {/* Charts - Stack on mobile, side-by-side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-4 md:mt-6">
                {/* Bar Chart */}
                <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg shadow flex flex-col items-center">
                    <h2 className="text-sm md:text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 md:mb-4">
                        Hours by Department (Bar)
                    </h2>
                    {chartLabels.length > 0 ? (
                        <div className="w-full h-64 md:h-80">
                            <Bar
                                data={barChartData}
                                options={barChartOptions}
                            />
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 text-sm py-8">
                            No data available
                        </p>
                    )}
                </div>

                {/* Pie Chart */}
                <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg shadow flex flex-col items-center">
                    <h2 className="text-sm md:text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 md:mb-4">
                        Hours by Department (Pie)
                    </h2>
                    {chartLabels.length > 0 ? (
                        <div className="w-full h-64 md:h-80">
                            <Pie
                                data={pieChartData}
                                options={pieChartOptions}
                            />
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 text-sm py-8">
                            No data available
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}