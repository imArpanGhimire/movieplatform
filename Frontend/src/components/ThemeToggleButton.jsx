import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={(e) => toggleTheme(e)}
      className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-2.5 text-[var(--color-text-primary)] shadow-md transition-all duration-200 hover:scale-105 hover:border-teal-500/30 hover:text-teal-500"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggleButton;
