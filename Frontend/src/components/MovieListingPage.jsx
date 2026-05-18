import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MovieCard from "./MovieCard";
import api from "../api/axios";
import { fetchTopRatedMovies } from "../api/queries";
import {
  Search,
  X,
  Film,
  User,
  Star,
  Layers,
  Sparkles,
  ArrowRight,
  Swords,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const TRIVIA = [
  "Parasite is the only non-English film to win Best Picture at the Oscars.",
  "Leonardo DiCaprio actually cut his hand accidentally during Django Unchained and kept acting.",
  "Interstellar's black hole visualization was so accurate it contributed to real scientific research.",
  "The Matrix popularized the famous 'bullet time' camera effect.",
  "The famous scream in many movies is actually a reused sound effect called the Wilhelm Scream.",
  "The Lord of the Rings trilogy was filmed all at once over 438 straight days.",
  "Heath Ledger stayed isolated in a hotel room for weeks to prepare for Joker.",
  "Inception's hallway fight scene used a rotating practical set instead of CGI.",
  "The iconic roar of the T-Rex in Jurassic Park was made using dogs, penguins, and elephants.",
  "The famous chestburster scene in Alien shocked the cast because they didn't know how intense it would be.",
  "The lightsaber sound in Star Wars was created using old projector and TV noises.",
  "Tom Cruise performed many of his own stunts in Mission: Impossible — including hanging off a real plane.",
  "The shower scene in Psycho has over 70 camera angles and 50 cuts.",
  "Toy Story was the first fully computer-animated feature film ever made.",
  "Christopher Nolan prefers practical effects over CGI whenever possible.",
  "Joker became the first R-rated movie to gross over $1 billion worldwide.",
  "The Dark Knight's hospital explosion scene mostly used a real building demolition.",
  "James Cameron drew Jack's sketches himself in Titanic.",
  "The original Jurassic Park CGI was so revolutionary it changed filmmaking forever.",
  "Christian Bale lost over 60 pounds for his role in The Machinist.",
  "The opening battle of Saving Private Ryan was inspired by real D-Day survivor accounts.",
  "Robert Downey Jr. hid snacks around the Avengers set because he was constantly hungry.",
  "The Blair Witch Project was made on a tiny budget but became one of the most profitable films ever.",
  "Keanu Reeves trained intensely in martial arts and tactical shooting for John Wick.",
  "The original Star Wars movie was considered a huge risk before becoming a global phenomenon.",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    label: "Discover",
    title: "Discover",
    desc: "Search any title or director. Explore top-rated cinema from every era and country.",
    tag: "Start browsing",
  },
  {
    step: "02",
    label: "Rate & Review",
    title: "Rate & Review",
    desc: "Score every film you watch and write reviews. Build a taste profile that's uniquely yours.",
    tag: "Build your taste",
  },
  {
    step: "03",
    label: "Collect",
    title: "Build Collections",
    desc: "Curate private watchlists or share themed collections with friends.",
    tag: "Start a list",
  },
];

const PAGE_SIZE = 16;

const searchMovies = async ({ queryKey }) => {
  const [, { title, director }] = queryKey;
  const res = director
    ? await api.get(`/tmdb/director?name=${encodeURIComponent(director)}`)
    : await api.get(`/tmdb/search?query=${encodeURIComponent(title)}`);
  return res.data.movies || [];
};

const MovieListingPage = () => {
  const navigate = useNavigate();

  const [title, settitle] = useState("");
  const [director, setdirector] = useState("");
  const [debouncedTitle, setdebouncedTitle] = useState("");
  const [debouncedDirector, setdebouncedDirector] = useState("");
  const [hasRestored, setHasRestored] = useState(false);
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [triviaVisible, setTriviaVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);

  useEffect(() => {
    const savedTitle = sessionStorage.getItem("filmvault_title") || "";
    const savedDirector = sessionStorage.getItem("filmvault_director") || "";
    settitle(savedTitle);
    setdirector(savedDirector);
    setdebouncedTitle(savedTitle);
    setdebouncedDirector(savedDirector);
    setHasRestored(true);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTriviaVisible(false);
      setTimeout(() => {
        setTriviaIndex((i) => (i + 1) % TRIVIA.length);
        setTriviaVisible(true);
      }, 300);
    }, 10000);
    return () => clearTimeout(timeout);
  }, [triviaIndex]);

  useEffect(() => {
    const t = setTimeout(() => setdebouncedTitle(title.trim()), 700);
    return () => clearTimeout(t);
  }, [title]);

  useEffect(() => {
    const t = setTimeout(() => setdebouncedDirector(director.trim()), 700);
    return () => clearTimeout(t);
  }, [director]);

  useEffect(() => {
    if (!hasRestored) return;
    sessionStorage.setItem("filmvault_title", title);
    sessionStorage.setItem("filmvault_director", director);
  }, [title, director, hasRestored]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedTitle, debouncedDirector]);

  const hasSearch = Boolean(debouncedTitle || debouncedDirector);

  const { data: topRatedMovies = [], isLoading: topRatedLoading } = useQuery({
    queryKey: ["top-rated-movies"],
    queryFn: fetchTopRatedMovies,
    staleTime: 1000 * 60 * 15,
  });

  const {
    data: allmovies = [],
    isLoading: searchLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "search-movies",
      { title: debouncedTitle, director: debouncedDirector },
    ],
    queryFn: searchMovies,
    enabled: hasRestored && hasSearch,
    staleTime: 1000 * 60 * 10,
  });

  const topRatedTotalPages = Math.ceil(topRatedMovies.length / PAGE_SIZE);
  const paginatedTopRated = topRatedMovies.slice(
    (topRatedPage - 1) * PAGE_SIZE,
    topRatedPage * PAGE_SIZE,
  );

  const totalPages = Math.ceil(allmovies.length / PAGE_SIZE);
  const paginatedMovies = allmovies.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const loading = searchLoading;
  const errorMessage =
    isError && (error?.response?.data?.message || "Failed to search movies");

  function clearall() {
    settitle("");
    setdirector("");
    setdebouncedTitle("");
    setdebouncedDirector("");
    sessionStorage.removeItem("filmvault_title");
    sessionStorage.removeItem("filmvault_director");
  }

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid-pattern opacity-[0.03]" />

      {/* ── Search ── */}
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

      {/* ── No search state ── */}
      {!hasSearch && !loading && (
        <>
          {topRatedLoading && (
            <div className="relative z-10 flex justify-center px-6 pb-16">
              <p className="text-sm text-[var(--color-text-muted)]">
                Loading top rated movies...
              </p>
            </div>
          )}

          {!topRatedLoading && topRatedMovies.length > 0 && (
            <section className="relative z-10 px-6 pb-16">
              <div className="mx-auto max-w-6xl">
                <SectionHeader
                  eyebrow="Top Rated"
                  title="People love these"
                  description="Critically acclaimed films loved across generations"
                />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {paginatedTopRated.map((movie) => (
                    <div
                      key={movie.tmdbId}
                      onClick={() => navigate(`/movie/tmdb/${movie.tmdbId}`)}
                      className="group cursor-pointer overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/5"
                    >
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
                {topRatedMovies.length > 0 && (
                  <Pagination
                    currentPage={topRatedPage}
                    totalPages={Math.max(topRatedTotalPages, 1)}
                    totalResults={topRatedMovies.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={(page) => {
                      setTopRatedPage(page);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                )}
              </div>
            </section>
          )}

          <section className="relative z-10 px-6 pb-24">
            <div className="mx-auto max-w-6xl">
              <div className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[var(--color-bg-card)] transition duration-500 hover:border-white/[0.12]">
                <div className="relative grid items-center gap-14 p-10 lg:grid-cols-[1fr_480px] lg:p-14">
                  <div>
                    <div className="mb-5 inline-flex items-center gap-2 rounded border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-400">
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
                      className="group/btn mt-8 inline-flex items-center gap-2 rounded bg-teal-400 px-6 py-3 text-sm font-semibold text-black transition duration-300 hover:-translate-y-1 hover:bg-teal-300"
                    >
                      Enter today's battles
                      <ArrowRight
                        size={15}
                        className="transition duration-300 group-hover/btn:translate-x-1"
                      />
                    </button>
                  </div>

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

      {/* ── Search results ── */}
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

        {errorMessage && (
          <div className="mx-auto mt-4 max-w-md rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-center text-sm text-red-400">
            {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && hasSearch && (
          <>
            <SectionHeader
              eyebrow="Search Results"
              title="Movies found"
              meta={
                allmovies.length > 0
                  ? `${allmovies.length} ${allmovies.length === 1 ? "result" : "results"}`
                  : null
              }
            />

            {allmovies.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {paginatedMovies.map((movie, index) => (
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

                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.max(totalPages, 1)}
                  totalResults={allmovies.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                />

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

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination = ({
  currentPage,
  totalPages,
  totalResults,
  pageSize,
  onPageChange,
}) => {
  const startResult = (currentPage - 1) * pageSize + 1;
  const endResult = Math.min(currentPage * pageSize, totalResults);

  const getPageNumbers = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }
    return pages;
  };

  return (
    <div className="mt-10 flex flex-col items-center gap-4">
      <p className="text-xs text-[var(--color-text-muted)]">
        Showing{" "}
        <span className="font-medium text-[var(--color-text-secondary)]">
          {startResult}–{endResult}
        </span>{" "}
        of{" "}
        <span className="font-medium text-[var(--color-text-secondary)]">
          {totalResults}
        </span>{" "}
        results
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] transition-all duration-200 hover:border-teal-500/40 hover:bg-[var(--color-bg-elevated)] hover:text-teal-400 disabled:pointer-events-none disabled:opacity-30"
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="flex h-9 w-9 items-center justify-center text-xs text-[var(--color-text-muted)]"
              >
                ···
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                  page === currentPage
                    ? "bg-teal-500 text-black shadow-[0_0_16px_rgba(20,184,166,0.35)]"
                    : "border border-[color:var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-teal-500/40 hover:bg-[var(--color-bg-elevated)] hover:text-teal-400"
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] transition-all duration-200 hover:border-teal-500/40 hover:bg-[var(--color-bg-elevated)] hover:text-teal-400 disabled:pointer-events-none disabled:opacity-30"
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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
        <div className="ml-auto hidden shrink-0 items-center gap-2 sm:flex">
          {[0, 1, 2, 3, 4].map((dot) => {
            const activeDot = triviaIndex % 5;
            return (
              <button
                key={dot}
                onClick={() => {
                  const nextIndex = Math.floor(triviaIndex / 5) * 5 + dot;
                  setTriviaVisible(false);
                  setTimeout(() => {
                    setTriviaIndex(nextIndex % TRIVIA.length);
                    setTriviaVisible(true);
                  }, 300);
                }}
                className={`rounded-full transition-all duration-500 ${
                  dot === activeDot
                    ? "h-2 w-6 bg-teal-500"
                    : "h-2 w-2 bg-[color:var(--color-border-strong)] hover:bg-[var(--color-text-muted)]"
                }`}
                aria-label={`Go to trivia ${dot + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="relative z-10 px-6 pb-24 pt-16">
    <div className="mx-auto max-w-5xl">
      <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
        FilmVault
      </p>
      <h2 className="mb-3  text-[38px] font-normal leading-[1.15] text-[var(--color-text-primary)]">
        How it <em className="italic text-[var(--color-text-muted)]">works</em>
      </h2>
      <p className="mb-14 max-w-sm text-sm font-light leading-relaxed text-[var(--color-text-muted)]">
        Three simple steps to make this your home for cinema.
      </p>

      <div className="flex flex-col">
        {HOW_IT_WORKS.map((item) => (
          <div
            key={item.step}
            className="group grid grid-cols-[80px_1fr] gap-x-8 border-t border-[var(--color-border)] py-8 last:border-b"
          >
            <span className="-mt-1.5 select-none  text-[56px] font-normal leading-none text-[var(--color-border)] transition-colors duration-300 group-hover:text-[var(--color-text-muted)]">
              {item.step}
            </span>
            <div className="pt-1.5">
              <p className="mb-1.5 flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {item.label}
                <span className="inline-block h-px w-5 bg-[var(--color-border)]" />
              </p>
              <h3 className="mb-2 text-[20px] font-normal leading-snug text-[var(--color-text-primary)]">
                {item.title}
              </h3>
              <p className="max-w-[440px] text-[13.5px] font-light leading-[1.7] text-[var(--color-text-muted)]">
                {item.desc}
              </p>
              <span className="mt-3.5 inline-block rounded-sm border border-[var(--color-border)] px-2.5 py-0.5 text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                {item.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default MovieListingPage;
