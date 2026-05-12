import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sileo } from "sileo";
import {
  ArrowLeft,
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

import api from "../api/axios";
import ReviewSection from "../components/ReviewSection";

const showSuccessToast = (title, description) => {
  sileo.success({
    title,
    description,
    position: "top-center",
  });
};

const showErrorToast = (description) => {
  sileo.error({
    title: "Error",
    description,
    position: "top-center",
  });
};

const MovieDetailPage = () => {
  const { tmdbId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [movie, setMovie] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.post("/tmdb/save", {
          tmdbId: Number(tmdbId),
        });

        const savedMovie = res.data.movie;
        setMovie(savedMovie);

        const ratingRes = await api.get(
          `/movie/getaveragerating/${savedMovie._id}`,
        );

        setAverageRating(ratingRes.data.averageRating);

        const [savedRes, profileRes] = await Promise.all([
          api.get("/saved"),
          api.get("/auth/profile"),
        ]);

        const savedMovies = savedRes.data.movies || [];
        const likedMovies = profileRes.data.user.likedMovies || [];

        const isAlreadySaved = savedMovies.some(
          (item) => String(item.tmdbId) === String(savedMovie.tmdbId),
        );

        const isAlreadyLiked = likedMovies.some(
          (item) => String(item.tmdbId) === String(savedMovie.tmdbId),
        );

        setSaved(isAlreadySaved);
        setLiked(isAlreadyLiked);
      } catch (e) {
        console.log(e);
        setError(e.response?.data?.message || "Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    if (tmdbId) {
      loadMovie();
    }
  }, [tmdbId]);

  const handleToggleSave = async () => {
    try {
      if (saved) {
        await api.delete(`/saved/${movie.tmdbId}`);

        setSaved(false);

        showSuccessToast("Removed", "Movie removed from saved list");
        return;
      }

      await api.post("/saved", {
        tmdbId: movie.tmdbId,
        title: movie.title,
        poster: movie.poster,
      });

      setSaved(true);

      showSuccessToast("Saved", "Movie added to your list");
    } catch (e) {
      console.log(e);
      showErrorToast(e.response?.data?.message || "Something went wrong");
    }
  };

  const handleToggleLike = async () => {
    try {
      const res = await api.post("/saved/like", {
        tmdbId: movie.tmdbId,
        title: movie.title,
        poster: movie.poster,
        releaseDate: movie.releaseYear,
        rating: movie.rating || averageRating,
      });

      const isLiked = res.data.liked;

      setLiked(isLiked);

      showSuccessToast(
        isLiked ? "Liked" : "Removed",
        isLiked
          ? "Movie added to liked movies"
          : "Movie removed from liked movies",
      );
    } catch (e) {
      console.log(e);
      showErrorToast(e.response?.data?.message || "Failed to update like");
    }
  };

  const handleWatchTrailer = async () => {
    try {
      const res = await api.get(`/tmdb/trailer/${tmdbId}`);

      window.open(res.data.youtubeUrl, "_blank");
    } catch (e) {
      console.log(e);
      showErrorToast("Trailer not available");
    }
  };

  if (loading) {
    return <MovieDetailSkeleton />;
  }

  if (error) {
    return (
      <MovieDetailError error={error} onBack={() => navigate("/movies")} />
    );
  }

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      <div className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
        {movie.backdrop && (
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-base)] via-[var(--color-bg-base)]/70 to-[var(--color-bg-base)]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-base)]/60 to-transparent" />

        <div className="absolute left-0 right-0 top-0 z-10">
          <div className="mx-auto max-w-6xl px-6 pt-24">
            <div className="flex justify-end">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-base)]/60 px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] backdrop-blur-sm transition hover:bg-[var(--color-bg-card)]"
              >
                <ArrowLeft size={14} />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <div className="-mt-44 grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-12">
          <div className="relative z-10">
            {movie.poster && (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full max-w-[260px] rounded-2xl border border-[color:var(--color-border)] object-cover shadow-xl"
              />
            )}
          </div>

          <div className="relative z-10 lg:pt-32">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
              <span>{movie.releaseYear || "—"}</span>
              <span className="text-[var(--color-text-muted)]/50">•</span>
              <span className="capitalize">{movie.genre || "Movie"}</span>
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[var(--color-text-primary)] md:text-5xl">
              {movie.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--color-text-secondary)]">
              <span className="inline-flex items-center gap-1.5">
                <Star
                  size={14}
                  className="text-amber-500"
                  fill="currentColor"
                />
                <span className="font-medium text-[var(--color-text-primary)]">
                  {averageRating || "—"}
                </span>
                <span className="text-[var(--color-text-muted)]">/ 5</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} className="text-[var(--color-text-muted)]" />
                {movie.duration ? `${movie.duration} hr` : "—"}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <User size={14} className="text-[var(--color-text-muted)]" />
                {movie.director || "—"}
              </span>
            </div>

            {movie.overview && (
              <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                {movie.overview}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-2.5">
              <button
                onClick={handleWatchTrailer}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
              >
                <Play size={15} fill="currentColor" />
                Watch Trailer
              </button>

              <button
                onClick={handleToggleSave}
                className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition ${
                  saved
                    ? "border-teal-500/30 bg-teal-500/10 text-teal-500"
                    : "border-[color:var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]"
                }`}
              >
                {saved ? (
                  <Bookmark size={15} fill="currentColor" />
                ) : (
                  <Plus size={15} />
                )}
                {saved ? "Saved" : "Add to list"}
              </button>

              <button
                onClick={handleToggleLike}
                className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition ${
                  liked
                    ? "border-pink-500/30 bg-pink-500/10 text-pink-500"
                    : "border-[color:var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]"
                }`}
              >
                <Heart size={15} fill={liked ? "currentColor" : "none"} />
                {liked ? "Liked" : "Like"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 divide-x divide-[color:var(--color-border)] overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] sm:grid-cols-4">
          <DetailCell icon={User} label="Director" value={movie.director} />
          <DetailCell
            icon={Film}
            label="Genre"
            value={movie.genre}
            capitalize
          />
          <DetailCell
            icon={Calendar}
            label="Released"
            value={movie.releaseYear}
          />
          <DetailCell
            icon={Star}
            label="Rating"
            value={averageRating ? `${averageRating} / 5` : null}
          />
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_300px]">
          <section>
            <div className="mb-6 flex items-end justify-between border-b border-[color:var(--color-border)] pb-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                  Reviews
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Latest thoughts from the community
                </p>
              </div>

              <button
                onClick={() => setShowAllReviews((prev) => !prev)}
                className="hidden text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)] sm:block"
              >
                {showAllReviews ? "Show less" : "View all"}
              </button>
            </div>

            <ReviewSection
              movieId={movie._id}
              showAllReviews={showAllReviews}
            />

            <button
              onClick={() => setShowAllReviews((prev) => !prev)}
              className="mt-5 w-full rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)] sm:hidden"
            >
              {showAllReviews ? "Show less" : "View all reviews"}
            </button>
          </section>

          <aside className="space-y-8">
            <div>
              <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                Gallery
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {[movie.backdrop, movie.poster]
                  .filter(Boolean)
                  .map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={movie.title}
                      className="aspect-video w-full rounded-lg border border-[color:var(--color-border)] object-cover"
                    />
                  ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                Information
              </h3>

              <dl className="space-y-3 text-sm">
                <InfoRow label="Director" value={movie.director} />
                <InfoRow label="Genre" value={movie.genre} capitalize />
                <InfoRow label="Year" value={movie.releaseYear} />
                <InfoRow
                  label="Duration"
                  value={movie.duration ? `${movie.duration} hr` : null}
                />
                <InfoRow
                  label="Rating"
                  value={averageRating ? `${averageRating} / 5` : null}
                />
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const MovieDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      <div className="mx-auto max-w-6xl animate-pulse px-6 py-10">
        <div className="mb-10 h-4 w-24 rounded bg-[var(--color-bg-card)]" />

        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <div className="aspect-[2/3] rounded-xl bg-[var(--color-bg-card)]" />

          <div className="space-y-5">
            <div className="h-4 w-32 rounded bg-[var(--color-bg-card)]" />
            <div className="h-12 w-3/4 rounded bg-[var(--color-bg-card)]" />
            <div className="h-4 w-1/2 rounded bg-[var(--color-bg-card)]" />

            <div className="space-y-2 pt-4">
              <div className="h-3 w-full rounded bg-[var(--color-bg-card)]" />
              <div className="h-3 w-5/6 rounded bg-[var(--color-bg-card)]" />
              <div className="h-3 w-4/6 rounded bg-[var(--color-bg-card)]" />
            </div>

            <div className="flex gap-3 pt-4">
              <div className="h-11 w-32 rounded-lg bg-[var(--color-bg-card)]" />
              <div className="h-11 w-32 rounded-lg bg-[var(--color-bg-card)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MovieDetailError = ({ error, onBack }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] px-6 text-[var(--color-text-primary)]">
      <div className="w-full max-w-sm rounded-xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-8 text-center">
        <p className="text-base font-medium text-red-400">{error}</p>

        <button
          onClick={onBack}
          className="mt-6 rounded-lg bg-[var(--color-text-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-bg-base)] transition hover:opacity-90"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

const DetailCell = ({ icon: Icon, label, value, capitalize }) => {
  return (
    <div className="px-5 py-5">
      <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        <Icon size={12} />
        {label}
      </div>

      <p
        className={`truncate text-sm font-medium text-[var(--color-text-primary)] ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
};

const InfoRow = ({ label, value, capitalize }) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[color:var(--color-border)] pb-3 last:border-0 last:pb-0">
      <dt className="text-[var(--color-text-muted)]">{label}</dt>

      <dd
        className={`text-right font-medium text-[var(--color-text-primary)] ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value || "—"}
      </dd>
    </div>
  );
};

export default MovieDetailPage;
