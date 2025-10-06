"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        // Get saved theme or default to light
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-base-200 text-base-content hover:bg-base-300 hover:text-primary transition-colors duration-200"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
        </button>
    );
};

export default ThemeToggle;
