import React from "react";
import { useNavigate } from "react-router-dom";
import { Film } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-[color:var(--color-border)] bg-[var(--color-bg-base)]">
      {/* Main footer grid */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-text-primary)] text-[var(--color-bg-base)]">
                <Film size={16} />
              </div>
              <span className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
                FilmVault
              </span>
            </div>
            <p className="max-w-[220px] text-sm font-medium text-[var(--color-text-secondary)]">
              Your personal cinema vault.
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Rate, review, and discover films.
            </p>
          </div>

          {/* You */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-primary)]">
              You
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Profile", path: "/profile" },
                { label: "Saved movies", path: "/saved" },
                { label: "Sign in", path: "/login" },
                { label: "Register", path: "/register" },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-[var(--color-text-muted)] transition hover:text-[var(--color-text-primary)]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-primary)]">
              Discover
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Browse movies", path: "/movies" },
                { label: "Top rated", path: "/movies" },
                { label: "Search by director", path: "/movies" },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-[var(--color-text-muted)] transition hover:text-[var(--color-text-primary)]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Reviews */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-primary)]">
              Reviews
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Write a review", path: "/movies" },
                { label: "Your reviews", path: "/profile" },
                { label: "Liked movies", path: "/profile" },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-[var(--color-text-muted)] transition hover:text-[var(--color-text-primary)]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[color:var(--color-border)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} FilmVault. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {["Terms", "Privacy Policy"].map((item) => (
              <button
                key={item}
                className="text-xs text-[var(--color-text-muted)] transition hover:text-[var(--color-text-primary)]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
