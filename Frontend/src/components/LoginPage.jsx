import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User } from "lucide-react";

import api from "../api/axios";
import moviesBg from "../images/bg1.jpg";

const initialFormData = { username: "", password: "" };

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/login", {
        username: formData.username.trim(),
        password: formData.password,
      });
      navigate("/movies");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      {/* LEFT PANEL */}
      <div className="relative hidden w-[52%] lg:block h-screen">
        <img
          src={moviesBg}
          alt="Movies"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--color-bg-base)]" />
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[360px]">
          {/* LOGO + TEXT */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-text-primary)] text-[var(--color-bg-base)]">
                <span className="text-sm font-bold">F</span>
              </div>
              <span className="text-base font-semibold">FilmVault</span>
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">
              Rate, review, and discover films you'll love.
            </p>
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Sign in to continue to FilmVault
          </p>

          {/* FORM */}
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
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
                  value={formData.username}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] pl-9 pr-3 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-[10px] text-teal-500 hover:text-teal-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] pl-9 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-[var(--color-text-primary)] text-sm font-semibold text-[var(--color-bg-base)]"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--color-border)]" />
            <span className="text-xs text-[var(--color-text-muted)]">
              New to FilmVault?
            </span>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          {/* CREATE ACCOUNT */}
          <button
            onClick={() => navigate("/register")}
            className="mt-4 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] py-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
