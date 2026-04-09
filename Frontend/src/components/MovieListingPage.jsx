import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";
import api from "../api/axios";

const MovieListingPage = () => {
  const navigate = useNavigate();

  const [loading, setloading] = useState(true);
  const [error, seterror] = useState("");
  const [allmovies, setallmovies] = useState([]);
  const [genre, setgenre] = useState("all");
  const [director, setdirector] = useState("all");
  const [title, settitle] = useState("");
  const [debouncedTitle, setdebouncedTitle] = useState("all");
  const [debouncedDirector, setdebouncedDirector] = useState("all");

  // Debounce title input
  useEffect(() => {
    const titletimer = setTimeout(() => {
      setdebouncedTitle(title.trim() === "" ? "all" : title);
    }, 300);

    return () => clearTimeout(titletimer);
  }, [title]);

  // Debounce director input
  useEffect(() => {
    const directortimer = setTimeout(() => {
      setdebouncedDirector(director.trim() === "" ? "all" : director);
    }, 300);

    return () => clearTimeout(directortimer);
  }, [director]);

  // Fetch movies when debounced values change
  useEffect(() => {
    async function getmovies() {
      try {
        setloading(true);
        seterror("");

        const res = await api.get(
          `/movie/getmovies/${genre}/${debouncedDirector}/${debouncedTitle}`,
        );
        setallmovies(res.data.movies || []);
        // console.log("the movies are", res.data.movies);
      } catch (e) {
        console.log(e);
        seterror(e.response?.data?.message || "Failed to fetch movies");
        setallmovies([]);
      } finally {
        setloading(false);
      }
    }

    getmovies();
  }, [genre, debouncedDirector, debouncedTitle]);

  async function handlelogout() {
    try {
      await api.post("/auth/logout");
      navigate("/login");
    } catch (e) {
      console.log(e);
    }
  }

  function clearfilter() {
    setgenre("all");
    setdirector("all");
    settitle("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-x-hidden text-white px-6 py-10">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-teal-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1
            className="text-3xl font-black text-teal-400 cursor-pointer  duration-300 font-swash"
            onClick={() => navigate("/movies")}
          >
            FilmVault
          </h1>
          <button
            onClick={handlelogout}
            className="px-6 py-2.5 text-white font-semibold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg shadow-lg  duration-300 text-sm  backdrop-blur-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto pt-28 relative z-10">
        {/* Header */}
        <div className="mb-16 animate-fadeInDown">
          <p className="text-sm uppercase tracking-[0.25em] text-teal-400 mb-3 font-swash">
            Discover Films
          </p>
          <h1 className="text-6xl font-black leading-tight mb-4 text-white font-swash">
            Cinematic Gems Await
          </h1>
          <p className="text-lg text-zinc-400 font-swash">
            Explore a curated collection of films. Filter by genre, director, or
            title.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 mb-12 shadow-2xl hover:bg-zinc-900/80 transition-all duration-300 animate-fadeInUp">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search by Title */}
            <div className="group">
              <label className="block text-xs font-bold text-zinc-300 mb-3 uppercase tracking-wider">
                Search Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => settitle(e.target.value)}
                  placeholder="e.g., Inception..."
                  className="w-full bg-zinc-800/70 border border-zinc-700 rounded-lg px-5 py-3.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-teal-500/50 focus:bg-zinc-800 transition-all duration-300 text-sm font-medium backdrop-blur-sm hover:border-zinc-600"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-500/0 to-cyan-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"></div>
              </div>
            </div>

            {/* Genre Filter */}
            <div className="group">
              <label className="block text-xs font-bold text-zinc-300 mb-3 uppercase tracking-wider">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setgenre(e.target.value)}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-lg px-5 py-3.5 text-zinc-100 focus:outline-none focus:border-teal-500/50 focus:bg-zinc-800 transition-all duration-300 text-sm font-medium backdrop-blur-sm hover:border-zinc-600 cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a1a5ab' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="all">All Genres</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Crime">Crime</option>
                <option value="Thriller">Thriller</option>
                <option value="Drama">Drama</option>
              </select>
            </div>

            {/* Director Filter */}
            <div className="group">
              <label className="block text-xs font-bold text-zinc-300 mb-3 uppercase tracking-wider">
                Director
              </label>
              <input
                value={director === "all" ? "" : director}
                onChange={(e) => setdirector(e.target.value || "all")}
                type="text"
                placeholder="e.g., Nolan..."
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-lg px-5 py-3.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-teal-500/50 focus:bg-zinc-800 transition-all duration-300 text-sm font-medium backdrop-blur-sm hover:border-zinc-600"
              />
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearfilter}
                className="w-full px-6 py-3.5 bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-all duration-300 text-sm font-bold uppercase tracking-wider border border-zinc-700 hover:border-zinc-600 backdrop-blur-sm hover:shadow-lg hover:shadow-teal-500/10"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-zinc-700"></div>
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-500 border-r-cyan-500 animate-spin"></div>
            </div>
            <p className="text-zinc-400 font-medium">Loading films...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-zinc-900/80 border border-red-500/20 rounded-2xl p-6 mb-8 backdrop-blur-sm animate-fadeInUp">
            <p className="text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <p className="text-zinc-400 font-light">
                <span className="text-teal-400 font-semibold">
                  {allmovies.length}
                </span>{" "}
                films found
              </p>
            </div>

            {allmovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                {allmovies.map((movie, index) => (
                  <div
                    key={movie._id}
                    onClick={() => navigate(`/movie/${movie._id}`)}
                    className="group cursor-pointer animate-fadeInUp"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-teal-500/20 border border-zinc-800/50 group-hover:border-teal-500/30">
                      <MovieCard movie={movie} />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-zinc-400 font-medium">
                  No films match your filters
                </p>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!loading && !error && allmovies.length > 0 && (
          <div className="flex justify-center items-center gap-3 mb-8 animate-fadeInUp">
            <button className="px-6 py-2.5 bg-zinc-800/70 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-300 font-medium backdrop-blur-sm">
              ← Previous
            </button>
            <div className="flex gap-2">
              <button className="w-11 h-11 rounded-lg bg-teal-500 text-zinc-950 font-bold hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300">
                1
              </button>
              <button className="w-11 h-11 rounded-lg bg-zinc-800/70 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-300 font-medium backdrop-blur-sm">
                2
              </button>
              <button className="w-11 h-11 rounded-lg bg-zinc-800/70 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-300 font-medium backdrop-blur-sm">
                3
              </button>
            </div>
            <button className="px-6 py-2.5 bg-zinc-800/70 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-300 font-medium backdrop-blur-sm">
              Next →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default MovieListingPage;
