import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { sileo } from "sileo";
import ThemeToggleButton from "./ThemeToggleButton";
import { Bookmark, LogOut, User, Sparkles, X, Check } from "lucide-react";

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

/* ── Genre Picker Modal ─────────────────────────────────── */
function GenreModal({ onClose, onConfirm }) {
  const [selected, setSelected] = useState([]);
  const overlayRef = useRef(null);

  // close on overlay click
  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  // close on Escape
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
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "fv-fade .2s ease",
      }}
    >
      <div
        style={{
          background: "var(--color-bg-page)",
          border: "1px solid var(--color-border)",
          borderRadius: 20,
          padding: "32px 28px 28px",
          width: "100%",
          maxWidth: 520,
          boxShadow: "0 32px 80px rgba(0,0,0,.5)",
          animation: "fv-up .25s ease",
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--color-brand)",
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--color-brand)",
                }}
              >
                Personalized For You
              </span>
            </div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--color-text-primary)",
                letterSpacing: "-.3px",
              }}
            >
              What do you like to watch?
            </h2>
            <p
              style={{
                marginTop: 4,
                fontSize: 12,
                color: "var(--color-text-muted)",
                lineHeight: 1.5,
              }}
            >
              Pick your favorite genres and we'll curate your personal feed.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 8,
              flexShrink: 0,
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-muted)",
              cursor: "pointer",
              transition: "all .15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "var(--color-bg-elevated)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "var(--color-bg-card)";
              e.currentTarget.style.color = "var(--color-text-muted)";
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* genre chips */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            margin: "20px 0 24px",
          }}
        >
          {GENRES.map((g) => {
            const active = selected.includes(g.id);
            return (
              <button
                key={g.id}
                onClick={() => toggle(g.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 13px",
                  borderRadius: 100,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all .15s",
                  background: active
                    ? "var(--color-brand)"
                    : "var(--color-bg-card)",
                  border: active
                    ? "1px solid var(--color-brand)"
                    : "1px solid var(--color-border)",
                  color: active ? "#09090b" : "var(--color-text-secondary)",
                  transform: active ? "scale(1.04)" : "scale(1)",
                }}
                onMouseOver={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor =
                      "var(--color-brand-border)";
                    e.currentTarget.style.color = "var(--color-text-primary)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.color = "var(--color-text-secondary)";
                  }
                }}
              >
                {active && <Check size={10} strokeWidth={3} />}
                {g.name}
              </button>
            );
          })}
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
            {selected.length === 0
              ? "Select at least one genre"
              : `${selected.length} genre${selected.length > 1 ? "s" : ""} selected`}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                background: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-secondary)",
                cursor: "pointer",
                transition: "all .15s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "var(--color-bg-elevated)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "var(--color-bg-card)")
              }
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selected.length === 0}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                background:
                  selected.length > 0
                    ? "var(--color-brand)"
                    : "var(--color-bg-elevated)",
                border: "1px solid transparent",
                color:
                  selected.length > 0 ? "#09090b" : "var(--color-text-muted)",
                cursor: selected.length > 0 ? "pointer" : "not-allowed",
                transition: "all .15s",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseOver={(e) => {
                if (selected.length > 0)
                  e.currentTarget.style.background = "var(--color-brand-hover)";
              }}
              onMouseOut={(e) => {
                if (selected.length > 0)
                  e.currentTarget.style.background = "var(--color-brand)";
              }}
            >
              <Sparkles size={12} />
              Show My Feed
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fv-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fv-up { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}

/* ── Navbar ─────────────────────────────────────────────── */
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [showGenreModal, setShowGenreModal] = useState(false);

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

  function handleGenreConfirm(genreIds) {
    // Save to localStorage so PersonalizedHome can read preferred genres
    localStorage.setItem("preferredGenres", JSON.stringify(genreIds));
    setShowGenreModal(false);
    navigate("/home");
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

  const isForYouActive = location.pathname === "/home";

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

            {/* For You button */}
            <button
              onClick={() => setShowGenreModal(true)}
              className="relative ml-1 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition"
              style={{
                color: isForYouActive
                  ? "var(--color-brand)"
                  : "var(--color-text-secondary)",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.color = "var(--color-brand)")
              }
              onMouseOut={(e) => {
                if (!isForYouActive)
                  e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
            >
              <Sparkles size={13} />
              For You
              {isForYouActive && (
                <span
                  className="absolute inset-x-3 -bottom-[18px] h-px"
                  style={{ background: "var(--color-brand)" }}
                />
              )}
            </button>
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

            {/* For You on mobile */}
            <button
              onClick={() => setShowGenreModal(true)}
              className="flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-[var(--color-bg-card)] md:hidden"
              style={{
                color: isForYouActive
                  ? "var(--color-brand)"
                  : "var(--color-text-secondary)",
              }}
              title="For You"
              aria-label="For You"
            >
              <Sparkles size={17} />
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

      {/* Genre picker modal */}
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
