import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { sileo } from "sileo";

const ReviewSection = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState("");

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);

        const res = await api.get(`/movie/getreviews/${movieId}`);
        setReviews(res.data.allreviews || []);
      } catch (e) {
        console.log(e);
        sileo.error({
          title: "Error",
          description: e.response?.data?.message || "failed to fetch reviews",
          position: "top-center",
          duration: 2000,
        });
      } finally {
        setLoading(false);
      }
    }

    if (movieId) {
      fetchReviews();
    }
  }, [movieId]);

  async function handlesubmit(e) {
    e.preventDefault();

    if (!comment.trim() || !rating) {
      sileo.error({
        title: "Error",
        description: "comments and ratings are required",
        position: "top-center",
        duration: 2000,
      });
      return;
    }

    try {
      setSubmitting(true);

      const res = await api.post("/movie/addreview", {
        movieid: movieId,
        comment,
        rating,
      });

      setReviews((prev) => [...prev, res.data.review]);
      setComment("");
      setRating("");

      sileo.success({
        title: "Review Added",
        description: "Your review was posted successfully",
        position: "top-center",
        duration: 2000,
      });
    } catch (e) {
      console.log(e);
      sileo.error({
        title: "Error",
        description: e.response?.data?.message || "failed to add review",
        position: "top-center",
        duration: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(review) {
    setEditingId(review._id);
    setEditComment(review.comment);
    setEditRating(String(review.rating));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditComment("");
    setEditRating("");
  }

  async function updateReview(id) {
    if (!editComment.trim() || !editRating) {
      sileo.error({
        title: "Error",
        description: "comment and rating are required",
        position: "top-center",
        duration: 2000,
      });
      return;
    }

    try {
      const res = await api.put(`/movie/review/${id}`, {
        comment: editComment,
        rating: editRating,
      });

      setReviews((prev) =>
        prev.map((review) => (review._id === id ? res.data.review : review)),
      );

      cancelEdit();

      sileo.success({
        title: "Review Updated",
        description: "Your review was updated successfully",
        position: "top-center",
        duration: 2000,
      });
    } catch (e) {
      console.log(e);
      sileo.error({
        title: "Error",
        description: e.response?.data?.message || "failed to update review",
        position: "top-center",
        duration: 2000,
      });
    }
  }

  async function deleteReview(reviewid) {
    try {
      await api.delete(`/movie/review/${reviewid}`);

      setReviews((prev) => prev.filter((r) => r._id !== reviewid));

      sileo.success({
        title: "Review Deleted",
        description: "Your review was deleted successfully",
        position: "top-center",
        duration: 2000,
      });
    } catch (e) {
      console.log(e);
      sileo.error({
        title: "Error",
        description: e.response?.data?.message || "failed to delete review",
        position: "top-center",
        duration: 2000,
      });
    }
  }

  return (
    <section className="mt-14 max-w-5xl mx-auto px-4 sm:px-0">
      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8">
        <div className="self-start sticky top-24 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_30%)] pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
              Audience Voice
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
              Write Your Review
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Share what you felt about the movie — story, acting, visuals, or
              anything that stood out.
            </p>

            <form onSubmit={handlesubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Rating
                </label>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-3">
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-white outline-none transition focus:border-teal-500"
                  >
                    <option value="">Select rating</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>

                  <div className="mt-3 flex items-center gap-2 text-2xl">
                    <span
                      className={`${Number(rating) >= 1 ? "text-amber-400" : "text-zinc-600"}`}
                    >
                      ★
                    </span>
                    <span
                      className={`${Number(rating) >= 2 ? "text-amber-400" : "text-zinc-600"}`}
                    >
                      ★
                    </span>
                    <span
                      className={`${Number(rating) >= 3 ? "text-amber-400" : "text-zinc-600"}`}
                    >
                      ★
                    </span>
                    <span
                      className={`${Number(rating) >= 4 ? "text-amber-400" : "text-zinc-600"}`}
                    >
                      ★
                    </span>
                    <span
                      className={`${Number(rating) >= 5 ? "text-amber-400" : "text-zinc-600"}`}
                    >
                      ★
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Comment
                </label>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-3">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you love or dislike about this movie?"
                    rows="6"
                    className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-teal-500"
                  />
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Be honest, short, and clear.</span>
                    <span>{comment.length} chars</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full overflow-hidden rounded-2xl bg-teal-500 px-5 py-3.5 font-semibold text-zinc-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">
                  {submitting ? "Posting..." : "Post Review"}
                </span>
                <div className="absolute inset-0 translate-y-full bg-white/10 transition duration-300 group-hover:translate-y-0" />
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                Community Reviews
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                Reviews
              </h2>
            </div>

            <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-zinc-800/80 px-4 py-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/15 text-lg font-bold text-teal-300">
                {reviews.length}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Total responses
                </p>
                <p className="text-xs text-slate-500">
                  Live feedback from viewers
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-800/70 p-8 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-teal-500/20" />
              <p className="text-slate-400">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-800/40 p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-700/70 text-2xl text-slate-300">
                ✍️
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">
                No reviews yet
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Be the first person to share an opinion about this movie.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {reviews.map((review, index) => (
                <div
                  key={review._id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-900 p-5 transition hover:border-teal-500/30 hover:shadow-[0_12px_40px_rgba(20,184,166,0.08)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.10),transparent_30%)] opacity-0 transition group-hover:opacity-100" />

                  <div className="relative">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 text-sm font-bold uppercase text-teal-300">
                          {review.user?.username?.slice(0, 2) || "U"}
                        </div>

                        <div>
                          <h3 className="font-semibold text-white">
                            {review.user?.username || "Unknown User"}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Viewer review #{index + 1}
                          </p>
                        </div>
                      </div>

                      <div className="flex w-fit items-center gap-3 rounded-xl border border-amber-400/15 bg-amber-400/10 px-3 py-2">
                        <div className="flex items-center text-base">
                          <span
                            className={`${Number(review.rating) >= 1 ? "text-amber-400" : "text-zinc-600"}`}
                          >
                            ★
                          </span>
                          <span
                            className={`${Number(review.rating) >= 2 ? "text-amber-400" : "text-zinc-600"}`}
                          >
                            ★
                          </span>
                          <span
                            className={`${Number(review.rating) >= 3 ? "text-amber-400" : "text-zinc-600"}`}
                          >
                            ★
                          </span>
                          <span
                            className={`${Number(review.rating) >= 4 ? "text-amber-400" : "text-zinc-600"}`}
                          >
                            ★
                          </span>
                          <span
                            className={`${Number(review.rating) >= 5 ? "text-amber-400" : "text-zinc-600"}`}
                          >
                            ★
                          </span>
                        </div>

                        <span className="text-sm font-semibold text-amber-300">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    {editingId === review._id ? (
                      <div className="rounded-2xl bg-black/20 p-4 space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-300">
                            Edit Rating
                          </label>
                          <select
                            value={editRating}
                            onChange={(e) => setEditRating(e.target.value)}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-white outline-none transition focus:border-teal-500"
                          >
                            <option value="">Select rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-300">
                            Edit Comment
                          </label>
                          <textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            rows="4"
                            className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-teal-500"
                          />
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => updateReview(review._id)}
                            className="flex-1 rounded-lg bg-blue-500/20 py-2 text-sm text-blue-300 hover:bg-blue-500/30 font-medium"
                          >
                            Save
                          </button>

                          <button
                            onClick={cancelEdit}
                            className="flex-1 rounded-lg bg-zinc-700 py-2 text-sm text-white hover:bg-zinc-600 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-2xl bg-black/20 p-4">
                          <p className="text-sm leading-7 text-slate-300">
                            {review.comment}
                          </p>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => startEdit(review)}
                            className="flex-1 rounded-lg bg-blue-500/20 py-2 text-sm text-blue-300 hover:bg-blue-500/30 font-medium"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteReview(review._id)}
                            className="flex-1 rounded-lg bg-red-500/20 py-2 text-sm text-red-300 hover:bg-red-500/30 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
