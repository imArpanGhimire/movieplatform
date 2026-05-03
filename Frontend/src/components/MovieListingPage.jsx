import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import {
  Search,
  X,
  Film,
  User,
  Star,
  BookOpen,
  Layers,
  TrendingUp,
} from "lucide-react";

const TRIVIA = [
  "The Godfather was rejected 5 times before Paramount greenlit it.",
  "Parasite is the only non-English film to win Best Picture at the Oscars.",
  "Stanley Kubrick reportedly shot the same scene 127 times for The Shining.",
  "The Dark Knight's Joker makeup took 2 hours to apply every single day.",
  "Spirited Away grossed more than Titanic when adjusted for Japan's box office.",
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
  const { theme } = useTheme();

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

  const isDark = theme === "dark";

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

  // Trivia rotator
  useEffect(() => {
    const interval = setInterval(() => {
      setTriviaVisible(false);
      setTimeout(() => {
        setTriviaIndex((i) => (i + 1) % TRIVIA.length);
        setTriviaVisible(true);
      }, 400);
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

  // ── Section header ─────────────────────────────────────────────────
  function SectionHeader({ eyebrow, title, right }) {
    return (
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest ${isDark ? "text-teal-400" : "text-teal-600"}`}
          >
            <span
              className={`h-px w-4 ${isDark ? "bg-teal-400" : "bg-teal-600"}`}
            />
            {eyebrow}
          </span>
          <h2
            className={`mt-1.5 text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}
          >
            {title}
          </h2>
        </div>
        {right && (
          <p
            className={`text-sm ${isDark ? "text-white/40" : "text-zinc-400"}`}
          >
            {right}
          </p>
        )}
      </div>
    );
  }

  // ── Divider ────────────────────────────────────────────────────────
  function Divider() {
    return (
      <div className="mx-auto max-w-7xl px-6 pb-10">
        <div
          className={`h-px w-full ${isDark ? "bg-white/[0.06]" : "bg-zinc-200"}`}
        />
      </div>
    );
  }

  // ── Trivia ticker ──────────────────────────────────────────────────
  function TriviaTicker() {
    return (
      <section className="relative z-10 px-6 pb-6">
        <div className="mx-auto max-w-7xl">
          <div
            className={`flex items-center gap-4 rounded-2xl border px-6 py-4 ${
              isDark
                ? "border-white/[0.07] bg-white/[0.03]"
                : "border-zinc-200 bg-white shadow-sm"
            }`}
          >
            {/* Label badge */}
            <span
              className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                isDark
                  ? "bg-teal-500/15 text-teal-400"
                  : "bg-teal-100 text-teal-700"
              }`}
            >
              Cinema Fact
            </span>

            {/* Divider line */}
            <div
              className={`h-4 w-px shrink-0 ${isDark ? "bg-white/10" : "bg-zinc-200"}`}
            />

            {/* Rotating trivia */}
            <p
              className={`text-sm leading-snug transition-opacity duration-300 ${
                triviaVisible ? "opacity-100" : "opacity-0"
              } ${isDark ? "text-white/60" : "text-zinc-500"}`}
            >
              {TRIVIA[triviaIndex]}
            </p>

            {/* Dot indicators */}
            <div className="ml-auto flex shrink-0 items-center gap-1.5">
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
                      ? isDark
                        ? "w-4 bg-teal-400"
                        : "w-4 bg-teal-500"
                      : isDark
                        ? "w-1.5 bg-white/15"
                        : "w-1.5 bg-zinc-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── How it works ───────────────────────────────────────────────────
  function HowItWorks() {
    return (
      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="FilmVault" title="How it works" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className={`group relative rounded-2xl border p-7 transition-all duration-300 ${
                    isDark
                      ? "border-white/[0.07] bg-white/[0.03]   hover:bg-teal-500/[0.04]"
                      : "border-zinc-200 bg-white shadow-sm   hover:shadow-md"
                  }`}
                >
                  {/* Step number — faint background */}
                  <span
                    className={`absolute right-6 top-5 font-black text-5xl leading-none select-none ${
                      isDark ? "text-white/[0.04]" : "text-zinc-900/[0.05]"
                    }`}
                  >
                    {item.step}
                  </span>

                  {/* Icon */}
                  <div
                    className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300 ${
                      isDark
                        ? "bg-teal-500/10 text-teal-400 group-hover:bg-teal-500/20"
                        : "bg-teal-50 text-teal-600 group-hover:bg-teal-100"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <h3
                    className={`mb-2 text-base font-black tracking-tight ${
                      isDark ? "text-white" : "text-zinc-900"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      isDark ? "text-white/45" : "text-zinc-500"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // ── Top rated ──────────────────────────────────────────────────────
  function renderTopRatedMovies() {
    if (topRatedMovies.length === 0) return null;
    return (
      <section className="relative z-10 px-6 pb-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Top Rated" title="Greatest of all time" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {topRatedMovies.map((movie) => (
              <div
                key={movie.tmdbId}
                onClick={() => navigate(`/movie/tmdb/${movie.tmdbId}`)}
                className={`cursor-pointer rounded-2xl transition-all duration-300 hover:-translate-y-1.5 ${
                  isDark
                    ? "border border-white/[0.07] shadow-lg shadow-black/40   hover:shadow-teal-500/10"
                    : "border border-zinc-200/80 bg-white shadow-sm hover:shadow-md  "
                }`}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${isDark ? "bg-[#030711] text-white" : "bg-[#f6f7f9] text-zinc-950"}`}
    >
      {/* ── Background ambience ── */}
      {isDark && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-20%] h-[650px] w-[650px] rounded-full bg-teal-500/20 blur-[130px]" />
          <div className="absolute right-[-15%] top-[10%] h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[140px]" />
          <div className="absolute bottom-[-25%] left-1/2 h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-teal-400/10 blur-[160px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:70px_70px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030711]/70 to-[#030711]" />
        </div>
      )}
      {!isDark && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-20%] h-[600px] w-[600px] rounded-full bg-teal-200/50 blur-[120px]" />
          <div className="absolute right-[-10%] top-[15%] h-[500px] w-[500px] rounded-full bg-cyan-100/60 blur-[120px]" />
        </div>
      )}

      {/* ── Search hero ── */}
      <section className="relative z-10 px-6 pb-12 pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10">
            <p
              className={`mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${isDark ? "text-teal-400" : "text-teal-600"}`}
            >
              <span
                className={`h-px w-4 ${isDark ? "bg-teal-400" : "bg-teal-600"}`}
              />
              FilmVault Search
            </p>
            <h1
              className={`text-4xl font-black tracking-tight md:text-5xl ${isDark ? "text-white" : "text-zinc-900"}`}
            >
              Find your next watch
            </h1>
            <p
              className={`mt-3 text-sm ${isDark ? "text-white/45" : "text-zinc-500"}`}
            >
              Search by title or director — we'll do the rest.
            </p>
          </div>

          <div
            className={`rounded-2xl p-1.5 ${isDark ? "bg-white/[0.05] border border-white/[0.08] shadow-2xl shadow-black/50 backdrop-blur-xl" : "bg-white border border-zinc-200 shadow-xl shadow-zinc-200/60"}`}
          >
            <div className="flex flex-col gap-1.5 sm:flex-row">
              <div className="relative flex-1">
                <Film
                  size={15}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? "text-white/30" : "text-zinc-400"}`}
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
                  placeholder="Movie title..."
                  className={`h-12 w-full rounded-xl pl-10 pr-4 text-sm outline-none transition-colors ${isDark ? "bg-transparent text-white placeholder:text-white/25 focus:bg-white/[0.06]" : "bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:bg-zinc-100"}`}
                />
              </div>
              <div
                className={`hidden sm:flex w-px self-stretch my-1.5 ${isDark ? "bg-white/10" : "bg-zinc-200"}`}
              />
              <div className="relative flex-1">
                <User
                  size={15}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? "text-white/30" : "text-zinc-400"}`}
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
                  placeholder="Director name..."
                  className={`h-12 w-full rounded-xl pl-10 pr-4 text-sm outline-none transition-colors ${isDark ? "bg-transparent text-white placeholder:text-white/25 focus:bg-white/[0.06]" : "bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:bg-zinc-100"}`}
                />
              </div>
              <button
                onClick={title || director ? clearall : undefined}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all ${
                  title || director
                    ? isDark
                      ? "bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700"
                    : isDark
                      ? "bg-teal-500/20 text-teal-300 cursor-default"
                      : "bg-teal-50 text-teal-600 cursor-default"
                }`}
              >
                {title || director ? <X size={16} /> : <Search size={16} />}
              </button>
            </div>
          </div>

          {(title || director) && (
            <p
              className={`mt-3 text-xs ${isDark ? "text-white/30" : "text-zinc-400"}`}
            >
              Searching by{" "}
              <span
                className={`font-medium ${isDark ? "text-teal-400" : "text-teal-600"}`}
              >
                {director ? "director" : "title"}
              </span>{" "}
              — type in the other field to switch
            </p>
          )}
        </div>
      </section>

      {/* ── Default view (no search) ── */}
      {!hasSearch && !loading && (
        <>
          <Divider />
          {renderTopRatedMovies()}
          <Divider />
          <TriviaTicker />
          <div className="pb-10" />
          <Divider />
          <HowItWorks />
        </>
      )}

      {/* ── Results ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative h-10 w-10">
              <div
                className={`absolute inset-0 rounded-full border ${isDark ? "border-white/10" : "border-zinc-200"}`}
              />
              <div className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-teal-400 border-r-teal-400/50" />
            </div>
            <p
              className={`text-sm ${isDark ? "text-white/40" : "text-zinc-400"}`}
            >
              Searching...
            </p>
          </div>
        )}

        {error && (
          <div
            className={`mx-auto mt-4 max-w-md rounded-xl p-4 text-center text-sm ${isDark ? "border border-red-500/20 bg-red-950/20 text-red-300" : "border border-red-200 bg-red-50 text-red-600"}`}
          >
            {error}
          </div>
        )}

        {!loading && !error && hasSearch && (
          <>
            <SectionHeader
              eyebrow="Search Results"
              title="Movies found"
              right={
                allmovies.length > 0
                  ? `${allmovies.length} ${allmovies.length === 1 ? "result" : "results"}`
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
                      className={`cursor-pointer animate-fadeInUp rounded-2xl transition-all duration-300 hover:-translate-y-1.5 ${
                        isDark
                          ? "border border-white/[0.07] shadow-lg shadow-black/40 hover:border-white/15 hover:shadow-teal-500/10"
                          : "border border-zinc-200/80 bg-white shadow-sm hover:shadow-md hover:border-zinc-300"
                      }`}
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>

                {/* Below results */}
                <div className="mt-20">
                  <Divider />
                  <TriviaTicker />
                  <div className="pb-10" />
                  <Divider />
                  <HowItWorks />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${isDark ? "bg-white/[0.05] border border-white/10" : "bg-zinc-100 border border-zinc-200"}`}
                >
                  <Search
                    size={22}
                    className={isDark ? "text-white/25" : "text-zinc-300"}
                  />
                </div>
                <h3
                  className={`text-base font-bold ${isDark ? "text-white/70" : "text-zinc-700"}`}
                >
                  No results found
                </h3>
                <p
                  className={`mt-1.5 text-sm ${isDark ? "text-white/30" : "text-zinc-400"}`}
                >
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

export default MovieListingPage;
