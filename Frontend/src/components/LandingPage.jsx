import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [movies, setMovies] = useState([]);

  useEffect(() => {
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

  function Poster({ movie }) {
    return (
      <div className="relative w-[150px] shrink-0 overflow-hidden rounded-xl bg-black shadow-xl shadow-black/40">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-[225px] w-full object-cover"
        />
        <span className="absolute right-2 top-2 rounded-md bg-white px-2 py-1 text-sm font-black text-green-600">
          {movie.rating ? Math.round(movie.rating * 10) : "★"}
        </span>
      </div>
    );
  }

  function MarqueeColumn({ movies, direction = "up", padding = "" }) {
    return (
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
  }

  const features = [
    {
      title: "Recommendations",
      desc: "Get super accurate recommendations based on your ratings from the users whose taste is closest to yours.",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="w-5 h-5"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      title: "Rate & Review",
      desc: "Rate everything you watch to build your taste profile, then heap praise or throw shade with reviews.",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="w-5 h-5"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
    },
    {
      title: "Track",
      desc: "Keep track of what you watch and when you've seen it with your own personal Watch Journal.",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="w-5 h-5"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      title: "Collections",
      desc: "Create your own private collections or collaborate on shared lists with friends on any topic or genre.",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="w-5 h-5"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  const collections = [
    {
      title: "Female Directors",
      count: "11,795 titles",
      rated: "302 rated",
      by: "djross",
      gradient: "from-rose-900/80 to-purple-900/60",
      accent: "bg-rose-500",
    },
    {
      title: "Existential films",
      count: "111 titles",
      rated: "14 rated",
      by: "frederic_g54",
      gradient: "from-slate-900/80 to-teal-900/60",
      accent: "bg-teal-500",
    },
    {
      title: "Time Travel",
      count: "340 titles",
      rated: "7 rated",
      by: "mpowell",
      gradient: "from-indigo-900/80 to-blue-900/60",
      accent: "bg-indigo-500",
    },
  ];

  return (
    <div
      className={`relative min-h-screen overflow-hidden ${
        isDark ? "bg-[#101116] text-white" : "bg-[#f6f7f9] text-zinc-950"
      }`}
    >
      {/* ── Hero ── */}
      <section className="relative min-h-screen overflow-hidden px-6 pt-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative z-20">
            <h1
              className={`text-6xl font-black leading-[0.95] tracking-tight md:text-8xl ${
                isDark ? "text-white" : "text-zinc-950"
              }`}
            >
              Stop scrolling,
              <br />
              start watching
            </h1>

            <p
              className={`mt-7 max-w-xl text-lg md:text-xl ${
                isDark ? "text-white/70" : "text-zinc-600"
              }`}
            >
              Personalized movie recommendations, top-rated cinema, and better
              movie discovery in one place.
            </p>

            <button
              onClick={() => navigate("/movies")}
              className="mt-10 rounded-xl bg-violet-600 px-10 py-5 text-2xl font-black text-white transition hover:bg-violet-500"
            >
              Get started for free!
            </button>

            <p
              className={`mt-24 text-sm ${
                isDark ? "text-white/30" : "text-zinc-400"
              }`}
            >
              Explore top-rated movies and build your personal review vault.
            </p>
          </div>

          <div className="relative hidden h-[760px] gap-6 overflow-hidden lg:flex">
            <MarqueeColumn movies={col1Movies} direction="up" />
            <MarqueeColumn
              movies={col2Movies}
              direction="down"
              padding="pt-20"
            />
            <MarqueeColumn movies={col3Movies} direction="up" padding="pt-10" />

            <div
              className={`pointer-events-none absolute inset-0 ${
                isDark
                  ? "bg-gradient-to-r from-[#101116] via-[#101116]/20 to-transparent"
                  : "bg-gradient-to-r from-[#f6f7f9] via-[#f6f7f9]/20 to-transparent"
              }`}
            />
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-32 ${
                isDark
                  ? "bg-gradient-to-b from-[#101116] to-transparent"
                  : "bg-gradient-to-b from-[#f6f7f9] to-transparent"
              }`}
            />
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-32 ${
                isDark
                  ? "bg-gradient-to-t from-[#101116] to-transparent"
                  : "bg-gradient-to-t from-[#f6f7f9] to-transparent"
              }`}
            />
          </div>
        </div>
      </section>

      {/* ── Feature Cards Strip ── */}
      <section
        className={`border-y ${isDark ? "border-white/10" : "border-zinc-200"}`}
      >
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {features.map((feat) => (
            <div
              key={feat.title}
              className={`flex flex-col gap-4 px-8 py-10 ${
                isDark ? "bg-[#101116]" : "bg-[#f6f7f9]"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDark
                    ? "bg-violet-600/20 text-violet-400"
                    : "bg-violet-100 text-violet-600"
                }`}
              >
                {feat.icon}
              </div>
              <h3
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                {feat.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-white/50" : "text-zinc-500"
                }`}
              >
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Track & Collections ── */}
      <section className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-0 py-24 px-6">
        {/* Left: copy */}
        <div className="flex flex-col justify-center pr-0 lg:pr-16">
          <h2
            className={`text-4xl md:text-5xl font-black leading-tight tracking-tight ${
              isDark ? "text-white" : "text-zinc-950"
            }`}
          >
            Track your history and create unlimited collections
          </h2>

          <p
            className={`mt-5 text-base leading-relaxed max-w-md ${
              isDark ? "text-white/55" : "text-zinc-500"
            }`}
          >
            FilmVault is full of features to keep your recommendations
            organized, with a variety of ways to discover even more titles.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {[
              "Keep a Watchlist for upcoming movie nights",
              "Track what you've been watching with your own Watch Journal",
              "Browse public collections and discover new niche interests",
              "Build private lists or collaborate with friends to make unique collections",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-white/70" : "text-zinc-600"
                  }`}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/movies")}
            className={`mt-10 w-fit border rounded-xl px-7 py-3 text-sm font-bold transition ${
              isDark
                ? "border-violet-500 text-violet-400 hover:bg-violet-600 hover:text-white hover:border-violet-600"
                : "border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white"
            }`}
          >
            Start a collection
          </button>
        </div>

        {/* Right: collection cards */}
        <div className="flex flex-col gap-4 mt-12 lg:mt-0 justify-center">
          {collections.map((col, i) => (
            <div
              key={col.title}
              className={`relative rounded-2xl overflow-hidden h-[110px] cursor-pointer group transition-transform hover:-translate-y-1 ${
                isDark ? "bg-zinc-900" : "bg-zinc-200"
              }`}
            >
              {/* Faux poster strip */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${col.gradient} opacity-80`}
              />

              {/* Noise texture overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                  backgroundSize: "150px",
                }}
              />

              {/* Bookmark count badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-md px-2 py-1">
                <svg
                  className="w-3 h-3 text-white/70"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span className="text-xs font-bold text-white/80">
                  {60 + i * 17}
                </span>
              </div>

              {/* Card content */}
              <div className="absolute bottom-0 inset-x-0 px-5 pb-4">
                <h4 className="text-white font-black text-lg leading-tight drop-shadow">
                  {col.title}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-white/60">{col.count}</span>
                  <span className="text-white/30 text-xs">|</span>
                  <span className="text-xs text-white/60">{col.rated}</span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <span
                      className={`w-5 h-5 rounded-full ${col.accent} text-white text-[9px] font-black flex items-center justify-center`}
                    >
                      {col.by[0].toUpperCase()}
                    </span>
                    <span className="text-xs text-white/50">By {col.by}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
