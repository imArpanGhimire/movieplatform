import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, User, ArrowLeft } from "lucide-react";
import api from "../api/axios";

const STEPS = { VERIFY: "verify", RESET: "reset", DONE: "done" };

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.VERIFY);
  const [username, setUsername] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setError("");
    if (!username.trim() || !secretKey.trim())
      return setError("Please fill in both fields.");
    setLoading(true);
    try {
      const res = await api.post("/recovery/verify-secret", {
        username,
        secretKey,
      });
      setUserId(res.data.userId);
      setStep(STEPS.RESET);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setError("");
    if (newPassword.length < 6)
      return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      await api.post("/recovery/reset-password", { userId, newPassword });
      setStep(STEPS.DONE);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] px-4">
      <div className="w-full max-w-[360px]">
        <button
          onClick={() => navigate("/login")}
          className="mb-6 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft size={13} />
          Back to login
        </button>

        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10">
          <ShieldCheck size={20} className="text-teal-500" />
        </div>

        {step === STEPS.VERIFY && (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Forgot password?
            </h1>
            <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
              Enter your username and secret recovery phrase.
            </p>

            <div className="mt-7 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
                  Username
                </label>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-11 w-full rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] pl-9 pr-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
                  Secret recovery phrase
                </label>
                <div className="relative">
                  <ShieldCheck
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                  />
                  <input
                    type="text"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="e.g. my first pet was a turtle"
                    className="h-11 w-full rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] pl-9 pr-3 text-sm placeholder:text-[var(--color-text-muted)]"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                onClick={handleVerify}
                disabled={loading}
                className="h-11 w-full rounded-lg bg-teal-500 text-sm font-semibold text-white hover:bg-teal-600 transition-colors disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </>
        )}

        {step === STEPS.RESET && (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Set new password
            </h1>
            <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
              Choose a strong password you'll remember.
            </p>

            <div className="mt-7 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
                  New password
                </label>
                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-11 w-full rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] pl-9 pr-3 text-sm"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                onClick={handleReset}
                disabled={loading}
                className="h-11 w-full rounded-lg bg-teal-500 text-sm font-semibold text-white hover:bg-teal-600 transition-colors disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </>
        )}

        {step === STEPS.DONE && (
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Password updated
            </h1>
            <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
              You can now sign in with your new password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 h-11 w-full rounded-lg bg-teal-500 text-sm font-semibold text-white hover:bg-teal-600 transition-colors"
            >
              Go to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
