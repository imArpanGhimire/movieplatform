import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { sileo } from "sileo";

const ReplySection = ({ reviewId, currentuser }) => {
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchReplies() {
      try {
        const res = await api.get(`/reply/${reviewId}`);
        setReplies(res.data || []);
      } catch (e) {
        console.log(e);
      }
    }

    if (reviewId) fetchReplies();
  }, [reviewId]);

  async function handleAddReply() {
    if (!replyText.trim()) return;

    try {
      setLoading(true);

      const res = await api.post("/reply", {
        reviewId,
        text: replyText,
      });

      setReplies((prev) => [...prev, res.data]);
      setReplyText("");

      sileo.success({
        title: "Reply Added",
        description: "Your reply was posted successfully",
        position: "top-center",
        duration: 2000,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteReply(replyId) {
    try {
      await api.delete(`/reply/${replyId}`);
      setReplies((prev) => prev.filter((reply) => reply._id !== replyId));

      sileo.success({
        title: "Reply Deleted",
        description: "Your reply was deleted successfully",
        position: "top-center",
        duration: 2000,
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="border-t border-[color:var(--color-border)] bg-[var(--color-bg-input)]/30 px-5 py-4">
      <div className="mb-4 flex gap-2">
        <input
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write a reply..."
          className="flex-1 rounded-xl border border-[color:var(--color-border-input)] bg-[var(--color-bg-page)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] outline-none transition-all duration-200 focus:border-teal-500"
        />

        <button
          onClick={handleAddReply}
          disabled={loading}
          className="rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "..." : "Reply"}
        </button>
      </div>

      {replies.length > 0 && (
        <div className="space-y-3">
          {replies.map((reply) => (
            <div
              key={reply._id}
              className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-page)] p-3"
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {reply.user?.username || "User"}
                </p>

                {currentuser?._id?.toString() ===
                  reply.user?._id?.toString() && (
                  <button
                    onClick={() => handleDeleteReply(reply._id)}
                    className="text-xs font-medium text-red-500 transition hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>

              <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                {reply.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplySection;
