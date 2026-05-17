import React, { useEffect, useState } from "react";
import { Pencil, Star, ThumbsUp, Trash2 } from "lucide-react";

import api from "../api/axios";
import { toast } from "../utils/toast";
import ReplySection from "./ReplySection";

const ReviewSection = ({ movieId, showAllReviews = false }) => {
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

  async function handlesubmit(e) {
    e.preventDefault();
    if (!comment.trim() || !rating) {
      setError("Comment and rating are required");
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
      setReviews((prev) => [res.data.review, ...prev]);
      setComment("");
      setRating("");
      toast.success("Review posted", "Your review was posted successfully");
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
        prev.map((r) => (r._id === id ? res.data.review : r)),
      );
      cancelEdit();
      toast.success("Review updated", "Your review was updated successfully");
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
      toast.success("Review deleted", "Your review was deleted successfully");
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Failed to delete review");
    }
  }

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

  function formattimestamp(dateString) {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortby === "highest") return Number(b.rating) - Number(a.rating);
    if (sortby === "lowest") return Number(a.rating) - Number(b.rating);
    if (sortby === "oldest")
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const visibleReviews = sortedReviews.slice(
    0,
    showAllReviews ? sortedReviews.length : 2,
  );

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : null;

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Reviews list */}
        <div>
          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </span>
              {avgRating && (
                <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                  <Star
                    size={12}
                    className="text-amber-500"
                    fill="currentColor"
                  />
                  {avgRating} average
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-[var(--color-text-muted)]">
                Sort
              </label>
              <select
                value={sortby}
                onChange={(e) => setsortby(e.target.value)}
                className="rounded-md border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-text-muted)]"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest rated</option>
                <option value="lowest">Lowest rated</option>
              </select>
            </div>
          </div>

          {/* Reviews */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[var(--color-bg-input)]" />
                    <div className="space-y-2">
                      <div className="h-3 w-24 rounded bg-[var(--color-bg-input)]" />
                      <div className="h-2 w-16 rounded bg-[var(--color-bg-input)]" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full rounded bg-[var(--color-bg-input)]" />
                    <div className="h-3 w-4/5 rounded bg-[var(--color-bg-input)]" />
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-12 text-center">
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                No reviews yet
              </h3>
              <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
                Be the first to share your thoughts on this movie.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleReviews.map((review) => (
                <article
                  key={review._id}
                  className="rounded-xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] transition hover:border-[color:var(--color-border-strong)]"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 px-5 pt-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg-input)] text-xs font-semibold uppercase text-[var(--color-text-primary)]">
                        {review.user?.username?.slice(0, 2) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                          {review.user?.username || "Unknown"}
                          {review.isEdited && (
                            <span className="ml-2 text-xs font-normal text-[var(--color-text-muted)]">
                              · edited
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {formattimestamp(review.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-500">
                      <Star size={11} fill="currentColor" />
                      {review.rating}
                    </div>
                  </div>

                  {/* Body */}
                  {editingId === review._id ? (
                    <div className="mx-5 mb-5 mt-4 space-y-3 rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-input)] p-4">
                      {error && (
                        <p className="rounded-md border border-red-500/25 bg-red-500/10 p-2 text-xs text-red-400">
                          {error}
                        </p>
                      )}

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
                          Rating
                        </label>
                        <select
                          value={editRating}
                          onChange={(e) => setEditRating(e.target.value)}
                          className="w-full rounded-md border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-text-muted)]"
                        >
                          <option value="">Select rating</option>
                          <option value="1">1 — Poor</option>
                          <option value="2">2 — Fair</option>
                          <option value="3">3 — Good</option>
                          <option value="4">4 — Very Good</option>
                          <option value="5">5 — Excellent</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
                          Comment
                        </label>
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          rows="4"
                          className="w-full resize-none rounded-md border border-[color:var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-text-muted)]"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={cancelEdit}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => updateReview(review._id)}
                          disabled={updating}
                          className="rounded-md bg-[var(--color-text-primary)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-bg-base)] transition hover:opacity-90 disabled:opacity-60"
                        >
                          {updating ? "Saving..." : "Save changes"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="px-5 pb-4 pt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {review.comment}
                      </p>

                      {/* Actions footer */}
                      <div className="flex items-center justify-between border-t border-[color:var(--color-border)] px-5 py-2.5">
                        <button
                          onClick={() => handleLike(review._id)}
                          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition ${
                            review.likedByUser
                              ? "text-teal-500"
                              : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                          }`}
                        >
                          <ThumbsUp
                            size={13}
                            fill={review.likedByUser ? "currentColor" : "none"}
                          />
                          <span>{review.likesCount || 0}</span>
                        </button>

                        {currentuser?._id?.toString() ===
                          review.user?._id?.toString() && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEdit(review)}
                              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-text-primary)]"
                            >
                              <Pencil size={12} />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setshowModal(true);
                                setreviewToDel(review._id);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[var(--color-text-muted)] transition hover:text-red-500"
                            >
                              <Trash2 size={12} />
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
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar form */}
        <aside>
          <div className="sticky top-24 rounded-xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Write a review
            </h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Share your honest thoughts about this movie.
            </p>

            {error && !editingId && (
              <p className="mt-4 rounded-md border border-red-500/25 bg-red-500/10 p-2 text-xs text-red-400">
                {error}
              </p>
            )}

            <form onSubmit={handlesubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
                  Rating
                </label>
                <div className="mb-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(String(star))}
                      className="transition hover:scale-110"
                    >
                      <Star
                        size={20}
                        className={
                          Number(rating) >= star
                            ? "text-amber-500"
                            : "text-[var(--color-text-muted)]/40"
                        }
                        fill={Number(rating) >= star ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                  {rating && (
                    <span className="ml-2 text-xs font-medium text-[var(--color-text-secondary)]">
                      {rating}/5
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What stood out to you?"
                  rows="5"
                  className="w-full resize-none rounded-md border border-[color:var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] outline-none transition focus:border-[var(--color-text-muted)]"
                />
                <div className="mt-1.5 flex justify-end text-[10px] text-[var(--color-text-muted)]">
                  {comment.length} characters
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-[var(--color-text-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg-base)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Posting..." : "Post review"}
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* Delete modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
              Delete this review?
            </h3>
            <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
              This action cannot be undone. Your review will be permanently
              removed.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setshowModal(false);
                  setreviewToDel(null);
                }}
                disabled={deleting}
                className="rounded-md px-3.5 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)] disabled:opacity-60"
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
                className="rounded-md bg-red-500 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
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
