"use client";

import ThemeToggle from "@/app/components/ThemeToggle";
import { HiOutlineClipboardList } from "react-icons/hi"; // 🆕 new icon!

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/30 dark:bg-gray-900/50 backdrop-blur-md border-gray-300 dark:border-gray-700 shadow-sm transition-all border-b-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

                {/* Left side - Icon and Title */}
                <div className="flex items-center justify-center gap-2">
                    <HiOutlineClipboardList className="text-3xl text-blue-600 " />
                    <span className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-gray-100">
                        Project Estimation Tool
                    </span>
                </div>

                {/* Right side - Theme Toggle */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                </div>

            </div>
        </nav>
    );
}
