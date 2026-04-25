import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { sileo } from "sileo";
import ThemeToggleButton from "./ThemeToggleButton";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
    <header className="sticky top-0 z-[999] border-b border-[color:var(--color-border)] bg-[var(--color-nav-bg)] backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          onClick={() => navigate("/movies")}
          className="font-swash text-3xl font-bold text-teal-500 transition hover:opacity-90"
        >
          FilmVault
        </button>

        <div className="flex items-center gap-3">
          <ThemeToggleButton />

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500 px-5 py-2.5 font-medium text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
