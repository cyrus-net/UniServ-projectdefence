import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    // Default to light mode
    return false;
  });

  useEffect(() => {
    // Update localStorage
    localStorage.setItem("theme", isDark ? "dark" : "light");
    // Update document class for Tailwind dark mode
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const token = localStorage.getItem("token");
    if (token) {
      await api.auth.updateTheme(newTheme ? "dark" : "light");
    }
  };
  const setTheme = (isDark: boolean) => setIsDark(isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
