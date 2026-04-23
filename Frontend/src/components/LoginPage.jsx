import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        username: formData.username.trim(),
        password: formData.password,
      });

      console.log("Login success:", res.data);
      navigate("/movies");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg-base)] px-4 transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-teal-500">FilmVault</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Welcome back {formData.username}. Review the films you love!
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-6 rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)]/90 p-8 shadow-2xl backdrop-blur-md transition-colors duration-300"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-xl border border-[color:var(--color-border-input)] bg-[var(--color-bg-input)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] outline-none transition-all duration-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="•••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-[color:var(--color-border-input)] bg-[var(--color-bg-input)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] outline-none transition-all duration-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-zinc-900 shadow-md transition-all hover:bg-teal-600 hover:shadow-teal-500/20 disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--color-border)]"></div>
            <span className="text-xs uppercase text-[var(--color-text-muted)]">
              or
            </span>
            <div className="h-px flex-1 bg-[var(--color-border)]"></div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full rounded-xl border border-[color:var(--color-border-input)] py-3 text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-bg-elevated)]"
          >
            Create a New Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
