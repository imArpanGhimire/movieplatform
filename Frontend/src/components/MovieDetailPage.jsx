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
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] px-6 text-[var(--color-text-primary)] transition-colors duration-300">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-8 py-6 shadow-2xl">
          <p className="animate-pulse text-lg text-[var(--color-text-secondary)]">
            Loading movie...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] px-6 text-[var(--color-text-primary)] transition-colors duration-300">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[var(--color-bg-card)] p-6 text-center shadow-2xl">
          <p className="text-lg font-medium text-red-400">{error}</p>
          <button
            onClick={() => navigate("/movies")}
            className="mt-5 rounded-xl bg-red-500/90 px-5 py-2.5 text-white transition duration-200 hover:bg-red-500"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] px-6 text-[var(--color-text-primary)] transition-colors duration-300">
        <div className="w-full max-w-md rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-6 text-center shadow-2xl">
          <p className="text-lg text-[var(--color-text-secondary)]">
            No movie found
          </p>
          <button
            onClick={() => navigate("/movies")}
            className="mt-5 rounded-xl bg-teal-500 px-5 py-2.5 font-medium text-black transition duration-200 hover:bg-teal-400"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] px-6 py-10 text-[var(--color-text-primary)] transition-colors duration-300">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/movies")}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-5 py-2.5 shadow-md transition duration-200 hover:bg-[var(--color-bg-elevated)]"
        >
          ← Back to Movies
        </button>

        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] shadow-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-cyan-500/10"></div>

          <div className="relative p-8 md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <p className="mb-3 text-sm uppercase tracking-[0.25em] text-teal-500">
                  Movie Details
                </p>

                <h1 className="mb-6 font-swash text-4xl font-bold leading-tight text-[var(--color-text-primary)] md:text-5xl">
                  {movie.title}
                </h1>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-4">
                    <p className="mb-1 text-sm text-[var(--color-text-muted)]">
                      Director
                    </p>
                    <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                      {movie.director}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-4">
                    <p className="mb-1 text-sm text-[var(--color-text-muted)]">
                      Genre
                    </p>
                    <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                      {movie.genre}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-4">
                    <p className="mb-1 text-sm text-[var(--color-text-muted)]">
                      Duration
                    </p>
                    <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                      {movie.duration} hr
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-4">
                    <p className="mb-1 text-sm text-[var(--color-text-muted)]">
                      Avg Rating
                    </p>
                    <p className="text-lg font-semibold text-amber-500">
                      {averageRating || "N/A"} / 5
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-[220px]">
                <div className="flex h-full min-h-[180px] items-center justify-center rounded-3xl border border-[color:var(--color-border)] bg-[linear-gradient(135deg,var(--color-bg-input),var(--color-bg-card))] shadow-inner">
                  <div className="px-4 text-center">
                    <p className="mb-2 text-sm text-[var(--color-text-muted)]">
                      Featured
                    </p>
                    <p className="text-2xl font-bold text-teal-500/80">
                      {movie.genre}
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
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
