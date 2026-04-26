import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import ReviewSection from "../components/ReviewSection";

const MovieDetailPage = () => {
  const { tmdbId } = useParams();
  const navigate = useNavigate();

  const [loading, setloading] = useState(true);
  const [error, seterror] = useState("");
  const [movie, setmovie] = useState(null);
  const [averageRating, setaverageRating] = useState(null);

  useEffect(() => {
    async function loadmovie() {
      try {
        setloading(true);
        // save or fetch from db — always returns same _id for same tmdbId
        const res = await api.post("/tmdb/save", { tmdbId: Number(tmdbId) });
        const savedMovie = res.data.movie;
        setmovie(savedMovie);

        const ratingRes = await api.get(
          `/movie/getaveragerating/${savedMovie._id}`,
        );
        setaverageRating(ratingRes.data.averageRating);
      } catch (e) {
        console.log(e);
        seterror(e.response?.data?.message || "Failed to load movie");
      } finally {
        setloading(false);
      }
    }
    if (tmdbId) loadmovie();
  }, [tmdbId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-base)] px-6 pb-10 animate-pulse">
        {/* Backdrop skeleton */}
        <div className="h-[340px] w-full bg-[var(--color-bg-card)] rounded-xl mb-6" />

        <div className="mx-auto max-w-5xl">
          {/* Back button skeleton */}
          <div className="h-10 w-32 rounded-xl bg-[var(--color-bg-card)] mb-8" />

          {/* Movie card skeleton */}
          <div className="rounded-3xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-8 md:p-10">
            <div className="flex flex-col gap-8 md:flex-row">
              {/* Poster skeleton */}
              <div className="h-[260px] w-[180px] rounded-2xl bg-[var(--color-bg-input)]" />

              {/* Content skeleton */}
              <div className="flex-1 space-y-4">
                <div className="h-4 w-32 rounded bg-[var(--color-bg-input)]" />
                <div className="h-10 w-3/4 rounded bg-[var(--color-bg-input)]" />
                <div className="h-4 w-24 rounded bg-[var(--color-bg-input)]" />

                <div className="space-y-2 mt-4">
                  <div className="h-3 w-full rounded bg-[var(--color-bg-input)]" />
                  <div className="h-3 w-5/6 rounded bg-[var(--color-bg-input)]" />
                  <div className="h-3 w-4/6 rounded bg-[var(--color-bg-input)]" />
                </div>

                {/* Stats skeleton */}
                {/* <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mt-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded-2xl bg-[var(--color-bg-input)]"
                    />
                  ))}
                </div> */}
              </div>
            </div>
          </div>

          {/* Reviews skeleton */}
          {/* <div className="mt-10 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-[var(--color-bg-card)] border border-[color:var(--color-border)]"
              />
            ))}
          </div> */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[var(--color-bg-card)] p-6 text-center shadow-2xl">
          <p className="text-lg font-medium text-red-400">{error}</p>
          <button
            onClick={() => navigate("/movies")}
            className="mt-5 rounded-xl bg-red-500/90 px-5 py-2.5 text-white transition hover:bg-red-500"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)] transition-colors duration-300">
      {/* Backdrop */}
      {movie.backdrop && (
        <div className="relative h-[340px] w-full overflow-hidden">
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-[var(--color-bg-base)]" />
        </div>
      )}

      <div className="mx-auto max-w-5xl px-6 pb-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/movies")}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-5 py-2.5 shadow-md transition hover:bg-[var(--color-bg-elevated)]"
          style={{
            marginTop: movie.backdrop ? "-3rem" : "2.5rem",
            position: "relative",
            zIndex: 10,
          }}
        >
          ← Back to Movies
        </button>

        {/* Movie info card */}
        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] shadow-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-cyan-500/10" />

          <div className="relative flex flex-col gap-8 p-8 md:flex-row md:p-10">
            {/* Poster */}
            {movie.poster && (
              <div className="flex-shrink-0">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full rounded-2xl shadow-xl md:w-[180px]"
                />
              </div>
            )}

            <div className="flex-1">
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-teal-500">
                Movie Details
              </p>

              <h1 className="mb-2 font-swash text-4xl font-bold leading-tight text-[var(--color-text-primary)] md:text-5xl">
                {movie.title}
              </h1>

              {movie.releaseYear && (
                <p className="mb-4 text-sm text-[var(--color-text-muted)]">
                  {movie.releaseYear}
                </p>
              )}

              {movie.overview && (
                <p className="mb-6 text-sm leading-7 text-[var(--color-text-secondary)]">
                  {movie.overview}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-4">
                  <p className="mb-1 text-xs text-[var(--color-text-muted)]">
                    Director
                  </p>
                  <p className="text-sm font-semibold capitalize text-[var(--color-text-primary)]">
                    {movie.director}
                  </p>
                </div>
                <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-4">
                  <p className="mb-1 text-xs text-[var(--color-text-muted)]">
                    Genre
                  </p>
                  <p className="text-sm font-semibold capitalize text-[var(--color-text-primary)]">
                    {movie.genre}
                  </p>
                </div>
                <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-4">
                  <p className="mb-1 text-xs text-[var(--color-text-muted)]">
                    Duration
                  </p>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {movie.duration} hr
                  </p>
                </div>
                <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-4">
                  <p className="mb-1 text-xs text-[var(--color-text-muted)]">
                    Avg Rating
                  </p>
                  <p className="text-sm font-semibold text-amber-500">
                    {averageRating || "N/A"} / 5
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews — uses DB _id so reviews always attach to correct movie */}
        <ReviewSection movieId={movie._id} />
      </div>
    </div>
  );
};

export default MovieDetailPage;
