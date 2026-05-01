import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import MovieCard from "./MovieCard";
import {
  Heart,
  MessageCircle,
  Star,
  UserRound,
  Film,
  CalendarDays,
} from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
      <div
        className={`min-h-screen px-6 pt-40 ${
          isDark ? "bg-[#030711]" : "bg-[#f6f7f9]"
        }`}
      >
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-72 animate-pulse rounded-[2rem] bg-white/10" />
          <div className="h-64 animate-pulse rounded-[2rem] bg-white/10" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030711] text-white">
        Failed to load profile.
      </div>
    );
  }

  const { user, reviews, stats } = profile;

  return (
    <div
      className={`relative min-h-screen overflow-hidden px-6 pb-20 pt-40 ${
        isDark ? "bg-[#030711] text-white" : "bg-[#f6f7f9] text-zinc-950"
      }`}
    >
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className={`absolute left-[-10%] top-[-20%] h-[650px] w-[650px] rounded-full blur-[140px] ${
            isDark ? "bg-teal-500/20" : "bg-teal-200/60"
          }`}
        />
        <div
          className={`absolute right-[-15%] top-[10%] h-[600px] w-[600px] rounded-full blur-[140px] ${
            isDark ? "bg-cyan-500/10" : "bg-cyan-100/70"
          }`}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <section
          className={`overflow-hidden rounded-[2rem] border shadow-2xl ${
            isDark
              ? "border-white/10 bg-white/[0.06] shadow-black/40"
              : "border-white/70 bg-white/80 shadow-zinc-200/80"
          }`}
        >
          <div className="h-36 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500" />

          <div className="px-7 pb-8">
            <div className="-mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-5">
                <div
                  className={`flex h-28 w-28 items-center justify-center rounded-3xl border-4 text-5xl font-black text-white shadow-xl ${
                    isDark
                      ? "border-[#030711] bg-teal-500"
                      : "border-white bg-teal-500"
                  }`}
                >
                  {user.username?.charAt(0).toUpperCase()}
                </div>

                <div className="pb-2">
                  <h1 className="text-4xl font-black capitalize">
                    {user.username}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-teal-500/15 px-3 py-1 text-sm font-semibold text-teal-300">
                      {user.role}
                    </span>

                    <span
                      className={`flex items-center gap-1 text-sm ${
                        isDark ? "text-white/50" : "text-zinc-500"
                      }`}
                    >
                      <CalendarDays size={14} />
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
                className="rounded-2xl bg-teal-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/20 transition hover:-translate-y-0.5 hover:bg-teal-400"
              >
                Explore Movies
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className={`rounded-3xl border p-5 ${
                  isDark
                    ? "border-white/10 bg-black/25"
                    : "border-zinc-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-300">
                    <MessageCircle size={20} />
                  </div>

                  <div>
                    <p
                      className={
                        isDark
                          ? "text-sm text-white/50"
                          : "text-sm text-zinc-500"
                      }
                    >
                      Reviews Written
                    </p>

                    <h2 className="text-3xl font-black">
                      {stats.totalReviews}
                    </h2>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-3xl border p-5 ${
                  isDark
                    ? "border-white/10 bg-black/25"
                    : "border-zinc-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500/15 text-pink-300">
                    <Heart size={20} />
                  </div>

                  <div>
                    <p
                      className={
                        isDark
                          ? "text-sm text-white/50"
                          : "text-sm text-zinc-500"
                      }
                    >
                      Liked Movies
                    </p>

                    <h2 className="text-3xl font-black">
                      {stats.totalLikedMovies}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-teal-300">
                Collection
              </p>
              <h2 className="mt-2 text-3xl font-black">Liked Movies</h2>
            </div>
          </div>

          {user.likedMovies.length === 0 ? (
            <div
              className={`rounded-[2rem] border p-12 text-center ${
                isDark
                  ? "border-white/10 bg-white/[0.06]"
                  : "border-zinc-200 bg-white/80"
              }`}
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-pink-500/15 text-pink-300">
                <Heart size={30} />
              </div>

              <h3 className="text-2xl font-black">No liked movies yet</h3>

              <p
                className={isDark ? "mt-2 text-white/50" : "mt-2 text-zinc-500"}
              >
                Like movies from the detail page and they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {user.likedMovies.map((movie) => (
                <div
                  key={movie.tmdbId}
                  onClick={() => navigate(`/movie/tmdb/${movie.tmdbId}`)}
                  className={`cursor-pointer rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                    isDark
                      ? "border border-white/10 shadow-xl shadow-black/30 hover:border-pink-400/70 hover:shadow-pink-500/20"
                      : "border border-zinc-200 bg-white shadow-md shadow-zinc-200/70 hover:border-pink-400 hover:shadow-xl"
                  }`}
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="relative mx-auto max-w-3xl mt-10">
          {/* vertical line */}
          <div className="absolute left-6 top-3 h-[calc(100%-1rem)] w-[2px] bg-gradient-to-b from-teal-400 via-white/20 to-transparent" />

          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="relative pl-16">
                {/* dot */}
                <div className="absolute left-0 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-teal-400/40 bg-teal-500/15 text-teal-300 shadow-md">
                  ★
                </div>

                {/* card */}
                <div
                  className={`rounded-2xl border px-5 py-4 transition-all duration-300 ${
                    isDark
                      ? "border-white/10 bg-white/[0.06] hover:border-teal-400/40"
                      : "border-zinc-200 bg-white hover:border-teal-400"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* LEFT */}
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold">
                        {review.movie?.title}
                      </h3>

                      <p className="mt-1 text-sm text-white/60 line-clamp-2">
                        “{review.comment}”
                      </p>

                      <p className="mt-2 text-xs text-white/35">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-1 rounded-full bg-yellow-400/10 px-3 py-1 text-sm font-bold text-yellow-400">
                      ⭐ {review.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
