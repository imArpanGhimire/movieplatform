import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useState } from "react";
import ReviewSection from "../components/ReviewSection";

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setloading] = useState(true);
  const [error, seterror] = useState("");
  const [movie, setmovie] = useState(null);
  const [averageRating, setaverageRating] = useState(null);

  useEffect(() => {
    async function getmoviebyid() {
      try {
        const res = await api.get(`/movie/getmoviebyid/${id}`);
        setmovie(res.data.movie);
      } catch (e) {
        console.log(e);
        seterror(e.response?.data?.message || "failed to fetch movie");
      } finally {
        setloading(false);
      }
    }

    async function getaveragerating() {
      try {
        const res = await api.get(`/movie/getaveragerating/${id}`);
        setaverageRating(res.data.averageRating);
      } catch (e) {
        console.log(e);
      }
    }

    getmoviebyid();
    getaveragerating();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-center px-6">
        <div className="bg-zinc-900/70 border border-zinc-800 backdrop-blur-md px-8 py-6 rounded-2xl shadow-2xl">
          <p className="text-zinc-300 text-lg animate-pulse">
            Loading movie...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-zinc-900/80 border border-red-500/20 rounded-2xl p-6 shadow-2xl text-center">
          <p className="text-red-400 text-lg font-medium">{error}</p>
          <button
            onClick={() => navigate("/movies")}
            className="mt-5 px-5 py-2.5 bg-red-500/90 hover:bg-red-500 rounded-xl transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-center">
          <p className="text-zinc-300 text-lg">No movie found</p>
          <button
            onClick={() => navigate("/movies")}
            className="mt-5 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-black font-medium rounded-xl transition duration-200"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/movies")}
          className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition duration-200 shadow-md"
        >
          ← Back to Movies
        </button>

        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-md shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-cyan-500/10 pointer-events-none"></div>

          <div className="relative p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              <div className="flex-1">
                <p className="text-sm uppercase tracking-[0.25em] text-teal-400 mb-3">
                  Movie Details
                </p>

                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white font-swash">
                  {movie.title}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-zinc-800/70 border border-zinc-700 rounded-2xl p-4">
                    <p className="text-zinc-400 text-sm mb-1">Director</p>
                    <p className="text-lg font-semibold text-white">
                      {movie.director}
                    </p>
                  </div>

                  <div className="bg-zinc-800/70 border border-zinc-700 rounded-2xl p-4">
                    <p className="text-zinc-400 text-sm mb-1">Genre</p>
                    <p className="text-lg font-semibold text-white">
                      {movie.genre}
                    </p>
                  </div>

                  <div className="bg-zinc-800/70 border border-zinc-700 rounded-2xl p-4">
                    <p className="text-zinc-400 text-sm mb-1">Duration</p>
                    <p className="text-lg font-semibold text-white">
                      {movie.duration} hr
                    </p>
                  </div>

                  <div className="bg-zinc-800/70 border border-zinc-700 rounded-2xl p-4">
                    <p className="text-zinc-400 text-sm mb-1">Avg Rating</p>
                    <p className="text-lg font-semibold text-amber-300">
                      {averageRating || "N/A"} / 5
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-[220px]">
                <div className="h-full min-h-[180px] rounded-3xl border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center shadow-inner">
                  <div className="text-center px-4">
                    <p className="text-zinc-500 text-sm mb-2">Featured</p>
                    <p className="text-2xl font-bold text-teal-400">
                      {movie.genre}
                    </p>
                    <p className="text-zinc-400 mt-2 text-sm">
                      {movie.duration} hr runtime
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ReviewSection movieId={id} />
      </div>
    </div>
  );
};

export default MovieDetailPage;
