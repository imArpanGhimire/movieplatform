import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const MovieListingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [loading, setloading] = useState(true);
  const [error, seterror] = useState("");
  const [allmovies, setallmovies] = useState([]);
  const [genre, setgenre] = useState("all");
  const [director, setdirector] = useState("all");
  const [title, settitle] = useState("");
  const [debouncedTitle, setdebouncedTitle] = useState("all");
  const [debouncedDirector, setdebouncedDirector] = useState("all");

  useEffect(() => {
    const titletimer = setTimeout(() => {
      setdebouncedTitle(title.trim() === "" ? "all" : title);
    }, 350);
    return () => clearTimeout(titletimer);
  }, [title]);

  useEffect(() => {
    const directortimer = setTimeout(() => {
      setdebouncedDirector(director.trim() === "" ? "all" : director);
    }, 350);
    return () => clearTimeout(directortimer);
  }, [director]);

  useEffect(() => {
    async function getmovies() {
      try {
        setloading(true);
        seterror("");
        const res = await api.get(
          `/movie/getmovies/${genre}/${debouncedDirector}/${debouncedTitle}`,
        );
        setallmovies(res.data.movies || []);
      } catch (e) {
        console.log(e);
        seterror(e.response?.data?.message || "Failed to fetch movies");
        setallmovies([]);
      } finally {
        setloading(false);
      }
    }
    getmovies();
  }, [genre, debouncedDirector, debouncedTitle]);

  async function handlelogout() {
    try {
      await api.post("/auth/logout");
      navigate("/login");
    } catch (e) {
      console.log(e);
    }
  }

  function clearfilter() {
    setgenre("all");
    setdirector("all");
    settitle("");
  }

  return (
    <div
      className="min-h-screen relative overflow-x-hidden px-6 py-10"
      style={{
        backgroundColor: "var(--color-bg-base)",
        color: "var(--color-text-primary)",
      }}
    >
      {/* Background orbs — only visible in dark mode */}
      {theme === "dark" && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-teal-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-40 right-20 w-80 h-80 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
        </div>
      )}

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{
          backgroundColor: "var(--color-nav-bg)",
          borderBottom: "1px solid var(--color-nav-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1
            className="text-3xl font-black cursor-pointer font-swash"
            style={{ color: "var(--color-brand)" }}
            onClick={() => navigate("/movies")}
          >
            FilmVault
          </h1>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-secondary)",
              }}
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={handlelogout}
              className="px-6 py-2.5 font-semibold rounded-lg text-sm transition-all duration-300"
              style={{
                background: "linear-gradient(to right, #dc2626, #b91c1c)",
                color: "#fff",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background =
                  "linear-gradient(to right, #b91c1c, #991b1b)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background =
                  "linear-gradient(to right, #dc2626, #b91c1c)")
              }
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto pt-28 relative z-10">
        {/* Header */}
        <div className="mb-16 animate-fadeInDown">
          <p
            className="text-sm uppercase tracking-[0.25em] mb-3 font-swash"
            style={{ color: "var(--color-brand)" }}
          >
            Discover Films
          </p>
          <h1
            className="text-6xl font-black leading-tight mb-4 font-swash"
            style={{ color: "var(--color-text-primary)" }}
          >
            Cinematic Gems Await
          </h1>
          <p
            className="text-lg font-swash"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Explore a curated collection of films. Filter by genre, director, or
            title.
          </p>
        </div>

        {/* Search & Filter */}
        <div
          className="backdrop-blur-md rounded-2xl p-8 mb-12 shadow-2xl transition-all duration-300 animate-fadeInUp"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="group">
              <label
                className="block text-xs font-bold mb-3 uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Search Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => settitle(e.target.value)}
                placeholder="e.g., Inception..."
                className="w-full rounded-lg px-5 py-3.5 text-sm font-medium outline-none transition-all duration-300"
                style={{
                  backgroundColor: "var(--color-bg-input)",
                  border: "1px solid var(--color-border-input)",
                  color: "var(--color-text-primary)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-brand)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--color-border-input)")
                }
              />
            </div>

            <div className="group">
              <label
                className="block text-xs font-bold mb-3 uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setgenre(e.target.value)}
                className="w-full rounded-lg px-5 py-3.5 text-sm font-medium outline-none transition-all duration-300 cursor-pointer appearance-none"
                style={{
                  backgroundColor: "var(--color-bg-input)",
                  border: "1px solid var(--color-border-input)",
                  color: "var(--color-text-primary)",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a1a5ab' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="all">All Genres</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Crime">Crime</option>
                <option value="Thriller">Thriller</option>
                <option value="Drama">Drama</option>
              </select>
            </div>

            <div className="group">
              <label
                className="block text-xs font-bold mb-3 uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Director
              </label>
              <input
                value={director === "all" ? "" : director}
                onChange={(e) => setdirector(e.target.value || "all")}
                type="text"
                placeholder="e.g., Nolan..."
                className="w-full rounded-lg px-5 py-3.5 text-sm font-medium outline-none transition-all duration-300"
                style={{
                  backgroundColor: "var(--color-bg-input)",
                  border: "1px solid var(--color-border-input)",
                  color: "var(--color-text-primary)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-brand)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--color-border-input)")
                }
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={clearfilter}
                className="w-full px-6 py-3.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300"
                style={{
                  backgroundColor: "var(--color-bg-input)",
                  border: "1px solid var(--color-border-input)",
                  color: "var(--color-text-secondary)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-elevated)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-bg-input)")
                }
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-4">
              <div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: "var(--color-border)" }}
              />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-500 border-r-cyan-500 animate-spin" />
            </div>
            <p
              className="font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Loading films...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="rounded-2xl p-6 mb-8 animate-fadeInUp"
            style={{
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-error-border)",
            }}
          >
            <p
              className="font-medium"
              style={{ color: "var(--color-error-text)" }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <p style={{ color: "var(--color-text-secondary)" }}>
                <span
                  className="font-semibold"
                  style={{ color: "var(--color-brand)" }}
                >
                  {allmovies.length}
                </span>{" "}
                films found
              </p>
            </div>

            {allmovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                {allmovies.map((movie, index) => (
                  <div
                    key={movie._id}
                    onClick={() => navigate(`/movie/${movie._id}`)}
                    className="group cursor-pointer animate-fadeInUp"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className="relative overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                      style={{ border: "1px solid var(--color-border)" }}
                    >
                      <MovieCard movie={movie} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  No films found
                </h3>
                <p
                  className="mt-2 max-w-md"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  No movies match your current filters. Try changing the title,
                  genre, or director.
                </p>
                <button
                  onClick={clearfilter}
                  className="mt-5 rounded-xl px-5 py-2.5 text-sm font-medium transition-all"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Pagination placeholder */}
        {!loading && !error && allmovies.length > 0 && (
          <div className="flex justify-center items-center gap-3 mb-8 animate-fadeInUp">
            <p
              className="capitalize"
              style={{ color: "var(--color-text-muted)" }}
            >
              More features coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieListingPage;
