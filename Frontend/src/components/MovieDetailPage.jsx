import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import ReviewSection from "../components/ReviewSection";
import {
  Bookmark,
  Calendar,
  Clock,
  Film,
  Heart,
  Play,
  Plus,
  Star,
  User,
} from "lucide-react";
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
  const [showAllReviews, setShowAllReviews] = useState(false);

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
      <div className="min-h-screen bg-[var(--color-bg-base)] px-6 py-8 text-[var(--color-text-primary)] transition-colors duration-300">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-8 h-14 rounded-2xl bg-[var(--color-bg-card)]" />

          <div className="relative h-[520px] overflow-hidden rounded-[2rem] bg-[var(--color-bg-card)]">
            <div className="absolute bottom-10 left-10 flex items-end gap-8">
              <div className="h-[290px] w-[200px] rounded-3xl bg-[var(--color-bg-input)]" />

              <div className="space-y-4">
                <div className="h-5 w-40 rounded bg-[var(--color-bg-input)]" />
                <div className="h-16 w-[520px] rounded bg-[var(--color-bg-input)]" />
                <div className="h-4 w-[420px] rounded bg-[var(--color-bg-input)]" />
                <div className="h-4 w-[600px] rounded bg-[var(--color-bg-input)]" />

                <div className="flex gap-4 pt-4">
                  <div className="h-12 w-40 rounded-full bg-[var(--color-bg-input)]" />
                  <div className="h-12 w-40 rounded-full bg-[var(--color-bg-input)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_330px]">
            <div className="space-y-5">
              <div className="h-10 w-64 rounded bg-[var(--color-bg-input)]" />
              <div className="h-44 rounded-3xl bg-[var(--color-bg-card)]" />
              <div className="h-44 rounded-3xl bg-[var(--color-bg-card)]" />
            </div>

            <div className="space-y-5">
              <div className="h-64 rounded-3xl bg-[var(--color-bg-card)]" />
              <div className="h-56 rounded-3xl bg-[var(--color-bg-card)]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] px-6 text-[var(--color-text-primary)]">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-[var(--color-bg-card)] p-8 text-center shadow-2xl">
          <p className="text-lg font-semibold text-red-400">{error}</p>

          <button
            onClick={() => navigate("/movies")}
            className="mt-6 rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-600"
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
      <section className="relative min-h-[720px] overflow-hidden">
        {movie.backdrop && (
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-base)] via-[var(--color-bg-base)]/75 to-[var(--color-bg-base)]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-base)] via-[var(--color-bg-base)]/50 to-transparent" />

        <div className="relative z-10 mx-auto mt-10 flex max-w-7xl flex-col gap-10 px-6 pb-20 pt-28 lg:flex-row lg:items-end">
          <div className="shrink-0">
            {movie.poster && (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-[210px] rounded-3xl border border-[color:var(--color-border)] object-cover shadow-[0_25px_80px_rgba(0,0,0,0.35)] md:w-[250px]"
              />
            )}
          </div>

          <div className="max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-teal-500 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-zinc-950">
                Featured Movie
              </span>

              <span className="inline-flex items-center gap-1 text-sm font-bold text-teal-500">
                <Star size={15} fill="currentColor" />
                {averageRating || "N/A"}
              </span>
            </div>

            <h1 className="mb-5 text-5xl font-black uppercase leading-none tracking-tight text-[var(--color-text-primary)] drop-shadow-xl md:text-7xl lg:text-8xl">
              {movie.title}
            </h1>

            <div className="mb-6 flex flex-wrap gap-5 text-sm font-medium text-[var(--color-text-secondary)]">
              <span className="inline-flex items-center gap-2">
                <User size={17} className="text-teal-500" />
                Dir. {movie.director || "N/A"}
              </span>

              <span className="inline-flex items-center gap-2">
                <Film size={17} className="text-teal-500" />
                {movie.genre || "N/A"}
              </span>

              <span className="inline-flex items-center gap-2">
                <Clock size={17} className="text-teal-500" />
                {movie.duration ? `${movie.duration} hr` : "N/A"}
              </span>

              <span className="inline-flex items-center gap-2">
                <Calendar size={17} className="text-teal-500" />
                {movie.releaseYear || "N/A"}
              </span>
            </div>

            {movie.overview && (
              <p className="mb-8 max-w-3xl text-base leading-8 text-[var(--color-text-secondary)] md:text-lg">
                {movie.overview}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <button className="inline-flex items-center gap-3 rounded-full bg-teal-500 px-8 py-4 text-sm font-black uppercase tracking-wide text-zinc-950 shadow-lg shadow-teal-500/20 transition hover:-translate-y-0.5 hover:bg-teal-400">
                <Play size={17} fill="currentColor" />
                Watch Trailer
              </button>

              <button
                onClick={handleToggleSave}
                className={`inline-flex items-center gap-3 rounded-full border px-8 py-4 text-sm font-black uppercase tracking-wide transition hover:-translate-y-0.5 ${
                  saved
                    ? "border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/15"
                    : "border-[color:var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]"
                }`}
              >
                {saved ? (
                  <Bookmark size={17} fill="currentColor" />
                ) : (
                  <Plus size={17} />
                )}
                {saved ? "Saved" : "Add To List"}
              </button>

              <button
                onClick={handleToggleLike}
                className={`inline-flex items-center gap-3 rounded-full border px-8 py-4 text-sm font-black uppercase tracking-wide transition hover:-translate-y-0.5 ${
                  liked
                    ? "border-pink-500/30 bg-pink-500/10 text-pink-500 hover:bg-pink-500/15"
                    : "border-[color:var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]"
                }`}
              >
                <Heart size={17} fill={liked ? "currentColor" : "none"} />
                {liked ? "Liked" : "Like"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-10 px-6 pb-24 lg:grid-cols-[1fr_340px]">
        <section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] md:text-4xl">
                Cinephile Reviews
              </h2>

              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Latest thoughts from the community
              </p>
            </div>

            <button
              onClick={() => setShowAllReviews((prev) => !prev)}
              className="hidden text-xs font-black uppercase tracking-wide text-teal-500 transition hover:text-teal-400 sm:block"
            >
              {showAllReviews ? "Show Less" : "View All Reviews"}
            </button>
          </div>

          <ReviewSection movieId={movie._id} showAllReviews={showAllReviews} />

          <button
            onClick={() => setShowAllReviews((prev) => !prev)}
            className="mt-6 w-full rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-5 py-4 text-sm font-black uppercase tracking-wide text-teal-500 transition hover:bg-[var(--color-bg-elevated)] sm:hidden"
          >
            {showAllReviews ? "Show Less" : "View All Reviews"}
          </button>
        </section>

        <aside className="space-y-7">
          <div className="rounded-3xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.10)]">
            <h3 className="mb-5 text-xl font-black text-[var(--color-text-primary)]">
              Movie Info
            </h3>

            <div className="space-y-4">
              <div className="rounded-2xl bg-[var(--color-bg-input)] p-4">
                <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                  Director
                </p>
                <p className="mt-1 font-bold text-[var(--color-text-primary)]">
                  {movie.director || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--color-bg-input)] p-4">
                <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                  Genre
                </p>
                <p className="mt-1 font-bold capitalize text-[var(--color-text-primary)]">
                  {movie.genre || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--color-bg-input)] p-4">
                <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                  Release Year
                </p>
                <p className="mt-1 font-bold text-[var(--color-text-primary)]">
                  {movie.releaseYear || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--color-bg-input)] p-4">
                <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                  Average Rating
                </p>
                <p className="mt-1 inline-flex items-center gap-2 font-bold text-amber-500">
                  <Star size={16} fill="currentColor" />
                  {averageRating || "N/A"} / 5
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.10)]">
            <h3 className="mb-5 text-xl font-black text-[var(--color-text-primary)]">
              Gallery
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {[movie.backdrop, movie.poster]
                .filter(Boolean)
                .map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={movie.title}
                    className="h-24 w-full rounded-2xl border border-[color:var(--color-border)] object-cover"
                  />
                ))}
            </div>
          </div>

          <button
            onClick={() => navigate("/movies")}
            className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-5 py-4 text-sm font-black uppercase tracking-wide text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
          >
            ← Back To Movies
          </button>
        </aside>
      </main>
    </div>
  );
};

export default MovieDetailPage;
