import { Link } from "react-router-dom";
import { Film } from "lucide-react";

const footerSections = [
  {
    title: "You",
    links: [
      { label: "Profile", path: "/profile" },
      { label: "Saved movies", path: "/saved" },
      { label: "Sign in", path: "/login" },
      { label: "Register", path: "/register" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Browse movies", path: "/movies" },
      { label: "For You", path: "/home" },
      { label: "Movie Battle", path: "/battle" },
    ],
  },
  {
    title: "Reviews",
    links: [
      { label: "Write a review", path: "/movies" },
      { label: "Your reviews", path: "/profile" },
      { label: "Saved movies", path: "/saved" },
    ],
  },
];

const bottomLinks = [
  { label: "Home", path: "/" },
  { label: "Movies", path: "/movies" },
  { label: "Battle", path: "/battle" },
];

const Footer = () => {
  return (
    <footer className="border-t border-[color:var(--color-border)] bg-[var(--color-bg-base)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link to="/" className="mb-4 flex w-fit items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-text-primary)] text-[var(--color-bg-base)]">
                <Film size={16} />
              </div>

              <span className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
                FilmVault
              </span>
            </Link>

            <p className="max-w-[220px] text-sm font-medium text-[var(--color-text-secondary)]">
              Your personal cinema vault.
            </p>

            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Rate, review, and discover films.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-primary)]">
                {section.title}
              </h3>

              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[color:var(--color-border)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} FilmVault. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {bottomLinks.map((link) => (
              <FooterLink key={link.label} link={link} small />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ link, small = false }) => {
  return (
    <Link
      to={link.path}
      className={`text-[var(--color-text-muted)] transition hover:text-[var(--color-text-primary)] ${
        small ? "text-xs" : "text-sm"
      }`}
    >
      {link.label}
    </Link>
  );
};

export default Footer;
