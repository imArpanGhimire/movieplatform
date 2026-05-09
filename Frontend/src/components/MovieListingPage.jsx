import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";
import api from "../api/axios";
import {
  Search,
  X,
  Film,
  User,
  Star,
  Layers,
  Sparkles,
  Flame,
  ArrowRight,
  Swords,
} from "lucide-react";

const TRIVIA = [
  "The Godfather was rejected 5 times before Paramount greenlit it.",
  "Parasite is the only non-English film to win Best Picture at the Oscars.",
  "Stanley Kubrick reportedly shot the same scene 127 times for The Shining.",
  "The Dark Knight's Joker makeup took 2 hours to apply every single day.",
  "Spirited Away grossed more than Titanic at Japan's box office.",
  "Schindler's List was shot almost entirely in black and white — by choice.",
  "Over 500 takes were filmed for a single scene in Eyes Wide Shut.",
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    step: "01",
    title: "Discover",
    desc: "Search any title or director. Explore top-rated cinema from every era and country.",
  },
  {
    icon: Star,
    step: "02",
    title: "Rate & Review",
    desc: "Score every film you watch and write reviews. Build a taste profile that's uniquely yours.",
  },
  {
    icon: Layers,
    step: "03",
    title: "Build Collections",
    desc: "Curate private watchlists or share themed collections with friends.",
  },
];

const MovieListingPage = () => {
  const navigate = useNavigate();

  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [allmovies, setallmovies] = useState([]);
  const [title, settitle] = useState("");
  const [director, setdirector] = useState("");
  const [debouncedTitle, setdebouncedTitle] = useState("");
  const [debouncedDirector, setdebouncedDirector] = useState("");
  const [hasRestored, setHasRestored] = useState(false);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [triviaVisible, setTriviaVisible] = useState(true);

  useEffect(() => {
    const savedTitle = sessionStorage.getItem("filmvault_title") || "";
    const savedDirector = sessionStorage.getItem("filmvault_director") || "";
    const savedMovies = sessionStorage.getItem("filmvault_movies");
    settitle(savedTitle);
    setdirector(savedDirector);
    setdebouncedTitle(savedTitle);
    setdebouncedDirector(savedDirector);
    if (savedMovies) {
      try {
        setallmovies(JSON.parse(savedMovies));
      } catch {
        setallmovies([]);
      }
    }
    setHasRestored(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTriviaVisible(false);
      setTimeout(() => {
        setTriviaIndex((i) => (i + 1) % TRIVIA.length);
        setTriviaVisible(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setdebouncedTitle(title.trim()), 700);
    return () => clearTimeout(t);
  }, [title]);

  useEffect(() => {
    const t = setTimeout(() => setdebouncedDirector(director.trim()), 700);
    return () => clearTimeout(t);
  }, [director]);

  const searchquery = debouncedTitle || debouncedDirector;
  const hasSearch = debouncedTitle || debouncedDirector;

  useEffect(() => {
    if (!hasRestored) return;
    async function searchmovies() {
      if (!searchquery) {
        setallmovies([]);
        return;
      }
      try {
        setloading(true);
        seterror("");
        const res = debouncedDirector
          ? await api.get(
              `/tmdb/director?name=${encodeURIComponent(debouncedDirector)}`,
            )
          : await api.get(
              `/tmdb/search?query=${encodeURIComponent(debouncedTitle)}`,
            );
        setallmovies(res.data.movies || []);
      } catch (e) {
        seterror(e.response?.data?.message || "Failed to search movies");
        setallmovies([]);
      } finally {
        setloading(false);
      }
    }
    searchmovies();
  }, [debouncedTitle, debouncedDirector, hasRestored, searchquery]);

  useEffect(() => {
    if (!hasRestored) return;
    sessionStorage.setItem("filmvault_title", title);
    sessionStorage.setItem("filmvault_director", director);
    sessionStorage.setItem("filmvault_movies", JSON.stringify(allmovies));
  }, [title, director, allmovies, hasRestored]);

  useEffect(() => {
    async function fetchTopRated() {
      try {
        const res = await api.get("/tmdb/toprated");
        setTopRatedMovies(res.data.movies || []);
      } catch (e) {
        console.log(e);
      }
    }
    fetchTopRated();
  }, []);

  function clearall() {
    settitle("");
    setdirector("");
    setdebouncedTitle("");
    setdebouncedDirector("");
    setallmovies([]);
    sessionStorage.removeItem("filmvault_title");
    sessionStorage.removeItem("filmvault_director");
    sessionStorage.removeItem("filmvault_movies");
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      {/* Subtle backdrop ambience */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-teal-500/[0.04] blur-3xl" />
        <div className="absolute -right-32 top-40 h-[400px] w-[400px] rounded-full bg-teal-500/[0.03] blur-3xl" />
      </div>

      {/* ── Search hero ── */}
      <section className="relative z-10 px-6 pb-12 pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-teal-500">
              <Sparkles size={11} />
              FilmVault Search
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Find your next watch
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Search by title or director — we'll do the rest.
            </p>
          </div>

          <div className="rounded-xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-1.5 shadow-sm">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Film
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    settitle(e.target.value);
                    if (director) {
                      setdirector("");
                      setdebouncedDirector("");
                    }
                  }}
                  placeholder="Movie title"
                  className="h-11 w-full rounded-lg bg-transparent pl-9 pr-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition focus:bg-[var(--color-bg-input)]"
                />
              </div>

              <div className="hidden h-5 w-px bg-[color:var(--color-border)] sm:block" />

              <div className="relative flex-1">
                <User
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />
                <input
                  type="text"
                  value={director}
                  onChange={(e) => {
                    setdirector(e.target.value);
                    if (title) {
                      settitle("");
                      setdebouncedTitle("");
                    }
                  }}
                  placeholder="Director name"
                  className="h-11 w-full rounded-lg bg-transparent pl-9 pr-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition focus:bg-[var(--color-bg-input)]"
                />
              </div>

              <button
                onClick={title || director ? clearall : undefined}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition ${
                  title || director
                    ? "bg-[var(--color-bg-input)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                    : "bg-teal-500/10 text-teal-500"
                }`}
                aria-label={title || director ? "Clear" : "Search"}
              >
                {title || director ? <X size={15} /> : <Search size={15} />}
              </button>
            </div>
          </div>

          {(title || director) && (
            <p className="mt-3 text-xs text-[var(--color-text-muted)]">
              Searching by{" "}
              <span className="font-medium text-teal-500">
                {director ? "director" : "title"}
              </span>{" "}
              — type in the other field to switch.
            </p>
          )}
        </div>
      </section>

      {/* ── Default view (no search) ── */}
      {!hasSearch && !loading && (
        <>
          {topRatedMovies.length > 0 && (
            <section className="relative z-10 px-6 pb-16">
              <div className="mx-auto max-w-6xl">
                <SectionHeader
                  eyebrow="Top Rated"
                  title="Greatest of all time"
                  description="Critically acclaimed films loved across generations"
                />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {topRatedMovies.map((movie) => (
                    <div
                      key={movie.tmdbId}
                      onClick={() => navigate(`/movie/tmdb/${movie.tmdbId}`)}
                      className="group cursor-pointer overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/5"
                    >
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* battle movie  */}
          {/* ── Movie Battle CTA ── */}
          {/* ── Battle CTA Section ── */}
          <section className="relative z-10 px-6 pb-24">
            <div className="mx-auto max-w-6xl">
              <div className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[var(--color-bg-card)] transition duration-500 hover:border-white/[0.12]">
                {/* Ambient glow */}
                <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-500/[0.06] blur-3xl transition duration-700 group-hover:bg-teal-500/[0.12]" />

                <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-teal-500/[0.05] blur-3xl" />

                {/* Grid texture */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.015]"
                  style={{
                    backgroundImage:
                      "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />

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
                      Three handpicked matchups every day. Pick your winner,
                      compare with the community, and discover where your taste
                      lands.
                    </p>

                    {/* stats */}
                    <div className="mt-8 flex items-center gap-8 border-y border-white/[0.06] py-5">
                      <div>
                        <p className="text-2xl font-semibold tracking-tight">
                          3
                        </p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
                          Daily Battles
                        </p>
                      </div>

                      <div className="h-8 w-px bg-white/[0.06]" />

                      <div>
                        <p className="text-2xl font-semibold tracking-tight">
                          24h
                        </p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
                          To Vote
                        </p>
                      </div>

                      <div className="h-8 w-px bg-white/[0.06]" />

                      <div>
                        <p className="text-2xl font-semibold tracking-tight">
                          ∞
                        </p>
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
                  {/* RIGHT VISUAL */}
                  <div className="relative hidden h-[390px] lg:block">
                    {/* Django */}
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

                    {/* No Country For Old Men */}
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

                    {/* VS BADGE */}
                    <div className="pointer-events-none absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        <div className="absolute  inset-0 rounded-full bg-teal-400/25 blur-2xl" />

                        <div className="relative grid h-20 w-20 place-items-center rounded-full border  border-white/10 bg-[var(--color-bg-base)]/90 text-[11px] font-bold tracking-[0.25em] text-teal-500 shadow-2xl backdrop-blur-xl">
                          VS
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Divider />

          <TriviaTicker
            triviaIndex={triviaIndex}
            triviaVisible={triviaVisible}
            setTriviaIndex={setTriviaIndex}
            setTriviaVisible={setTriviaVisible}
          />

          <Divider />

          <HowItWorks />
        </>
      )}

      {/* ── Results ── */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <div className="relative h-9 w-9">
              <div className="absolute inset-0 rounded-full border-2 border-[color:var(--color-border)]" />
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-teal-500" />
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">
              Searching...
            </p>
          </div>
        )}

        {error && (
          <div className="mx-auto mt-4 max-w-md rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && hasSearch && (
          <>
            <SectionHeader
              eyebrow="Search Results"
              title="Movies found"
              meta={
                allmovies.length > 0
                  ? `${allmovies.length} ${
                      allmovies.length === 1 ? "result" : "results"
                    }`
                  : null
              }
            />

            {allmovies.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {allmovies.map((movie, index) => (
                    <div
                      key={movie.tmdbId}
                      onClick={() => navigate(`/movie/tmdb/${movie.tmdbId}`)}
                      className="group animate-fadeInUp cursor-pointer overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/5"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>

                <div className="mt-20 space-y-0">
                  <Divider />
                  <TriviaTicker
                    triviaIndex={triviaIndex}
                    triviaVisible={triviaVisible}
                    setTriviaIndex={setTriviaIndex}
                    setTriviaVisible={setTriviaVisible}
                  />
                  <Divider />
                  <HowItWorks />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)]">
                  <Search
                    size={18}
                    className="text-[var(--color-text-muted)]"
                  />
                </div>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                  No results found
                </h3>
                <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
                  Try a different search term or director name.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ─── Helpers ─────────────────────────────────────────────── */

const SectionHeader = ({ eyebrow, title, description, meta }) => (
  <div className="mb-6 flex items-end justify-between gap-4 border-b border-[color:var(--color-border)] pb-4">
    <div>
      {eyebrow && (
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-teal-500">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)] md:text-2xl">
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
  </div>
);

const Divider = () => (
  <div className="mx-auto max-w-6xl px-6 py-2">
    <div className="h-px w-full bg-[color:var(--color-border)]" />
  </div>
);

const TriviaTicker = ({
  triviaIndex,
  triviaVisible,
  setTriviaIndex,
  setTriviaVisible,
}) => (
  <section className="relative z-10 px-6 py-10">
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center gap-4 rounded-xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-5 py-4">
        <span className="shrink-0 rounded-md bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-500">
          Cinema Fact
        </span>

        <div className="hidden h-4 w-px shrink-0 bg-[color:var(--color-border)] sm:block" />

        <p
          className={`flex-1 text-sm leading-snug text-[var(--color-text-secondary)] transition-opacity duration-300 ${
            triviaVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {TRIVIA[triviaIndex]}
        </p>

        <div className="ml-auto hidden shrink-0 items-center gap-1.5 sm:flex">
          {TRIVIA.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setTriviaVisible(false);
                setTimeout(() => {
                  setTriviaIndex(i);
                  setTriviaVisible(true);
                }, 300);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === triviaIndex
                  ? "w-4 bg-teal-500"
                  : "w-1.5 bg-[color:var(--color-border-strong)] hover:bg-[var(--color-text-muted)]"
              }`}
              aria-label={`Go to trivia ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="relative z-10 px-6 pb-24 pt-10">
    <div className="mx-auto max-w-6xl">
      <SectionHeader
        eyebrow="FilmVault"
        title="How it works"
        description="Three simple steps to make this your home for cinema"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {HOW_IT_WORKS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="group relative overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-6 transition hover:border-teal-500/30"
            >
              {/* Faint step number */}
              <span className="pointer-events-none absolute right-5 top-3 select-none text-5xl font-bold leading-none text-[var(--color-text-primary)]/[0.04]">
                {item.step}
              </span>

              {/* Subtle glow on hover */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-500/0 blur-2xl transition group-hover:bg-teal-500/[0.06]" />

              <div className="relative">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500 transition group-hover:bg-teal-500/15">
                  <Icon size={17} />
                </div>

                <h3 className="mb-1.5 text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default MovieListingPage;
