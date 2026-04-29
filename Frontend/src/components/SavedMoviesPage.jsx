import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import MovieCard from "./MovieCard";
import { useTheme } from "../context/ThemeContext";
import { Bookmark } from "lucide-react";

const SavedMoviesPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSavedMovies() {
      try {
        const res = await api.get("/saved");

        console.log("SAVED MOVIES 👉", res.data); // 🔥 ADD THIS

        setMovies(res.data.movies || []);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }

    fetchSavedMovies();
  }, []);

  return (
    <div
      className={`min-h-screen px-6 pb-20 pt-40 ${
        isDark ? "bg-[#030711] text-white" : "bg-[#f6f7f9] text-zinc-950"
      }`}
    >
      {isDark && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-20%] h-[650px] w-[650px] rounded-full bg-teal-500/20 blur-[130px]" />
          <div className="absolute right-[-15%] top-[10%] h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[140px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:70px_70px]" />
        </div>
      )}

      {!isDark && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-20%] h-[600px] w-[600px] rounded-full bg-teal-200/50 blur-[120px]" />
          <div className="absolute right-[-10%] top-[15%] h-[500px] w-[500px] rounded-full bg-cyan-100/60 blur-[120px]" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className={`text-sm font-bold uppercase tracking-[0.35em] ${
                isDark ? "text-teal-300" : "text-teal-600"
              }`}
            >
              Your List
            </p>

            <h1 className="mt-2 text-4xl font-black">Saved Movies</h1>
          </div>

          <p
            className={
              isDark ? "text-sm text-white/60" : "text-sm text-zinc-500"
            }
          >
            {movies.length} {movies.length === 1 ? "movie" : "movies"} saved
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className={`h-[330px] animate-pulse rounded-2xl ${
                  isDark ? "bg-white/10" : "bg-zinc-200"
                }`}
              />
            ))}
          </div>
        )}

        {!loading && movies.length === 0 && (
          <div
            className={`flex flex-col items-center justify-center rounded-3xl border p-12 text-center ${
              isDark
                ? "border-white/10 bg-white/5"
                : "border-zinc-200 bg-white/80"
            }`}
          >
            <div
              className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full ${
                isDark
                  ? "bg-white/10 text-teal-300"
                  : "bg-teal-50 text-teal-600"
              }`}
            >
              <Bookmark size={28} />
            </div>

            <h2 className="text-2xl font-bold">No saved movies yet</h2>

            <p className={isDark ? "mt-2 text-white/60" : "mt-2 text-zinc-500"}>
              Go to any movie detail page and save movies you like.
            </p>

            <button
              onClick={() => navigate("/movies")}
              className="mt-6 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              Explore Movies
            </button>
          </div>
        )}

        {!loading && movies.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
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
        )}
      </div>
    </div>
  );
};

export default SavedMoviesPage;
