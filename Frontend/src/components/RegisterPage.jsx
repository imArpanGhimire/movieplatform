import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [success, setsucess] = useState("");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  function handlechange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleregister(e) {
    e.preventDefault();
    seterror("");
    setloading(true);

    try {
      const res = await api.post("/auth/register", {
        username: formData.username.trim(),
        password: formData.password,
      });

      console.log("registration success", res.data);
      setsucess("User registered successfully");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (e) {
      seterror(e.response?.data?.message || "Something went wrong");
      console.log(e);
    } finally {
      setloading(false);
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
            Join our film community.
          </p>
        </div>

        <form
          onSubmit={handleregister}
          className="space-y-6 rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)]/90 p-8 shadow-2xl backdrop-blur-md transition-colors duration-300"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handlechange}
              className="w-full rounded-xl border border-[color:var(--color-border-input)] bg-[var(--color-bg-input)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] outline-none transition-all duration-200 focus:scale-[1.01] focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
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
              onChange={handlechange}
              className="w-full rounded-xl border border-[color:var(--color-border-input)] bg-[var(--color-bg-input)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] outline-none transition-all duration-200 focus:scale-[1.01] focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-500/25 bg-green-500/10 px-4 py-3">
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 py-3 font-semibold text-zinc-900 shadow-lg transition-all duration-200 hover:from-teal-400 hover:to-emerald-400 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="cursor-pointer border-none bg-none font-medium text-teal-500 transition-colors hover:text-teal-400"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
