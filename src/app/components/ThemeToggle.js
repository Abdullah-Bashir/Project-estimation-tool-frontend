"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSunnyOutline } from "react-icons/io5";
import { BsMoonStars } from "react-icons/bs";

const ThemeToggle = () => {

    const [theme, setTheme] = useState('light');
    const [mounted, setMounted] = useState(false);


    useEffect(() => {
        setMounted(true);
        const initialTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        setTheme(initialTheme);
    }, []);


    useEffect(() => {
        if (mounted) {
            document.documentElement.classList.toggle("dark", theme === "dark");
            localStorage.setItem("theme", theme);
        }
    }, [theme, mounted]);


    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    if (!mounted) return (
        <div className="w-9 h-9" /> // Empty placeholder to prevent layout shift
    );

    return (
        <motion.button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors hover:bg-gray-200 dark:hover:bg-gray-500 border border-gray-300"
            aria-label="Toggle Theme"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <AnimatePresence mode="wait">
                <motion.span
                    key={theme}
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: 180, scale: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {theme === "light" ? (
                        <BsMoonStars className="text-md" />
                    ) : (
                        <IoSunnyOutline className="text-md" />
                    )}
                </motion.span>
            </AnimatePresence>
        </motion.button>
    );
};

export default ThemeToggle;