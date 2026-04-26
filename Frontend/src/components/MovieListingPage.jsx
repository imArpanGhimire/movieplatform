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

  useEffect(() => {
    const t = setTimeout(() => setdebouncedTitle(title.trim()), 400);
    return () => clearTimeout(t);
  }, [title]);

  useEffect(() => {
    const t = setTimeout(() => setdebouncedDirector(director.trim()), 400);
    return () => clearTimeout(t);
  }, [director]);

  const searchquery = debouncedTitle || debouncedDirector;

  useEffect(() => {
    async function searchmovies() {
      if (!searchquery) {
        setallmovies([]);
        return;
      }

      try {
        setloading(true);
        seterror("");

        const query = debouncedTitle || debouncedDirector;

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
  }, [debouncedTitle, debouncedDirector, searchquery]);

  function clearall() {
    settitle("");
    setdirector("");
    setallmovies([]);
  }

  const hasSearch = debouncedTitle || debouncedDirector;

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        backgroundColor: "var(--color-bg-base)",
        color: "var(--color-text-primary)",
      }}
    >
      {theme === "dark" && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full filter blur-3xl" />
          <div className="absolute bottom-40 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full filter blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-400/5 rounded-full filter blur-3xl" />
        </div>
      )}

      <div className="relative px-6 pt-32 pb-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-500/10 px-4 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">
              Powered by TMDB
            </span>
          </div>

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
                    onChange={(e) => settitle(e.target.value)}
                    placeholder="e.g. Inception..."
                    className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all"
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
                  onChange={(e) => setdirector(e.target.value)}
                  placeholder="e.g. Christopher Nolan..."
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
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

      <div className="mx-auto max-w-7xl px-6 pb-20">
        {!loading && !error && !hasSearch && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl text-3xl"
              style={{
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              🎬
            </div>

            <h3
              className="text-xl font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Start searching to discover films
            </h3>

            <p
              className="mt-2 max-w-sm text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Search by title or director to find your next favourite movie.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative h-14 w-14 mb-4">
              <div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: "var(--color-border)" }}
              />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-500 border-r-cyan-500 animate-spin" />
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
                <div className="text-5xl mb-4">🔍</div>

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
    </div>
  );
};

export default MovieListingPage;
