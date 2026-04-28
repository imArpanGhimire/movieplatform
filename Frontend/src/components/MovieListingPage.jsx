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

  const isDark = theme === "dark";

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
      <section className="relative z-10 px-6 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className={`text-sm font-bold uppercase tracking-[0.35em] ${
                  isDark ? "text-teal-300" : "text-teal-600"
                }`}
              >
                Top Rated
              </p>

              <h2
                className={`mt-2 text-3xl font-black ${
                  isDark ? "text-white" : "text-zinc-950"
                }`}
              >
                Greatest Movies
              </h2>
            </div>

            <p
              className={`max-w-md text-sm ${
                isDark ? "text-white/55" : "text-zinc-500"
              }`}
            >
              Carefully picked from top-rated cinema classics.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {topRatedMovies.map((movie) => (
              <div
                key={movie.tmdbId}
                onClick={() => navigate(`/movie/tmdb/${movie.tmdbId}`)}
                className={`cursor-pointer rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                  isDark
                    ? "border border-white/10 shadow-xl shadow-black/30 hover:border-teal-400/70 hover:shadow-teal-500/20"
                    : "border border-zinc-200 bg-white shadow-md shadow-zinc-200/70 hover:border-teal-400 hover:shadow-xl"
                }`}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${
        isDark ? "bg-[#030711] text-white" : "bg-[#f6f7f9] text-zinc-950"
      }`}
    >
      {isDark && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-20%] h-[650px] w-[650px] rounded-full bg-teal-500/20 blur-[130px]" />
          <div className="absolute right-[-15%] top-[10%] h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[140px]" />
          <div className="absolute bottom-[-25%] left-1/2 h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-teal-400/10 blur-[160px]" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:70px_70px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030711]/70 to-[#030711]" />
        </div>
      )}

      {!isDark && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-20%] h-[600px] w-[600px] rounded-full bg-teal-200/50 blur-[120px]" />
          <div className="absolute right-[-10%] top-[15%] h-[500px] w-[500px] rounded-full bg-cyan-100/60 blur-[120px]" />
        </div>
      )}

      <section className="relative z-10 px-6 pb-12 pt-32 text-center">
        <div className="mx-auto max-w-5xl">
          <div
            className={`mx-auto mb-6 inline-flex rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] ${
              isDark
                ? "border-teal-400/30 bg-teal-400/10 text-teal-200"
                : "border-teal-200 bg-white/80 text-teal-700 shadow-sm"
            }`}
          >
            FilmVault
          </div>

          <h1
            className={`font-swash text-5xl font-black leading-tight tracking-tight md:text-7xl ${
              isDark ? "text-white" : "text-zinc-950"
            }`}
          >
            Discover Films.
            <br />
            <span
              className={
                isDark
                  ? "text-teal-300 drop-shadow-[0_0_28px_rgba(45,212,191,0.45)]"
                  : "text-teal-500"
              }
            >
              Review What Matters.
            </span>
          </h1>

          <p
            className={`mx-auto mt-6 max-w-2xl text-base leading-relaxed md:text-lg ${
              isDark ? "text-white/65" : "text-zinc-600"
            }`}
          >
            Search movies by title or director, explore top-rated cinema, and
            build your own review collection.
          </p>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-14">
        <div className="mx-auto max-w-5xl">
          <div
            className={`rounded-[2rem] p-5 backdrop-blur-xl md:p-7 ${
              isDark
                ? "border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/40"
                : "border border-zinc-200 bg-white/85 shadow-2xl shadow-zinc-300/60"
            }`}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-teal-200" : "text-zinc-500"
                  }`}
                >
                  Movie Title
                </label>

                <div className="relative">
                  <Search
                    size={17}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                      isDark ? "text-teal-300" : "text-zinc-400"
                    }`}
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
                    className={`w-full rounded-2xl py-4 pl-11 pr-4 text-sm outline-none transition-all ${
                      isDark
                        ? "border border-white/10 bg-black/25 text-white placeholder:text-white/35 focus:border-teal-400 focus:shadow-lg focus:shadow-teal-500/10"
                        : "border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:border-teal-400 focus:bg-white focus:shadow-lg focus:shadow-teal-100"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-teal-200" : "text-zinc-500"
                  }`}
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
                  className={`w-full rounded-2xl px-4 py-4 text-sm outline-none transition-all ${
                    isDark
                      ? "border border-white/10 bg-black/25 text-white placeholder:text-white/35 focus:border-teal-400 focus:shadow-lg focus:shadow-teal-500/10"
                      : "border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:border-teal-400 focus:bg-white focus:shadow-lg focus:shadow-teal-100"
                  }`}
                />
              </div>
            </div>

            {(title || director) && (
              <div className="mt-5 flex justify-end">
                <button
                  onClick={clearall}
                  className={`rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                    isDark
                      ? "border border-white/10 bg-white/10 text-teal-100 hover:border-teal-400 hover:bg-teal-400/10"
                      : "border border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700"
                  }`}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {!hasSearch && renderTopRatedMovies()}

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-4 h-14 w-14">
              <div
                className={`absolute inset-0 rounded-full border-2 ${
                  isDark ? "border-white/15" : "border-zinc-200"
                }`}
              />
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-r-cyan-500 border-t-teal-500" />
            </div>

            <p
              className={
                isDark ? "text-sm text-white/60" : "text-sm text-zinc-500"
              }
            >
              Searching...
            </p>
          </div>
        )}

        {error && (
          <div
            className={`mx-auto max-w-md rounded-2xl p-5 text-center backdrop-blur-md ${
              isDark
                ? "border border-red-400/30 bg-red-950/30 text-red-200"
                : "border border-red-200 bg-red-50 text-red-600"
            }`}
          >
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && hasSearch && (
          <>
            <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p
                  className={`text-sm font-bold uppercase tracking-[0.35em] ${
                    isDark ? "text-teal-300" : "text-teal-600"
                  }`}
                >
                  Search Results
                </p>

                <h2
                  className={`mt-2 text-3xl font-black ${
                    isDark ? "text-white" : "text-zinc-950"
                  }`}
                >
                  Movies Found
                </h2>
              </div>

              <p
                className={
                  isDark ? "text-sm text-white/60" : "text-sm text-zinc-500"
                }
              >
                <span
                  className={
                    isDark
                      ? "font-bold text-teal-300"
                      : "font-bold text-teal-600"
                  }
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
                    className={`cursor-pointer animate-fadeInUp rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                      isDark
                        ? "border border-white/10 shadow-xl shadow-black/30 hover:border-teal-400/70 hover:shadow-teal-500/20"
                        : "border border-zinc-200 bg-white shadow-md shadow-zinc-200/70 hover:border-teal-400 hover:shadow-xl"
                    }`}
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
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-zinc-900"
                  }`}
                >
                  No results found
                </h3>

                <p
                  className={
                    isDark
                      ? "mt-2 text-sm text-white/60"
                      : "mt-2 text-sm text-zinc-500"
                  }
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
