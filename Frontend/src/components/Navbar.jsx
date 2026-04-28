import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { sileo } from "sileo";
import ThemeToggleButton from "./ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  if (hideNavbar) return null;

  async function handleLogout() {
    try {
      await api.post("/auth/logout");

      sileo.success({
        title: "Logged out",
        description: "You have been logged out successfully",
        position: "top-center",
      });

      navigate("/login");
    } catch (e) {
      console.log(e);

      sileo.error({
        title: "Logout failed",
        description: e.response?.data?.message || "Something went wrong",
        position: "top-center",
      });
    }
  }

  return (
    <header className="fixed left-0 right-0 top-4 z-[999] px-4">
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-3xl border px-5 py-3 backdrop-blur-2xl ${
          isDark
            ? "border-white/10 bg-[#071015]/70 shadow-[0_18px_70px_rgba(0,0,0,0.45)]"
            : "border-white/70 bg-white/5 shadow-[0_18px_60px_rgba(15,23,42,0.12)]"
        }`}
      >
        <button
          onClick={() => navigate("/movies")}
          className={`font-swash text-3xl font-black transition hover:scale-[1.02] ${
            isDark ? "text-teal-300" : "text-teal-500"
          }`}
        >
          FilmVault
        </button>

        <div className="flex items-center gap-3">
          <div
            className={`rounded-2xl   p-1     ${
              isDark
                ? "border-white/10 bg-white/10"
                : "border-zinc-200/10 bg-white/10"
            }`}
          >
            <ThemeToggleButton />
          </div>

          <button
            onClick={handleLogout}
            className="rounded-2xl border border-red-200 bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-all hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-red-500/35 active:translate-y-0"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
