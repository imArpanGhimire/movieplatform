import { useEffect, useState } from "react";

import api from "../api/axios";
import { toast } from "../utils/toast";

const ReplyItem = ({
  reply,
  reviewId,
  currentuser,
  activeReplyId,
  setActiveReplyId,
  onReplyAdded,
  onDeleteReply,
  depth = 0,
}) => {
  const [text, setText] = useState("");
  const isReplying = activeReplyId === reply._id;
  const isOwner = currentuser?._id?.toString() === reply.user?._id?.toString();

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      await api.post("/reply", {
        reviewId,
        text,
        parentReply: reply._id,
      });

      onReplyAdded();
      setText("");
      setActiveReplyId(null);
      toast.success("Reply Added", "Your reply was posted successfully");
    } catch (e) {
      console.log(e);
      toast.error("Failed to post reply", e.response?.data?.message);
    }
  };

  return (
    <div className="mt-3" style={{ marginLeft: depth > 0 ? "18px" : "0px" }}>
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-page)] p-3">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {reply.user?.username || "User"}
          </p>

          {isOwner && (
            <button
              onClick={() => onDeleteReply(reply._id)}
              className="text-xs text-red-500 hover:underline"
            >
              Delete
            </button>
          )}
        </div>

        <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
          {reply.text}
        </p>

        <button
          onClick={() => setActiveReplyId(isReplying ? null : reply._id)}
          className="mt-2 text-xs font-medium text-teal-500 hover:underline"
        >
          Reply
        </button>

        {isReplying && (
          <ReplyInput
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Reply to ${reply.user?.username || "user"}...`}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {reply.children?.length > 0 && (
        <div className="border-l border-[color:var(--color-border)] pl-3">
          {reply.children.map((child) => (
            <ReplyItem
              key={child._id}
              reply={child}
              reviewId={reviewId}
              currentuser={currentuser}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              onReplyAdded={onReplyAdded}
              onDeleteReply={onDeleteReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ReplySection = ({ reviewId, currentuser }) => {
  const [replies, setReplies] = useState([]);
  const [mainReplyText, setMainReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);

  const fetchReplies = async () => {
    try {
      const res = await api.get(`/reply/${reviewId}`);
      setReplies(res.data || []);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (reviewId) fetchReplies();
  }, [reviewId]);

  const handleAddMainReply = async () => {
    if (!mainReplyText.trim()) return;

    try {
      await api.post("/reply", {
        reviewId,
        text: mainReplyText,
        parentReply: null,
      });

      setMainReplyText("");
      fetchReplies();
      toast.success("Reply Added", "Your reply was posted successfully");
    } catch (e) {
      console.log(e);
      toast.error("Failed to post reply", e.response?.data?.message);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await api.delete(`/reply/${replyId}`);
      fetchReplies();
      toast.success("Reply Deleted", "Reply deleted successfully");
    } catch (e) {
      console.log(e);
      toast.error("Failed to delete reply", e.response?.data?.message);
    }
  };

  return (
    <div className="border-t border-[color:var(--color-border)] bg-[var(--color-bg-input)]/30 px-5 py-4">
      <div className="mb-4">
        <ReplyInput
          value={mainReplyText}
          onChange={(e) => setMainReplyText(e.target.value)}
          placeholder="Reply to this review..."
          onSubmit={handleAddMainReply}
          buttonLabel="Reply"
        />
      </div>

      {replies.length > 0 && (
        <div className="space-y-3">
          {replies.map((reply) => (
            <ReplyItem
              key={reply._id}
              reply={reply}
              reviewId={reviewId}
              currentuser={currentuser}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              onReplyAdded={fetchReplies}
              onDeleteReply={handleDeleteReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ReplyInput = ({
  value,
  onChange,
  placeholder,
  onSubmit,
  buttonLabel = "Send",
}) => (
  <div className="mt-3 flex gap-2">
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="flex-1 rounded-xl border border-[color:var(--color-border-input)] bg-[var(--color-bg-input)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-teal-500"
    />
    <button
      onClick={onSubmit}
      className="rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-teal-400"
    >
      {buttonLabel}
    </button>
  </div>
);

export default ReplySection;
