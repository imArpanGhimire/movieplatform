import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Sparkles } from "lucide-react";

import api from "../api/axios";
import MovieCard from "./MovieCard";

const SavedMoviesPage = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedMovies = async () => {
      try {
        const res = await api.get("/saved");
        console.log("saved movies sample:", res.data.movies?.[0]); // remove after confirming posters show
        const savedMovies = res.data.movies || [];
        setMovies(savedMovies);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedMovies();
  }, []);

  const movieCountText = `${movies.length} ${
    movies.length === 1 ? "movie" : "movies"
  }`;

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-28">
        <PageHeader loading={loading} movieCountText={movieCountText} />
        {loading && <SavedMoviesSkeleton />}
        {!loading && movies.length === 0 && (
          <EmptyState onExplore={() => navigate("/movies")} />
        )}
        {!loading && movies.length > 0 && (
          <MoviesGrid movies={movies} onMovieClick={navigate} />
        )}
      </div>
    </div>
  );
};

const PageHeader = ({ loading, movieCountText }) => {
  return (
    <div className="mb-10 border-b border-[color:var(--color-border)] pb-6">
      <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
        <Sparkles size={11} />
        Your List
      </p>
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Saved Movies
        </h1>
        {!loading && (
          <span className="rounded-full border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
            {movieCountText}
          </span>
        )}
      </div>
    </div>
  );
};

const SavedMoviesSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="h-[300px] animate-pulse rounded-xl bg-[var(--color-bg-card)]"
        />
      ))}
    </div>
  );
};

const EmptyState = ({ onExplore }) => {
  return (
    <div className="rounded-xl border border-dashed border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-16 text-center">
      <div>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
          <Bookmark size={20} />
        </div>
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
          No saved movies yet
        </h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-[var(--color-text-muted)]">
          Go to any movie detail page and save movies you want to watch.
        </p>
        <button
          onClick={onExplore}
          className="mt-6 rounded-lg bg-[var(--color-text-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-bg-base)] transition hover:opacity-90"
        >
          Explore Movies
        </button>
      </div>
    </div>
  );
};

const MoviesGrid = ({ movies, onMovieClick }) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <div
          key={movie.tmdbId}
          onClick={() => onMovieClick(`/movie/tmdb/${movie.tmdbId}`)}
          className="group cursor-pointer overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
};

export default SavedMoviesPage;
