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
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-500 mb-2">FilmVault</h1>
          <p className="text-slate-400 text-sm">Join our film community.</p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleregister}
          className="bg-zinc-800/80 backdrop-blur-md border border-zinc-700 rounded-2xl p-8 space-y-6 shadow-2xl"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handlechange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:scale-[1.01] transition-all duration-200"
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
              onChange={handlechange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:scale-[1.01] transition-all duration-200"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3">
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-zinc-900 font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-60 shadow-lg"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-teal-500 hover:text-teal-400 font-medium transition-colors bg-none border-none cursor-pointer"
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
