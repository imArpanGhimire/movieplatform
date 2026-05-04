import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Eye, EyeOff, Film, Lock, User } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        username: formData.username.trim(),
        password: formData.password,
      });
      console.log("Registration success:", res.data);
      setSuccess("Account created! Redirecting...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg-base)] px-4 py-12 text-[var(--color-text-primary)]">
      {/* Ambience */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/[0.06] blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/[0.04] blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-text-primary)] text-[var(--color-bg-base)]">
            <Film size={20} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
            Join FilmVault and start discovering
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-lg shadow-black/5">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Username */}
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
                  name="username"
                  placeholder="yourusername"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  className="h-10 w-full rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-input)] pl-9 pr-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] outline-none transition focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/15"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="h-10 w-full rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-input)] pl-9 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] outline-none transition focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--color-text-muted)] transition hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-lg border border-green-500/25 bg-green-500/10 px-3 py-2">
                <p className="text-xs text-green-400">{success}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="h-10 w-full rounded-lg bg-[var(--color-text-primary)] text-sm font-medium text-[var(--color-bg-base)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[color:var(--color-border)]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
              Already have an account
            </span>
            <div className="h-px flex-1 bg-[color:var(--color-border)]" />
          </div>

          {/* Login redirect */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="h-10 w-full rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
          >
            Sign in instead
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
          By continuing, you agree to our{" "}
          <a className="text-[var(--color-text-secondary)] underline-offset-2 hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a className="text-[var(--color-text-secondary)] underline-offset-2 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
