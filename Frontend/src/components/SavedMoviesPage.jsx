import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import MovieCard from "./MovieCard";
import { Bookmark, Sparkles } from "lucide-react";

const SavedMoviesPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSavedMovies() {
      try {
        const res = await api.get("/saved");
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
    <div className="relative min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      {/* Ambience */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-teal-500/[0.04] blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-[400px] w-[400px] rounded-full bg-teal-500/[0.03] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-28">
        {/* Page header */}
        <div className="mb-10 border-b border-[color:var(--color-border)] pb-6">
          <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-teal-500">
            <Sparkles size={11} />
            Your List
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Saved Movies
            </h1>
            {!loading && (
              <span className="rounded-full border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                {movies.length} {movies.length === 1 ? "movie" : "movies"}
              </span>
            )}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-[300px] animate-pulse rounded-xl bg-[var(--color-bg-card)]"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && movies.length === 0 && (
          <div className="relative overflow-hidden rounded-xl border border-dashed border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-16 text-center">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05),transparent_60%)]" />
            <div className="relative">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
                <Bookmark size={20} />
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                No saved movies yet
              </h3>
              <p className="mx-auto mt-1.5 max-w-sm text-sm text-[var(--color-text-muted)]">
                Go to any movie detail page and save movies you want to watch.
              </p>
              <button
                onClick={() => navigate("/movies")}
                className="mt-6 rounded-lg bg-[var(--color-text-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-bg-base)] transition hover:opacity-90"
              >
                Explore Movies
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        {!loading && movies.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
              <div
                key={movie.tmdbId}
                onClick={() => navigate(`/movie/tmdb/${movie.tmdbId}`)}
                className="group cursor-pointer overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/5"
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
