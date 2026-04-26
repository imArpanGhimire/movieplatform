import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { sileo } from "sileo";
import { ThumbsUp } from "lucide-react";
import ReplySection from "./ReplySection";

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
    if (movieId) fetchReviews();
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
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const sortreviews = [...reviews].sort((a, b) => {
    if (sortby === "highest") return Number(b.rating) - Number(a.rating);
    if (sortby === "lowest") return Number(a.rating) - Number(b.rating);
    if (sortby === "oldest")
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  async function handleLike(reviewId) {
    try {
      const res = await api.post("/toggle/likes", { reviewid: reviewId });
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
      <section className="mx-auto mt-14 max-w-5xl px-4 sm:px-0">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[380px_1fr]">
          <div className="relative self-start overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 sticky top-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_30%)]" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-500">
                Audience Voice
              </div>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
                Write Your Review
              </h2>

              <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                Share what you felt about the movie — story, acting, visuals, or
                anything that stood out.
              </p>

              {error && (
                <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handlesubmit} className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                    Rating
                  </label>

                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-3">
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full rounded-xl border border-[color:var(--color-border-input)] bg-[var(--color-bg-page)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition-all duration-200 focus:scale-[1.01] focus:border-teal-500"
                    >
                      <option value="">Select rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Decent</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>

                    <div className="mt-3 flex items-center gap-2 text-2xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            Number(rating) >= star
                              ? "text-amber-400"
                              : "text-[var(--color-text-muted)]"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                    Comment
                  </label>

                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-3">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you love or dislike about this movie?"
                      rows="6"
                      className="w-full resize-none rounded-xl border border-[color:var(--color-border-input)] bg-[var(--color-bg-page)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] outline-none transition-all duration-200 focus:scale-[1.01] focus:border-teal-500"
                    />
                    <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
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

          <div className="rounded-3xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.10)]">
            <div className="mb-6 flex flex-col gap-4 border-b border-[color:var(--color-border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
                  Community Reviews
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
                  Reviews
                </h2>
              </div>

              <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] px-2 py-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/15 text-lg font-bold text-teal-500">
                  {reviews.length}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    Total responses
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Live feedback
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sortby}
                  onChange={(e) => setsortby(e.target.value)}
                  className="rounded-xl border border-[color:var(--color-border-input)] bg-[var(--color-bg-input)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none transition-all duration-200 focus:border-teal-500"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest</option>
                  <option value="lowest">Lowest</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-8 text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-teal-500/20" />
                <p className="text-[var(--color-text-secondary)]">
                  Loading reviews...
                </p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-bg-elevated)] text-2xl text-[var(--color-text-secondary)]">
                  ✍️
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[var(--color-text-primary)]">
                  No reviews yet
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  Be the first person to share an opinion about this movie.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {sortreviews.map((review) => (
                  <div
                    key={review._id}
                    className="group relative overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[var(--color-bg-page)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.10)]"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.03),transparent_30%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-teal-500/15 text-sm font-bold uppercase text-teal-500">
                            {review.user?.username?.slice(0, 2) || "U"}
                          </div>
                          <div>
                            <p className="leading-tight text-sm font-semibold text-[var(--color-text-primary)]">
                              {review.user?.username || "Unknown User"}
                              {review.isEdited && (
                                <span className="ml-2 text-xs font-normal italic text-[var(--color-text-muted)]">
                                  edited
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                              {formattimestamp(review.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-amber-400/15 bg-amber-400/10 px-3 py-1.5">
                          <div className="flex items-center text-sm">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={
                                  Number(review.rating) >= star
                                    ? "text-amber-400"
                                    : "text-[var(--color-text-muted)]"
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-amber-500">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>

                      {editingId === review._id ? (
                        <div className="mx-5 mb-5 space-y-4 rounded-2xl bg-[var(--color-bg-input)] p-4">
                          {error && (
                            <div className="rounded-lg border border-red-500/25 bg-red-500/10 p-2">
                              <p className="text-xs text-red-400">{error}</p>
                            </div>
                          )}

                          <div>
                            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                              Edit Rating
                            </label>
                            <select
                              value={editRating}
                              onChange={(e) => setEditRating(e.target.value)}
                              className="w-full rounded-xl border border-[color:var(--color-border-input)] bg-[var(--color-bg-page)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition-all duration-200 focus:border-teal-500"
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
                            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                              Edit Comment
                            </label>
                            <textarea
                              value={editComment}
                              onChange={(e) => setEditComment(e.target.value)}
                              rows="4"
                              className="w-full resize-none rounded-xl border border-[color:var(--color-border-input)] bg-[var(--color-bg-page)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] outline-none transition-all duration-200 focus:border-teal-500"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => updateReview(review._id)}
                              disabled={updating}
                              className="flex-1 rounded-xl bg-blue-500/15 py-2.5 text-sm font-medium text-blue-500 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {updating ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex-1 rounded-xl bg-[var(--color-bg-elevated)] py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:opacity-90"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="px-5 pb-4">
                            <p className="text-sm leading-7 text-[var(--color-text-secondary)] transition-colors duration-200 group-hover:text-[var(--color-text-primary)]">
                              {review.comment}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-[color:var(--color-border)] bg-[var(--color-bg-input)]/50 px-5 py-3">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleLike(review._id)}
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                                  review.likedByUser
                                    ? "border-teal-400/30 bg-teal-500/10 text-teal-500"
                                    : "border-[color:var(--color-border)] text-[var(--color-text-secondary)] hover:border-[color:var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
                                }`}
                              >
                                <ThumbsUp
                                  size={13}
                                  className={
                                    review.likedByUser
                                      ? "fill-teal-500 text-teal-500"
                                      : ""
                                  }
                                />
                                {review.likedByUser ? "Liked" : "Like"}
                              </button>

                              <span className="text-xs text-[var(--color-text-muted)]">
                                {review.likesCount || 0}{" "}
                                {review.likesCount === 1 ? "like" : "likes"}
                              </span>
                            </div>

                            {currentuser?._id?.toString() ===
                              review.user?._id?.toString() && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => startEdit(review)}
                                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-500 transition hover:bg-blue-500/10"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setshowModal(true);
                                    setreviewToDel(review._id);
                                  }}
                                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                          <ReplySection
                            reviewId={review._id}
                            currentuser={currentuser}
                          />
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
          <div className="w-full max-w-xs rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-5 shadow-2xl">
            <h3 className="text-center text-base font-semibold text-[var(--color-text-primary)]">
              Delete review?
            </h3>
            <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
              Are you sure you want to delete this review?
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  setshowModal(false);
                  setreviewToDel(null);
                }}
                disabled={deleting}
                className="flex-1 rounded-xl bg-[var(--color-bg-elevated)] py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
                className="flex-1 rounded-xl bg-red-500/12 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
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
