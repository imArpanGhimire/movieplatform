import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { sileo } from "sileo";
import ThemeToggleButton from "./ThemeToggleButton";
import { Bookmark, LogOut, User } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
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

  const navItems = [
    { label: "Movies", path: "/movies" },
    { label: "Saved", path: "/saved" },
    { label: "Profile", path: "/profile" },
  ];

  const isActive = (path) =>
    path === "/movies"
      ? location.pathname === "/" || location.pathname.startsWith("/movies")
      : location.pathname.startsWith(path);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-[color:var(--color-border)] bg-[var(--color-bg-base)]/85 backdrop-blur-xl"
          : "border-transparent bg-[var(--color-bg-base)]/60 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Brand */}
        <button
          onClick={() => navigate("/movies")}
          className="flex items-center gap-2 transition hover:opacity-80"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-text-primary)] text-[var(--color-bg-base)]">
            <span className="text-sm font-bold">F</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
            FilmVault
          </span>
        </button>

        {/* Center nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative rounded-md px-3 py-1.5 text-sm font-medium transition ${
                isActive(item.path)
                  ? "text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {item.label}
              {isActive(item.path) && (
                <span className="absolute inset-x-3 -bottom-[18px] h-px bg-[var(--color-text-primary)]" />
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate("/saved")}
            className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)] md:hidden"
            title="Saved"
            aria-label="Saved"
          >
            <Bookmark size={17} />
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)] md:hidden"
            title="Profile"
            aria-label="Profile"
          >
            <User size={17} />
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)]">
            <ThemeToggleButton />
          </div>

          <div className="mx-1 hidden h-5 w-px bg-[color:var(--color-border)] md:block" />

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
