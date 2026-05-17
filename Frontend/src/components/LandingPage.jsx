import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  ArrowRight,
  BookmarkCheck,
  Check,
  Layers,
  Sparkles,
  Star,
  Calendar,
  TrendingUp,
  Swords,
} from "lucide-react";

import ctaBg from "../images/cta-bg.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies([]);
    async function fetchTopRated() {
      try {
        const res = await api.get("/tmdb/toprated");
        setMovies(res.data.movies || []);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTopRated();
  }, []);

  const col1Movies = movies.filter((_, index) => index % 4 === 0);
  const col2Movies = movies.filter((_, index) => index % 4 === 1);
  const col3Movies = movies.filter((_, index) => index % 4 === 2);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      {/* Dot grid background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid-pattern opacity-[0.03]" />

      {/* ── Hero ── */}
      <section className="relative z-10 px-6 pt-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative">
            <p className="mb-4 inline-flex items-center gap-2 rounded border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-teal-500">
              {/* <Sparkles size={11} /> */}
              Built for cinephiles
            </p>

            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Stop scrolling,
              <br />
              <span className="text-[var(--color-text-secondary)]">
                start watching.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--color-text-muted)]">
              Personalized recommendations, top-rated cinema, and better movie
              discovery — all in one place.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/register")}
                className="group inline-flex items-center gap-2 rounded-lg bg-[var(--color-text-primary)] px-5 py-3 text-sm font-medium text-[var(--color-bg-base)] transition hover:opacity-90"
              >
                Get started — it's free
                <ArrowRight
                  size={14}
                  className="transition group-hover:translate-x-0.5"
                />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-5 py-3 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
              >
                Sign in
              </button>
            </div>

            {/* Trust strip */}
            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[color:var(--color-border)] pt-6 text-sm text-[var(--color-text-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <Star
                  size={13}
                  className="text-amber-500"
                  fill="currentColor"
                />
                10,000+ rated films
              </span>
              <span className="text-[var(--color-text-muted)]/40">•</span>
              <span className="inline-flex items-center gap-1.5">
                <BookmarkCheck size={13} />
                Curated collections
              </span>
              <span className="text-[var(--color-text-muted)]/40">•</span>
              <span className="inline-flex items-center gap-1.5">
                <TrendingUp size={13} />
                Personal taste profile
              </span>
            </div>
          </div>

          {/* Posters marquee */}
          <div
            key={movies.length}
            className="relative hidden h-[640px] gap-5 overflow-hidden lg:flex"
          >
            <MarqueeColumn movies={col1Movies} direction="up" />
            <MarqueeColumn
              movies={col2Movies}
              direction="down"
              padding="pt-16"
            />
            <MarqueeColumn movies={col3Movies} direction="up" padding="pt-8" />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--color-bg-base)] via-[var(--color-bg-base)]/30 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--color-bg-base)] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--color-bg-base)] to-transparent" />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      {/* ── Features ── */}
      <section className="relative z-10 px-6 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-0 flex items-end justify-between border-b border-[color:var(--color-border)] pb-8">
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-teal-500">
                Features
              </p>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Everything you need,{" "}
                <span className="text-[var(--color-text-muted)]">
                  nothing you don't
                </span>
              </h2>
            </div>
            <p className="hidden max-w-xs text-right text-sm text-[var(--color-text-muted)] md:block">
              A focused toolkit for tracking, rating, and discovering films.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="group relative bg-[var(--color-bg-base)] p-6 transition duration-300 hover:bg-[var(--color-bg-card)]/70"
                >
                  <span className="mb-3 block text-[11px] font-medium tabular-nums text-[var(--color-text-muted)]">
                    0{i + 1}
                  </span>
                  <div className="mb-5 text-teal-500">
                    <Icon size={20} />
                  </div>
                  <h3 className="mb-2 text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
                    {feat.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {feat.desc}
                  </p>
                  <div className="mt-6 h-px w-0 bg-teal-500/40 transition-all duration-500 group-hover:w-full" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Collections section ── */}
      <section className="relative z-10 px-6 py-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-teal-500">
              Collections
            </p>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
              Track your history. Build endless collections.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--color-text-muted)]">
              FilmVault keeps your taste organized — with thoughtful tools to
              discover what's next.
            </p>

            <ul className="mt-8 space-y-3">
              {BENEFITS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-teal-500">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                  <span className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/movies")}
              className="mt-10 inline-flex items-center gap-2 rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
            >
              Start a collection
              <ArrowRight size={13} />
            </button>
          </div>
          <div className="relative hidden lg:flex flex-col h-[480px]">
            {THEME_CARDS.map((card, i) => {
              const cardMovies = movies.slice(
                card.movieSlice[0],
                card.movieSlice[1],
              );
              return (
                <div
                  key={card.title}
                  className="relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] flex-1 cursor-pointer group transition-all duration-500 hover:flex-[2]"
                  style={{
                    zIndex: i,
                    marginTop: i === 0 ? "0px" : "-32px",
                    rotate: `${(i - 1) * 2}deg`,
                    transformOrigin: "left center",
                  }}
                >
                  <div className="absolute inset-0 flex">
                    {cardMovies.map((movie, j) => (
                      <img
                        key={j}
                        src={movie.poster}
                        alt=""
                        className="h-full flex-1 object-cover"
                      />
                    ))}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div
                      className={`mb-1.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${card.badgeClass}`}
                    >
                      {card.badge}
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/60">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Battle CTA ── */}
      <section className="relative z-10 px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[var(--color-bg-card)] transition duration-500 hover:border-white/[0.12]">
            <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-500/[0.06] blur-3xl transition duration-700 group-hover:bg-teal-500/[0.12]" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-teal-500/[0.05] blur-3xl" />

            <div className="relative grid items-center gap-14 p-10 lg:grid-cols-[1fr_480px] lg:p-14">
              {/* LEFT */}
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-400">
                  <Swords size={12} strokeWidth={2.5} />
                  Daily Feature
                </div>

                <h2 className="max-w-xl text-4xl font-semibold leading-[1.02] tracking-tight md:text-5xl">
                  Two films enter.
                  <br />
                  <span className="text-[var(--color-text-secondary)]">
                    One stays with you.
                  </span>
                </h2>

                <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--color-text-muted)]">
                  Three handpicked matchups every day. Pick your winner, compare
                  with the community, and discover where your taste lands.
                </p>

                <div className="mt-8 flex items-center gap-8 border-y border-white/[0.06] py-5">
                  <div>
                    <p className="text-2xl font-semibold tracking-tight">3</p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
                      Daily Battles
                    </p>
                  </div>

                  <div className="h-8 w-px bg-white/[0.06]" />

                  <div>
                    <p className="text-2xl font-semibold tracking-tight">24h</p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
                      To Vote
                    </p>
                  </div>

                  <div className="h-8 w-px bg-white/[0.06]" />

                  <div>
                    <p className="text-2xl font-semibold tracking-tight">∞</p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
                      Debates
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/battle")}
                  className="group/btn mt-8 inline-flex items-center gap-2 rounded-full bg-teal-400 px-6 py-3 text-sm font-semibold text-black transition duration-300 hover:-translate-y-1 hover:bg-teal-300"
                >
                  Enter today's battles
                  <ArrowRight
                    size={15}
                    className="transition duration-300 group-hover/btn:translate-x-1"
                  />
                </button>
              </div>

              {/* RIGHT VISUAL */}
              <div className="relative hidden h-[390px] lg:block">
                <div className="absolute left-3 top-1/2 z-10 w-[210px] -translate-y-1/2 rotate-[-7deg] transition-all duration-500 hover:z-40 hover:-translate-x-3 hover:-translate-y-[58%] hover:rotate-[-11deg]">
                  <div className="overflow-hidden rounded-[1.7rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                    <img
                      src="https://image.tmdb.org/t/p/w500/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg"
                      alt="Django Unchained"
                      className="h-[320px] w-full object-cover transition duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-[10px] uppercase tracking-wider text-white/60">
                        2012 · Western
                      </p>
                      <p className="mt-1 text-lg font-semibold leading-tight text-white">
                        Django Unchained
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute right-3 top-1/2 z-10 w-[210px] -translate-y-1/2 rotate-[7deg] transition-all duration-500 hover:z-40 hover:translate-x-3 hover:-translate-y-[58%] hover:rotate-[11deg]">
                  <div className="overflow-hidden rounded-[1.7rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                    <img
                      src="https://image.tmdb.org/t/p/w500/bj1v6YKF8yHqA489VFfnQvOJpnc.jpg"
                      alt="No Country for Old Men"
                      className="h-[320px] w-full object-cover transition duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-[10px] uppercase tracking-wider text-white/60">
                        2007 · Thriller
                      </p>
                      <p className="mt-1 text-lg font-semibold leading-tight text-white">
                        No Country for Old Men
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-teal-400/25 blur-2xl" />
                    <div className="relative grid h-20 w-20 place-items-center rounded-full border border-white/10 bg-[var(--color-bg-base)]/90 text-[11px] font-bold tracking-[0.25em] text-teal-500 shadow-2xl backdrop-blur-xl">
                      VS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-border)]">
            <img
              src={ctaBg}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-70 blur-xs scale-105"
            />
            <div className="absolute inset-0 bg-[var(--color-bg-base)]/60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.12),transparent_20%)]" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--color-bg-base)]/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-bg-base)]/80 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--color-bg-base)]/80 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--color-bg-base)]/80 to-transparent" />

            <div className="relative px-8 py-16 text-center md:px-16 md:py-20">
              <div className="relative mx-auto max-w-xl">
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Ready to find your next favorite film?
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-text-muted)]">
                  Join FilmVault today and turn endless scrolling into endless
                  discovery.
                </p>
                <button
                  onClick={() => navigate("/register")}
                  className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--color-text-primary)] px-6 py-3 text-sm font-medium text-[var(--color-bg-base)] transition hover:opacity-90"
                >
                  Create your account
                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ─── Helpers & data ──────────────────────────────────── */

const Poster = ({ movie }) => (
  <div className="relative w-[140px] shrink-0 overflow-hidden rounded-lg bg-black shadow-xl shadow-black/30 ring-1 ring-white/[0.06]">
    <img
      src={movie.poster}
      alt={movie.title}
      className="h-[210px] w-full object-cover"
    />
    {movie.rating && (
      <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
        <Star size={9} className="text-amber-400" fill="currentColor" />
        {movie.rating.toFixed(1)}
      </span>
    )}
  </div>
);

const MarqueeColumn = ({ movies, direction = "up", padding = "" }) => (
  <div className={padding}>
    <div
      className={`poster-col ${
        direction === "up" ? "animate-up" : "animate-down"
      }`}
    >
      {movies.concat(movies).map((movie, index) => (
        <Poster movie={movie} key={`${movie.tmdbId}-${index}`} />
      ))}
    </div>
  </div>
);

const FEATURES = [
  {
    title: "Recommendations",
    desc: "Accurate suggestions tuned to your ratings and the people whose taste matches yours.",
    icon: Sparkles,
  },
  {
    title: "Rate & Review",
    desc: "Score every film you watch and write reviews that build your personal taste profile.",
    icon: Star,
  },
  {
    title: "Watch Journal",
    desc: "Track everything you've seen and when, with a clean log of your viewing history.",
    icon: Calendar,
  },
  {
    title: "Collections",
    desc: "Curate private watchlists or collaborate on shared themed lists with friends.",
    icon: Layers,
  },
];

const BENEFITS = [
  "Keep a watchlist for upcoming movie nights",
  "Track what you've watched in your own Watch Journal",
  "Browse public collections and discover niche interests",
  "Build private lists or collaborate with friends",
];

const THEME_CARDS = [
  {
    title: "Critically Acclaimed",
    desc: "Films that changed cinema forever",
    badge: "All time greats",
    badgeClass: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    movieSlice: [0, 4],
  },
  {
    title: "Hidden Masterpieces",
    desc: "Underseen films worth every minute",
    badge: "Cult classics",
    badgeClass: "bg-teal-500/20 text-teal-400 border border-teal-500/30",
    movieSlice: [4, 8],
  },
  {
    title: "Director's Vision",
    desc: "Cinema as pure artistic expression",
    badge: "Auteur picks",
    badgeClass: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    movieSlice: [8, 12],
  },
];

export default LandingPage;
