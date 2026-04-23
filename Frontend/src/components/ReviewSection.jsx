import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { sileo } from "sileo";
import { ThumbsUp } from "lucide-react";

const ReviewSection = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState("");

  const [showModal, setshowModal] = useState(false);
  const [reviewToDel, setreviewToDel] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [currentuser, setcurrentuser] = useState(null);

  const [sortby, setsortby] = useState("newest");

  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/movie/getreviews/${movieId}`);
        setReviews(res.data.allreviews || []);
      } catch (e) {
        console.log(e);
        setError(e.response?.data?.message || "Failed to fetch reviews");
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
      setError("Comments and ratings are required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

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
      setError(e.response?.data?.message || "Failed to add review");
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(review) {
    setEditingId(review._id);
    setEditComment(review.comment);
    setEditRating(String(review.rating));
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditComment("");
    setEditRating("");
    setError("");
  }

  async function updateReview(id) {
    if (!editComment.trim() || !editRating) {
      setError("Comment and rating are required");
      return;
    }

    try {
      setUpdating(true);
      setError("");

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
      });
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Failed to update review");
    } finally {
      setUpdating(false);
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
      });
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Failed to delete review");
    }
  }

  useEffect(() => {
    async function getcurrentuser() {
      try {
        const response = await api.get("/auth/me");
        setcurrentuser(response.data.user);
      } catch (e) {
        console.log(e);
        setcurrentuser(null);
      }
    }
    getcurrentuser();
  }, []);

  function formattimestamp(dateString) {
    if (!dateString) return "Older review";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const sortreviews = [...reviews].sort((a, b) => {
    if (sortby === "highest") {
      return Number(b.rating) - Number(a.rating);
    }
    if (sortby === "lowest") {
      return Number(a.rating) - Number(b.rating);
    }

    if (sortby === "oldest") {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    }
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  async function handleLike(reviewId) {
    try {
      const res = await api.post("/toggle/likes", {
        reviewid: reviewId,
      });

      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                likedByUser: res.data.liked,
                likesCount: res.data.likesCount,
              }
            : review,
        ),
      );
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Failed to toggle like");
    }
  }

  return (
    <>
      <section className="mt-14 max-w-5xl mx-auto px-4 sm:px-0">
        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8">
          <div className="self-start sticky top-24 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/20">
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

              {error && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <form onSubmit={handlesubmit} className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Rating
                  </label>

                  <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-3">
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-white outline-none transition-all duration-200 focus:border-teal-500 focus:scale-[1.01]"
                    >
                      <option value="">Select rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Decent</option>
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
                      className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-teal-500 focus:scale-[1.01]"
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

              <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-zinc-800/80 px-2 py-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/15 text-lg font-bold text-teal-300">
                  {reviews.length}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Total responses
                  </p>
                  <p className="text-xs text-slate-500">Live feedback</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sortby}
                  onChange={(e) => setsortby(e.target.value)}
                  className="rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white outline-none transition-all duration-200 focus:border-teal-500"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest</option>
                  <option value="lowest">Lowest</option>
                </select>
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
                {sortreviews.map((review) => (
                  <div
                    key={review._id}
                    className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(39,39,42,0.95),rgba(17,24,39,0.92))] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_30%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                    <div className="relative">
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 text-sm font-bold uppercase text-teal-300">
                            {review.user?.username?.slice(0, 2) || "U"}
                          </div>

                          <div>
                            <h3 className="font-semibold text-white">
                              {review.user?.username || "Unknown User"}

                              {review.isEdited && (
                                <span className="text-xs text-slate-400 italic ml-3">
                                  Edited • {formattimestamp(review.updatedAt)}
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {formattimestamp(review.createdAt)}
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
                          {error && (
                            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2">
                              <p className="text-xs text-red-300">{error}</p>
                            </div>
                          )}

                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">
                              Edit Rating
                            </label>
                            <select
                              value={editRating}
                              onChange={(e) => setEditRating(e.target.value)}
                              className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-white outline-none transition-all duration-200 focus:border-teal-500 focus:scale-[1.01]"
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
                              className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-teal-500 focus:scale-[1.01]"
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
                          <div className="rounded-2xl border border-white/5 bg-black/20 px-4 py-4">
                            <p className="text-sm leading-7 text-slate-300 transition-colors duration-200 group-hover:text-slate-200">
                              {review.comment}
                            </p>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleLike(review._id)}
                                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                  review.likedByUser
                                    ? "border-teal-400/20 bg-teal-500/15 text-teal-300 hover:bg-teal-500/20"
                                    : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                                }`}
                              >
                                <ThumbsUp
                                  size={15}
                                  className={
                                    review.likedByUser
                                      ? "fill-teal-300 text-teal-300"
                                      : "text-slate-400"
                                  }
                                />
                                <span>
                                  {review.likedByUser ? "Liked" : "Like"}
                                </span>
                              </button>

                              <span className="text-sm text-slate-400">
                                {review.likesCount || 0}{" "}
                                {review.likesCount === 1 ? "like" : "likes"}
                              </span>
                            </div>

                            {currentuser?._id?.toString() ===
                              review.user?._id?.toString() && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => startEdit(review)}
                                  className="rounded-xl border border-blue-400/15 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() => {
                                    setshowModal(true);
                                    setreviewToDel(review._id);
                                  }}
                                  className="rounded-xl border border-red-400/15 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-2xl">
            <h3 className="text-center text-base font-semibold text-white">
              Delete review?
            </h3>

            <p className="mt-2 text-center text-sm text-slate-400">
              Are you sure you want to delete this review?
            </p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  setshowModal(false);
                  setreviewToDel(null);
                }}
                disabled={deleting}
                className="flex-1 rounded-xl bg-zinc-800 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    setDeleting(true);
                    await deleteReview(reviewToDel);
                    setshowModal(false);
                    setreviewToDel(null);
                  } finally {
                    setDeleting(false);
                  }
                }}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-500/20 py-2.5 text-sm font-medium text-red-300 hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewSection;
