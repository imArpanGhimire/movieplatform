import { Moon, Sun } from "lucide-react";

import { useTheme } from "../context/ThemeContext";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-full p-2.5 text-[var(--color-text-primary)] shadow-md duration-200 hover:text-teal-500/90"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggleButton;
