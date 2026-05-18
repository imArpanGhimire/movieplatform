import { useState } from "react";
import { ShieldCheck, X, Eye, EyeOff } from "lucide-react";
import api from "../api/axios";

const SecretKeyModal = ({ onClose }) => {
  const [secretKey, setSecretKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (secretKey.trim().length < 6)
      return setError("Must be at least 6 characters.");
    setLoading(true);
    try {
      await api.post("/recovery/set-secret", { secretKey });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-[380px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-2xl">
        {!done ? (
          <>
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10">
                  <ShieldCheck size={18} className="text-teal-500" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Set a Recovery Key
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    One-time setup
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <p className="mb-4 text-xs leading-relaxed text-[var(--color-text-muted)]">
              Create a secret phrase only you'd know — like{" "}
              <span className="italic text-[var(--color-text-secondary)]">
                "my first pet was a turtle"
              </span>
              . You'll use this to reset your password if you ever forget it. We
              never ask for your email or phone number.
            </p>

            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                placeholder="Enter your secret phrase..."
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="h-11 w-full rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-base)] pl-3 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

            <div className="mt-4 flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-[var(--color-border)] py-2.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-lg bg-teal-500 py-2.5 text-xs font-semibold text-white hover:bg-teal-600 transition-colors disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Key"}
              </button>
            </div>

            <p className="mt-3 text-center text-[10px] text-[var(--color-text-muted)]">
              You can only set this once. Keep it somewhere safe.
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10">
              <ShieldCheck size={22} className="text-teal-500" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Recovery key saved
            </h2>
            <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
              You're all set. Remember your phrase — we can't recover it for
              you.
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-lg bg-teal-500 py-2.5 text-xs font-semibold text-white hover:bg-teal-600 transition-colors"
            >
              Got it
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecretKeyModal;
