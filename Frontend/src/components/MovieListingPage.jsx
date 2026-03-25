import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";
import api from "../api/axios";

const MovieListingPage = () => {
  const navigate = useNavigate();

  const [loading, setloading] = useState(true);
  const [error, seterror] = useState("");
  const [allmovies, setallmovies] = useState([]);

  useEffect(() => {
    async function getmovies() {
      try {
        const res = await api.get("/movie/getmovies");
        setallmovies(res.data.movies);
        console.log("the movies are", res.data.movies);
      } catch (e) {
        console.log(e);
        seterror(e.response?.data?.message || "Failed to fetch movies");
      } finally {
        setloading(false);
      }
    }
    getmovies();
  }, []);

  async function handlelogout() {
    try {
      await api.post("/auth/logout");
      navigate("/login");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-800 border-b border-zinc-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            className="text-2xl font-bold text-teal-500 cursor-pointer"
            onClick={() => navigate("/movies")}
          >
            FilmVault
          </h1>
          <button
            onClick={handlelogout}
            className="px-4 py-2 text-slate-100 font-semibold hover:bg-red-700 bg-red-600 rounded-xl  transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-100 mb-2">
            Discover Films
          </h1>
          <p className="text-slate-400">
            Browse and review your favorite movies
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search by Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Search Title
              </label>
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all text-sm"
              />
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Genre
              </label>
              <select className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-teal-500 transition-all text-sm">
                <option>All Genres</option>
                <option>Sci-Fi</option>
                <option>Crime</option>
                <option>Thriller</option>
                <option>Drama</option>
              </select>
            </div>

            {/* Director Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Director
              </label>
              <input
                type="text"
                placeholder="Director name..."
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all text-sm"
              />
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-slate-300 rounded-lg transition-all text-sm font-medium">
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {loading && <p className="text-slate-400">Loading movies...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          <>
            <div className="mb-6">
              <p className="text-slate-400 text-sm">
                Showing {allmovies.length} films
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {allmovies.map((movie) => (
                <div
                  key={movie._id}
                  onClick={() => navigate(`/movie/${movie._id}`)}
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4">
          <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-slate-300 rounded-lg hover:border-teal-500 hover:text-teal-500 transition-all">
            Previous
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-lg bg-teal-500 text-zinc-900 font-semibold">
              1
            </button>
            <button className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-slate-300 hover:border-teal-500">
              2
            </button>
            <button className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-slate-300 hover:border-teal-500">
              3
            </button>
          </div>
          <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-slate-300 rounded-lg hover:border-teal-500 hover:text-teal-500 transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieListingPage;
