import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "../utils/toast";
import ThemeToggleButton from "./ThemeToggleButton";
import {
  Bookmark,
  Check,
  Film,
  LogOut,
  Swords,
  Sparkles,
  User,
  X,
  Menu,
} from "lucide-react";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

function GenreModal({ onClose, onConfirm }) {
  const [selected, setSelected] = useState([]);
  const overlayRef = useRef(null);

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function toggle(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  }

  function handleConfirm() {
    if (selected.length === 0) return;
    onConfirm(selected);
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-6 backdrop-blur-md"
    >
      <div className="w-full max-w-[520px] rounded-3xl border border-[color:var(--color-border)] bg-[var(--color-bg-page)] p-7 shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
        <div className="mb-2 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--color-brand)]">
                Personalized For You
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              What do you like to watch?
            </h2>
            <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
              Pick your favorite genres and we'll curate your personal feed.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-muted)] transition hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
          >
            <X size={14} />
          </button>
        </div>

        <div className="my-6 flex flex-wrap gap-2">
          {GENRES.map((genre) => {
            const active = selected.includes(genre.id);
            return (
              <button
                key={genre.id}
                onClick={() => toggle(genre.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "scale-[1.04] border-[var(--color-brand)] bg-[var(--color-brand)] text-black"
                    : "border-[color:var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand-border)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {active && <Check size={10} strokeWidth={3} />}
                {genre.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-[var(--color-text-muted)]">
            {selected.length === 0
              ? "Select at least one genre"
              : `${selected.length} genre${selected.length > 1 ? "s" : ""} selected`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-elevated)]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selected.length === 0}
              className={`inline-flex items-center gap-1.5 rounded-lg px-5 py-2 text-xs font-bold transition ${
                selected.length > 0
                  ? "bg-[var(--color-brand)] text-black hover:bg-[var(--color-brand-hover)]"
                  : "cursor-not-allowed bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]"
              }`}
            >
              <Sparkles size={12} />
              Show My Feed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile drawer ────────────────────────────────────────────────────────────

function MobileDrawer({
  open,
  onClose,
  navItems,
  onNavClick,
  isActive,
  onLogout,
}) {
  const drawerRef = useRef(null);

  // Close on outside click
  function handleOverlayClick(e) {
    if (e.target === drawerRef.current) onClose();
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={drawerRef}
        onClick={handleOverlayClick}
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel — slides in from right */}
      <div
        className={`fixed right-0 top-0 z-[110] flex h-full w-72 flex-col bg-[var(--color-bg-base)] border-l border-[color:var(--color-border)] shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-[color:var(--color-border)] px-5">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            Menu
          </span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-muted)] transition hover:text-[var(--color-text-primary)]"
          >
            <X size={15} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            Navigate
          </p>
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const isSpecial = item.path === "/battle";

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavClick(item.path);
                    onClose();
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? isSpecial
                        ? "bg-[var(--color-brand)]/15 text-[var(--color-brand)]"
                        : "bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)]"
                  } ${isSpecial && !active ? "border border-[var(--color-brand)]/30 text-[var(--color-brand)]" : ""}`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      active
                        ? "bg-[var(--color-brand)]/20"
                        : "bg-[var(--color-bg-card)]"
                    }`}
                  >
                    <Icon size={15} />
                  </span>
                  {item.label}
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout at bottom */}
        <div className="border-t border-[color:var(--color-border)] p-4">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-red-500/10 hover:text-red-400"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-bg-card)]">
              <LogOut size={15} />
            </span>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  if (hideNavbar) return null;

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out", "You have been logged out successfully");
      navigate("/login");
    } catch (e) {
      console.log(e);
      toast.error("Logout failed", e.response?.data?.message);
    }
  }

  function handleGenreConfirm(genreIds) {
    localStorage.setItem("preferredGenres", JSON.stringify(genreIds));
    setShowGenreModal(false);
    navigate("/home");
  }

  const navItems = [
    { label: "Movies", path: "/movies", icon: Film },
    { label: "For You", path: "/home", icon: Sparkles },
    { label: "Saved", path: "/saved", icon: Bookmark },
    { label: "Battle", path: "/battle", icon: Swords },
    { label: "Profile", path: "/profile", icon: User },
  ];

  function handleNavClick(path) {
    if (path === "/home") {
      setShowGenreModal(true);
      return;
    }
    navigate(path);
  }

  function isActive(path) {
    if (path === "/movies") return location.pathname.startsWith("/movies");
    return location.pathname === path;
  }

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-[color:var(--color-border)] bg-[var(--color-bg-base)]/85 backdrop-blur-xl"
            : "border-transparent bg-[var(--color-bg-base)]/60 backdrop-blur-md"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
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

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const isSpecial = item.path === "/battle";

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "text-[var(--color-brand)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  } ${
                    isSpecial
                      ? active
                        ? "rounded-full border border-[var(--color-brand)] bg-[var(--color-brand)]/15 text-[var(--color-brand)]"
                        : "rounded-full border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10 text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-black"
                      : ""
                  }`}
                >
                  {(item.path === "/home" || item.path === "/battle") && (
                    <Icon size={13} />
                  )}
                  {item.label}
                  {active && !isSpecial && (
                    <span className="absolute inset-x-3 -bottom-[18px] h-px bg-[var(--color-brand)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop right side */}
          <div className="hidden items-center gap-1.5 md:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)]">
              <ThemeToggleButton />
            </div>
            <div className="mx-1 h-5 w-px bg-[color:var(--color-border)]" />
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>

          {/* Mobile right side — theme + hamburger only */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-card)]">
              <ThemeToggleButton />
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
              aria-label="Open menu"
            >
              <Menu size={17} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navItems={navItems}
        onNavClick={handleNavClick}
        isActive={isActive}
        onLogout={handleLogout}
      />

      {showGenreModal && (
        <GenreModal
          onClose={() => setShowGenreModal(false)}
          onConfirm={handleGenreConfirm}
        />
      )}
    </>
  );
};

export default Navbar;
