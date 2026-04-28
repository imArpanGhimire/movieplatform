import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { Search } from "lucide-react";

const MovieListingPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [allmovies, setallmovies] = useState([]);

  const [title, settitle] = useState("");
  const [director, setdirector] = useState("");

  const [debouncedTitle, setdebouncedTitle] = useState("");
  const [debouncedDirector, setdebouncedDirector] = useState("");

  const [hasRestored, setHasRestored] = useState(false);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  useEffect(() => {
    const savedTitle = sessionStorage.getItem("filmvault_title") || "";
    const savedDirector = sessionStorage.getItem("filmvault_director") || "";
    const savedMovies = sessionStorage.getItem("filmvault_movies");

    settitle(savedTitle);
    setdirector(savedDirector);
    setdebouncedTitle(savedTitle);
    setdebouncedDirector(savedDirector);

    if (savedMovies) {
      try {
        setallmovies(JSON.parse(savedMovies));
      } catch (e) {
        console.log(e);
        setallmovies([]);
      }
    }

    setHasRestored(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setdebouncedTitle(title.trim());
    }, 700);

    return () => clearTimeout(t);
  }, [title]);

  useEffect(() => {
    const t = setTimeout(() => {
      setdebouncedDirector(director.trim());
    }, 700);

    return () => clearTimeout(t);
  }, [director]);

  const searchquery = debouncedTitle || debouncedDirector;
  const hasSearch = debouncedTitle || debouncedDirector;

  useEffect(() => {
    if (!hasRestored) return;

    async function searchmovies() {
      if (!searchquery) {
        setallmovies([]);
        return;
      }

      try {
        setloading(true);
        seterror("");

        const res = debouncedDirector
          ? await api.get(
              `/tmdb/director?name=${encodeURIComponent(debouncedDirector)}`,
            )
          : await api.get(
              `/tmdb/search?query=${encodeURIComponent(debouncedTitle)}`,
            );

        setallmovies(res.data.movies || []);
      } catch (e) {
        console.log(e);
        seterror(e.response?.data?.message || "Failed to search movies");
        setallmovies([]);
      } finally {
        setloading(false);
      }
    }

    searchmovies();
  }, [debouncedTitle, debouncedDirector, hasRestored, searchquery]);

  useEffect(() => {
    if (!hasRestored) return;

    sessionStorage.setItem("filmvault_title", title);
    sessionStorage.setItem("filmvault_director", director);
    sessionStorage.setItem("filmvault_movies", JSON.stringify(allmovies));
  }, [title, director, allmovies, hasRestored]);

  useEffect(() => {
    async function fetchTopRated() {
      try {
        const res = await api.get("/tmdb/toprated");
        setTopRatedMovies(res.data.movies || []);
      } catch (e) {
        console.log(e);
      }
    }

    fetchTopRated();
  }, []);

  function clearall() {
    settitle("");
    setdirector("");
    setdebouncedTitle("");
    setdebouncedDirector("");
    setallmovies([]);

    sessionStorage.removeItem("filmvault_title");
    sessionStorage.removeItem("filmvault_director");
    sessionStorage.removeItem("filmvault_movies");
  }

  function renderTopRatedMovies() {
    if (topRatedMovies.length === 0) return null;

    return (
      <div className="relative px-6 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-500">
              Top Rated
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[var(--color-text-primary)]">
              Greatest Movies
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {topRatedMovies.map((movie) => (
              <div
                key={movie.tmdbId}
                onClick={() => navigate(`/movie/tmdb/${movie.tmdbId}`)}
                className="cursor-pointer"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: "var(--color-bg-base)",
        color: "var(--color-text-primary)",
      }}
    >
      {theme === "dark" && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute left-10 top-20 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute bottom-40 right-10 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400/5 blur-3xl" />
        </div>
      )}

      <div className="relative px-6 pb-20 pt-36 text-center">
        <div className="mx-auto max-w-3xl">
          <h1
            className="font-swash text-5xl font-black leading-tight tracking-tight md:text-7xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            Your Cinema,
            <br />
            <span className="text-teal-400">Rediscovered.</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Search millions of films, leave your reviews, and build your
            personal cinematic universe.
          </p>
        </div>
      </div>

      <div className="relative px-6 pb-16">
        <div className="mx-auto max-w-3xl">
          <div
            className="rounded-3xl p-6 shadow-2xl backdrop-blur-md"
            style={{
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative">
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Movie Title
                </label>

                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--color-text-muted)" }}
                  />

                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      settitle(e.target.value);

                      if (director) {
                        setdirector("");
                        setdebouncedDirector("");
                      }
                    }}
                    placeholder="e.g. Inception..."
                    className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all"
                    style={{
                      backgroundColor: "var(--color-bg-input)",
                      border: "1px solid var(--color-border-input)",
                      color: "var(--color-text-primary)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--color-brand)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--color-border-input)";
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Director
                </label>

                <input
                  type="text"
                  value={director}
                  onChange={(e) => {
                    setdirector(e.target.value);

                    if (title) {
                      settitle("");
                      setdebouncedTitle("");
                    }
                  }}
                  placeholder="e.g. Christopher Nolan..."
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={{
                    backgroundColor: "var(--color-bg-input)",
                    border: "1px solid var(--color-border-input)",
                    color: "var(--color-text-primary)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-brand)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border-input)";
                  }}
                />
              </div>
            </div>

            {(title || director) && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearall}
                  className="rounded-xl px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all"
                  style={{
                    backgroundColor: "var(--color-bg-input)",
                    border: "1px solid var(--color-border-input)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!hasSearch && renderTopRatedMovies()}

      <div className="mx-auto max-w-7xl px-6 pb-20">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-4 h-14 w-14">
              <div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: "var(--color-border)" }}
              />
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-r-cyan-500 border-t-teal-500" />
            </div>

            <p
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Searching...
            </p>
          </div>
        )}

        {error && (
          <div
            className="mx-auto max-w-md rounded-2xl p-5 text-center"
            style={{
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-error-border)",
            }}
          >
            <p style={{ color: "var(--color-error-text)" }}>{error}</p>
          </div>
        )}

        {!loading && !error && hasSearch && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-teal-500">
                  Search Results
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[var(--color-text-primary)]">
                  Movies Found
                </h2>
              </div>

              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <span
                  className="font-semibold"
                  style={{ color: "var(--color-brand)" }}
                >
                  {allmovies.length}
                </span>{" "}
                {allmovies.length === 1 ? "result" : "results"} found
              </p>
            </div>

            {allmovies.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {allmovies.map((movie, index) => (
                  <div
                    key={movie.tmdbId}
                    onClick={() => navigate(`/movie/tmdb/${movie.tmdbId}`)}
                    className="cursor-pointer animate-fadeInUp"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 text-5xl">🔍</div>

                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  No results found
                </h3>

                <p
                  className="mt-2 text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Try a different search term.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {hasSearch && renderTopRatedMovies()}
    </div>
  );
};

export default MovieListingPage;
