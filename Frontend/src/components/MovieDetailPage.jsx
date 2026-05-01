import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import ReviewSection from "../components/ReviewSection";
import { Heart } from "lucide-react";
import { sileo } from "sileo";

const MovieDetailPage = () => {
  const { tmdbId } = useParams();
  const navigate = useNavigate();

  const [loading, setloading] = useState(true);
  const [error, seterror] = useState("");
  const [movie, setmovie] = useState(null);
  const [averageRating, setaverageRating] = useState(null);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    async function loadmovie() {
      try {
        setloading(true);

        const res = await api.post("/tmdb/save", { tmdbId: Number(tmdbId) });
        const savedMovie = res.data.movie;
        setmovie(savedMovie);

        const ratingRes = await api.get(
          `/movie/getaveragerating/${savedMovie._id}`,
        );
        setaverageRating(ratingRes.data.averageRating);

        const savedRes = await api.get("/saved");
        const savedMovies = savedRes.data.movies || [];

        const isAlreadySaved = savedMovies.some(
          (item) => String(item.tmdbId) === String(savedMovie.tmdbId),
        );

        setSaved(isAlreadySaved);

        const profileRes = await api.get("/auth/profile");
        const likedMovies = profileRes.data.user.likedMovies || [];

        const isAlreadyLiked = likedMovies.some(
          (item) => String(item.tmdbId) === String(savedMovie.tmdbId),
        );

        setLiked(isAlreadyLiked);
      } catch (e) {
        console.log(e);
        seterror(e.response?.data?.message || "Failed to load movie");
      } finally {
        setloading(false);
      }
    }

    if (tmdbId) loadmovie();
  }, [tmdbId]);

  async function handleToggleSave() {
    try {
      if (saved) {
        await api.delete(`/saved/${movie.tmdbId}`);
        setSaved(false);

        sileo.success({
          title: "Removed",
          description: "Movie removed from saved list",
          position: "top-center",
        });
      } else {
        await api.post("/saved", {
          tmdbId: movie.tmdbId,
          title: movie.title,
          poster: movie.poster,
        });

        setSaved(true);

        sileo.success({
          title: "Saved",
          description: "Movie added to your list",
          position: "top-center",
        });
      }
    } catch (e) {
      console.log(e);

      sileo.error({
        title: "Error",
        description: e.response?.data?.message || "Something went wrong",
        position: "top-center",
      });
    }
  }

  async function handleToggleLike() {
    try {
      const res = await api.post("/saved/like", {
        tmdbId: movie.tmdbId,
        title: movie.title,
        poster: movie.poster,
        releaseDate: movie.releaseYear,
        rating: movie.rating || averageRating,
      });

      setLiked(res.data.liked);

      sileo.success({
        title: res.data.liked ? "Liked" : "Removed",
        description: res.data.liked
          ? "Movie added to liked movies"
          : "Movie removed from liked movies",
        position: "top-center",
      });
    } catch (e) {
      console.log(e);

      sileo.error({
        title: "Error",
        description: e.response?.data?.message || "Failed to update like",
        position: "top-center",
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen animate-pulse bg-[var(--color-bg-base)] px-6 pb-10">
        <div className="mb-6 h-[340px] w-full rounded-xl bg-[var(--color-bg-card)]" />

        <div className="mx-auto max-w-5xl">
          <div className="mb-8 h-10 w-32 rounded-xl bg-[var(--color-bg-card)]" />

          <div className="rounded-3xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-8 md:p-10">
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="h-[260px] w-[180px] rounded-2xl bg-[var(--color-bg-input)]" />

              <div className="flex-1 space-y-4">
                <div className="h-4 w-32 rounded bg-[var(--color-bg-input)]" />
                <div className="h-10 w-3/4 rounded bg-[var(--color-bg-input)]" />
                <div className="h-4 w-24 rounded bg-[var(--color-bg-input)]" />

                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full rounded bg-[var(--color-bg-input)]" />
                  <div className="h-3 w-5/6 rounded bg-[var(--color-bg-input)]" />
                  <div className="h-3 w-4/6 rounded bg-[var(--color-bg-input)]" />
                </div>
              </div>
            </div>
          </div>
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

        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] shadow-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-cyan-500/10" />

          <div className="relative flex flex-col gap-8 p-8 md:flex-row md:p-10">
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
              <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm uppercase tracking-[0.25em] text-teal-500">
                  Movie Details
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleToggleLike}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
                      liked
                        ? "bg-pink-500 hover:bg-pink-600"
                        : "bg-white/10 hover:bg-pink-500/20"
                    }`}
                  >
                    <Heart size={16} fill={liked ? "currentColor" : "none"} />
                    {liked ? "Liked" : "Like"}
                  </button>

                  <button
                    onClick={handleToggleSave}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
                      saved
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-teal-500 hover:bg-teal-600"
                    }`}
                  >
                    {saved ? "Unsave" : "Save"}
                  </button>
                </div>
              </div>

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

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-4">
                  <p className="mb-1 text-xs text-[var(--color-text-muted)]">
                    Director
                  </p>
                  <p className="text-sm font-semibold capitalize text-[var(--color-text-primary)]">
                    {movie.director || "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-4">
                  <p className="mb-1 text-xs text-[var(--color-text-muted)]">
                    Genre
                  </p>
                  <p className="text-sm font-semibold capitalize text-[var(--color-text-primary)]">
                    {movie.genre || "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-4">
                  <p className="mb-1 text-xs text-[var(--color-text-muted)]">
                    Duration
                  </p>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {movie.duration ? `${movie.duration} hr` : "N/A"}
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

        <ReviewSection movieId={movie._id} />
      </div>
    </div>
  );
};

export default MovieDetailPage;
