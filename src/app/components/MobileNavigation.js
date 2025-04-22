"use client"

import { useState, useEffect, useRef } from "react"

export default function MobileNavigation({ activeTab, setActiveTab }) {
    const [isOpen, setIsOpen] = useState(false)
    const sidebarRef = useRef(null)
    const overlayRef = useRef(null)

    // Handle body scroll locking
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }

        return () => {
            document.body.style.overflow = "auto"
        }
    }, [isOpen])

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        setIsOpen(false)
    }

    // Sidebar style
    const sidebarStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: "250px",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        zIndex: 50,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform",
    }

    // Overlay style
    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 40,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    }

    return (
        <div className="block sm:hidden">
            {/* Hamburger Menu Button */}
            <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
                aria-label="Toggle navigation menu"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>

            {/* Sidebar Overlay */}
            <div
                ref={overlayRef}
                style={overlayStyle}
                onClick={toggleSidebar}
                className="transition-opacity duration-300 ease-in-out"
            />

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                style={sidebarStyle}
                className="transition-transform duration-300 ease-in-out"
            >
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "16px",
                            borderBottom: "1px solid var(--border)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <img
                                src="/logo.png"
                                alt="App Logo"
                                style={{ height: "28px", width: "auto" }}
                            />
                            <h2 style={{
                                fontWeight: 600,
                                fontSize: "15px",
                                margin: 0,
                                lineHeight: "1.2"
                            }}>
                                Project Estimation Tool
                            </h2>
                        </div>

                        <button
                            onClick={toggleSidebar}
                            style={{
                                padding: "8px",
                                borderRadius: "6px",
                                backgroundColor: "transparent",
                                cursor: "pointer",
                                border: "none",
                                outline: "none",
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <nav style={{ flex: 1, padding: "16px" }}>
                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <NavItem
                                label="Dashboard"
                                isActive={activeTab === "dashboard"}
                                onClick={() => handleTabChange("dashboard")}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                </svg>
                            </NavItem>

                            <NavItem
                                label="Tasks"
                                isActive={activeTab === "tasks"}
                                onClick={() => handleTabChange("tasks")}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9 11l3 3L22 4"></path>
                                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                                </svg>
                            </NavItem>

                            <NavItem
                                label="Reports"
                                isActive={activeTab === "reports"}
                                onClick={() => handleTabChange("reports")}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                                    <path d="M14 2v6h6"></path>
                                    <path d="M16 13H8"></path>
                                    <path d="M16 17H8"></path>
                                    <path d="M10 9H8"></path>
                                </svg>
                            </NavItem>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}

function NavItem({ children, label, isActive, onClick }) {
    const activeColor = "#4f46e5";
    const buttonStyle = {
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: "12px",
        padding: "8px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        border: "none",
        outline: "none",
        backgroundColor: isActive ? activeColor : "transparent",
        color: isActive ? "#ffffff" : "inherit",
        transition: "background-color 150ms ease-in-out, color 150ms ease-in-out",
    }

    return (
        <li>
            <button onClick={onClick} style={buttonStyle}>
                {children}
                <span>{label}</span>
            </button>
        </li>
    )
}