import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import MovieCard from "./MovieCard";
import {
  Heart,
  MessageCircle,
  Star,
  UserRound,
  Film,
  CalendarDays,
  ArrowRight,
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
      <div className="min-h-screen bg-[var(--color-bg-base)] px-6 pb-20 pt-32 text-[var(--color-text-primary)]">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <div className="h-72 rounded-[2rem] bg-[var(--color-bg-card)]" />
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="h-96 rounded-[2rem] bg-[var(--color-bg-card)]" />
            <div className="h-96 rounded-[2rem] bg-[var(--color-bg-card)]" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] px-6 text-[var(--color-text-primary)]">
        Failed to load profile.
      </div>
    );
  }

  const { user, reviews, stats } = profile;

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] px-6 pb-20 pt-32 text-[var(--color-text-primary)] transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        {/* PROFILE HERO */}
        <section className="relative overflow-hidden rounded-[2rem] border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.10)] md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-cyan-500/10" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[2rem] bg-teal-500 text-5xl font-black uppercase text-zinc-950 shadow-lg shadow-teal-500/20">
                {user.username?.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[var(--color-bg-input)] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-teal-500">
                  <UserRound size={14} />
                  FilmVault Profile
                </div>

                <h1 className="text-4xl font-black capitalize tracking-tight md:text-5xl">
                  {user.username}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-muted)]">
                  <span className="rounded-full bg-teal-500/10 px-3 py-1 font-semibold capitalize text-teal-500">
                    {user.role}
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={15} />
                    Joined{" "}
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "recently"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/movies")}
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-teal-500/20 transition hover:-translate-y-0.5 hover:bg-teal-400"
            >
              Explore Movies
              <ArrowRight size={17} />
            </button>
          </div>

          {/* STATS */}
          <div className="relative mt-9 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-500">
                <MessageCircle size={20} />
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Reviews Written
              </p>
              <h2 className="mt-1 text-3xl font-black">{stats.totalReviews}</h2>
            </div>

            <div className="rounded-3xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-500">
                <Heart size={20} />
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Liked Movies
              </p>
              <h2 className="mt-1 text-3xl font-black">
                {stats.totalLikedMovies}
              </h2>
            </div>

            <div className="rounded-3xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                <Star size={20} />
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Activity Score
              </p>
              <h2 className="mt-1 text-3xl font-black">
                {(stats.totalReviews || 0) + (stats.totalLikedMovies || 0)}
              </h2>
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_390px]">
          {/* LIKED MOVIES */}
          <section className="rounded-[2rem] border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)] md:p-7">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-teal-500">
                  Collection
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  Liked Movies
                </h2>
              </div>

              <div className="rounded-full bg-[var(--color-bg-input)] px-4 py-2 text-sm font-bold text-[var(--color-text-muted)]">
                {user.likedMovies.length} movies
              </div>
            </div>

            {user.likedMovies.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-12 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-pink-500/10 text-pink-500">
                  <Heart size={30} />
                </div>

                <h3 className="text-2xl font-black">No liked movies yet</h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
                  Like movies from the detail page and they will appear here.
                </p>

                <button
                  onClick={() => navigate("/movies")}
                  className="mt-6 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-teal-400"
                >
                  Browse Movies
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {user.likedMovies.map((movie) => (
                  <div
                    key={movie.tmdbId}
                    onClick={() => navigate(`/movie/tmdb/${movie.tmdbId}`)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] transition-all duration-300 hover:-translate-y-2 hover:border-pink-500/60 hover:shadow-[0_20px_50px_rgba(236,72,153,0.14)]"
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* REVIEW ACTIVITY */}
          <aside className="rounded-[2rem] border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)] md:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-teal-500">
                  Activity
                </p>
                <h2 className="mt-2 text-2xl font-black">Recent Reviews</h2>
              </div>

              <Film className="text-teal-500" size={24} />
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-500">
                  <MessageCircle size={26} />
                </div>

                <h3 className="text-xl font-black">No reviews yet</h3>

                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  Your reviews will show here after you write them.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, 5).map((review) => (
                  <div
                    key={review._id}
                    className="rounded-3xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-4 transition hover:bg-[var(--color-bg-elevated)]"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-black">
                          {review.movie?.title || "Unknown Movie"}
                        </h3>

                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : "Older review"}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-black text-amber-500">
                        ⭐ {review.rating}
                      </div>
                    </div>

                    <p className="line-clamp-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                      “{review.comment}”
                    </p>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
