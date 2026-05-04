import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import MovieCard from "./MovieCard";
import {
  Heart,
  MessageCircle,
  Star,
  Film,
  CalendarDays,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/auth/profile");
        setProfile(res.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-base)] px-6 pb-20 pt-28 text-[var(--color-text-primary)]">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-10 w-48 rounded-lg bg-[var(--color-bg-card)]" />
          <div className="h-40 rounded-2xl bg-[var(--color-bg-card)]" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-[var(--color-bg-card)]"
              />
            ))}
          </div>
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="h-96 rounded-xl bg-[var(--color-bg-card)]" />
            <div className="h-96 rounded-xl bg-[var(--color-bg-card)]" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] px-6 text-[var(--color-text-primary)]">
        <p className="text-sm text-[var(--color-text-muted)]">
          Failed to load profile.
        </p>
      </div>
    );
  }

  const { user, reviews, stats } = profile;
  const activityScore =
    (stats.totalReviews || 0) + (stats.totalLikedMovies || 0);
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "recently";

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      {/* Ambience */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-teal-500/[0.04] blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-[400px] w-[400px] rounded-full bg-teal-500/[0.03] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-28">
        {/* Page eyebrow */}
        <p className="mb-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-teal-500">
          <Sparkles size={11} />
          Your Profile
        </p>

        {/* Header card */}
        <section className="relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.08),transparent_50%)]" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/5 blur-3xl" />

          <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500/40 to-teal-500/10 blur-md" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-2xl font-semibold uppercase text-white shadow-lg ring-4 ring-[var(--color-bg-card)] md:h-24 md:w-24 md:text-3xl">
                  {user.username?.charAt(0)}
                </div>
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-500/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-teal-500">
                  <Sparkles size={10} />
                  {user.role}
                </div>
                <h1 className="text-2xl font-semibold capitalize tracking-tight md:text-3xl">
                  {user.username}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-text-muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={13} />
                    Member since {memberSince}
                  </span>
                  <span className="text-[var(--color-text-muted)]/40">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <TrendingUp size={13} />
                    {activityScore} contributions
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/movies")}
              className="group inline-flex w-fit items-center gap-2 rounded-lg bg-[var(--color-text-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg-base)] transition hover:opacity-90"
            >
              Explore movies
              <ArrowRight
                size={14}
                className="transition group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={MessageCircle}
            label="Reviews written"
            value={stats.totalReviews || 0}
            tone="teal"
            hint="Your thoughts shared"
          />
          <StatCard
            icon={Heart}
            label="Liked movies"
            value={stats.totalLikedMovies || 0}
            tone="pink"
            hint="In your favorites"
          />
          <StatCard
            icon={Star}
            label="Activity score"
            value={activityScore}
            tone="amber"
            hint="Total contributions"
          />
        </section>

        {/* Main content */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_340px]">
          {/* Liked movies */}
          <section>
            <SectionHeader
              eyebrow="Collection"
              title="Liked movies"
              description="Movies you've added to your favorites"
              meta={`${user.likedMovies.length} ${user.likedMovies.length === 1 ? "movie" : "movies"}`}
            />

            {user.likedMovies.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="No liked movies yet"
                description="Like movies from their detail page and they'll appear here."
                actionLabel="Browse movies"
                onAction={() => navigate("/movies")}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {user.likedMovies.map((movie) => (
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
          </section>

          {/* Reviews sidebar */}
          <aside>
            <SectionHeader
              eyebrow="Activity"
              title="Recent reviews"
              description="Your latest thoughts"
              icon={Film}
            />

            {reviews.length === 0 ? (
              <EmptyState
                icon={MessageCircle}
                title="No reviews yet"
                description="Your reviews will appear here once you start writing."
                compact
              />
            ) : (
              <div className="space-y-3">
                {reviews.slice(0, 5).map((review) => (
                  <article
                    key={review._id}
                    className="group relative overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-4 transition hover:border-[color:var(--color-border-strong)]"
                  >
                    <div className="absolute left-0 top-0 h-full w-0.5 bg-teal-500/0 transition group-hover:bg-teal-500/60" />

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
                          {review.movie?.title || "Unknown movie"}
                        </h3>
                        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "Older review"}
                        </p>
                      </div>
                      <div className="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-xs font-semibold text-amber-500">
                        <Star size={11} fill="currentColor" />
                        {review.rating}
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {review.comment}
                    </p>
                  </article>
                ))}

                {reviews.length > 5 && (
                  <button className="w-full rounded-lg border border-dashed border-[color:var(--color-border)] py-2.5 text-xs font-medium text-[var(--color-text-muted)] transition hover:border-[color:var(--color-border-strong)] hover:text-[var(--color-text-primary)]">
                    View all {reviews.length} reviews
                  </button>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

/* ─── Sub-components ─────────────────────────────────── */

const toneStyles = {
  teal: {
    bg: "bg-teal-500/10",
    text: "text-teal-500",
    border: "group-hover:border-teal-500/30",
    glow: "bg-teal-500/5",
  },
  pink: {
    bg: "bg-pink-500/10",
    text: "text-pink-500",
    border: "group-hover:border-pink-500/30",
    glow: "bg-pink-500/5",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "group-hover:border-amber-500/30",
    glow: "bg-amber-500/5",
  },
};

const StatCard = ({ icon: Icon, label, value, hint, tone = "teal" }) => {
  const t = toneStyles[tone];
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-5 transition ${t.border}`}
    >
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full ${t.glow} blur-2xl`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            {value}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${t.bg} ${t.text}`}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ eyebrow, title, description, meta, icon: Icon }) => (
  <div className="mb-6 flex items-end justify-between gap-4 border-b border-[color:var(--color-border)] pb-4">
    <div>
      {eyebrow && (
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-teal-500">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {description}
        </p>
      )}
    </div>
    {meta && (
      <span className="rounded-full border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
        {meta}
      </span>
    )}
    {Icon && !meta && (
      <Icon size={16} className="text-[var(--color-text-muted)]" />
    )}
  </div>
);

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}) => (
  <div
    className={`relative overflow-hidden rounded-xl border border-dashed border-[color:var(--color-border)] bg-[var(--color-bg-card)] text-center ${compact ? "p-8" : "p-12"}`}
  >
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05),transparent_60%)]" />
    <div className="relative">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
        <Icon size={20} />
      </div>
      <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
        {title}
      </h3>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-[var(--color-text-muted)]">
        {description}
      </p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-5 rounded-lg bg-[var(--color-text-primary)] px-4 py-2 text-sm font-medium text-[var(--color-bg-base)] transition hover:opacity-90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  </div>
);

export default ProfilePage;
