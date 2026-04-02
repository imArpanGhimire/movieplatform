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
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-500 mb-2">FilmVault</h1>
          <p className="text-slate-400 text-sm">
            Welcome back {formData.username}. Review the films you love!
          </p>
        </div>

        <div className="mb-4 bg-zinc-800 border border-zinc-700 rounded-xl p-4">
          <p className="text-sm text-slate-300 font-medium mb-1">Quick Note</p>
          <p className="text-xs text-slate-400 leading-5">
            Login with your account to explore movies, reviews, and ratings.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-zinc-800 border border-zinc-700 rounded-xl p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="•••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-zinc-900 font-semibold py-3 rounded-lg transition-all disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-teal-500 hover:text-teal-400 font-medium transition-colors bg-none border-none cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
