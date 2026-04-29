import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { sileo } from "sileo";
import ThemeToggleButton from "./ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";
import { Bookmark } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const [scrolled, setScrolled] = useState(false);

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header
      className={`fixed left-0 right-0 z-[50] px-4 transition-all duration-300 ${
        scrolled ? "top-2" : "top-4"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-3xl border px-5 py-3 backdrop-blur-xl transition-all duration-300 ${
          isDark
            ? "border-white/10 bg-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
            : "border-white/40 bg-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
        }`}
      >
        <button
          onClick={() => navigate("/movies")}
          className={`font-swash text-3xl font-black transition hover:opacity-80 ${
            isDark ? "text-teal-300" : "text-teal-500"
          }`}
        >
          FilmVault
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/saved")}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all hover:-translate-y-0.5 ${
              isDark
                ? "border-white/10 bg-white/10 text-teal-300 hover:bg-white/15"
                : "border-white/50 bg-white/60 text-teal-600 hover:bg-white"
            }`}
            title="Saved Movies"
          >
            <Bookmark size={19} />
          </button>

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full border ${
              isDark
                ? "border-white/10 bg-white/10"
                : "border-white/50 bg-white/60"
            }`}
          >
            <ThemeToggleButton />
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
