import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Sparkles, Compass } from "lucide-react";

import api from "../api/axios";
import MovieCard from "./MovieCard";

/* ─── page ───────────────────────────────────────────────── */
const SavedMoviesPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedMovies = async () => {
      try {
        const res = await api.get("/saved");
        setMovies(res.data.movies || []);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedMovies();
  }, []);

  return (
    <>
      <style>{`
        @keyframes fv-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="min-h-screen bg-[var(--color-bg-base)] pb-24">
        <PageHeader loading={loading} count={movies.length} />

        <div className="px-10 pt-8">
          {loading && <SavedMoviesSkeleton />}
          {!loading && movies.length === 0 && (
            <EmptyState onExplore={() => navigate("/movies")} />
          )}
          {!loading && movies.length > 0 && (
            <MoviesGrid movies={movies} onMovieClick={navigate} />
          )}
        </div>
      </div>
    </>
  );
};

/* ─── header ─────────────────────────────────────────────── */
const PageHeader = ({ loading, count }) => {
  const movieCountText = `${count} ${count === 1 ? "FILM" : "FILMS"}`;

  return (
    <div className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg-page)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-brand)]/[0.08] via-transparent to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--color-brand)]/[0.06] blur-3xl" />

      <div className="relative px-10 pb-10 pt-28">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--color-brand)]">
            Your Collection
          </span>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-[clamp(32px,4.5vw,48px)] font-bold leading-[1.05] tracking-tight text-[var(--color-text-primary)]">
              Saved Movies
            </h1>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-[var(--color-text-muted)]">
              Your personal watchlist — films you've bookmarked to watch later.
            </p>
          </div>

          {!loading && count > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3.5 py-1.5">
              <Bookmark
                size={11}
                className="text-[var(--color-brand)]"
                strokeWidth={2.5}
              />
              <span className="text-[10px] font-bold tracking-[0.15em] text-[var(--color-text-secondary)]">
                {movieCountText}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── skeleton ───────────────────────────────────────────── */
const SavedMoviesSkeleton = () => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="flex flex-col gap-2">
        <div
          className="aspect-[2/3] animate-pulse rounded-xl bg-[var(--color-bg-card)]"
          style={{ animationDelay: `${i * 60}ms` }}
        />
        <div className="h-2.5 w-3/4 animate-pulse rounded bg-[var(--color-bg-card)]" />
        <div className="h-2 w-1/3 animate-pulse rounded bg-[var(--color-bg-card)]" />
      </div>
    ))}
  </div>
);

/* ─── empty state ────────────────────────────────────────── */
const EmptyState = ({ onExplore }) => (
  <div className="animate-[fv-up_.5s_ease_both] relative overflow-hidden rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-card)] px-6 py-20 text-center">
    <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-[var(--color-brand)]/[0.08] blur-3xl" />

    <div className="relative">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-brand-subtle)]">
        <Bookmark
          size={22}
          className="text-[var(--color-brand)]"
          strokeWidth={2}
        />
      </div>

      <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--color-brand)]">
        Nothing saved yet
      </p>

      <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
        Start building your watchlist
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-[var(--color-text-muted)]">
        Browse movies and tap the bookmark icon on any film you'd like to watch
        later. Your saved picks will appear here.
      </p>

      <button
        onClick={onExplore}
        className="mt-7 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-5 py-2.5 text-[12px] font-bold tracking-[0.04em] text-[#09090b] transition-colors duration-200 hover:bg-[var(--color-brand-hover)]"
      >
        <Compass size={13} strokeWidth={2.5} />
        Explore Movies
      </button>
    </div>
  </div>
);

/* ─── grid ───────────────────────────────────────────────── */
const MoviesGrid = ({ movies, onMovieClick }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
    {movies.map((movie, i) => (
      <div
        key={movie.tmdbId}
        onClick={() => onMovieClick(`/movie/tmdb/${movie.tmdbId}`)}
        className="group cursor-pointer overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        style={{ animation: `fv-up .45s ${i * 30}ms ease both` }}
      >
        <MovieCard movie={movie} />
      </div>
    ))}
  </div>
);

export default SavedMoviesPage;
