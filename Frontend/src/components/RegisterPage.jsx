import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-500 mb-2">FilmVault</h1>
          <p className="text-slate-400 text-sm">Join our film community.</p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-8 space-y-6">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="john_doe"
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* Role Select */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Account Type
            </label>
            <select className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all">
              <option>Reviewer</option>
              <option>Filmmaker</option>
            </select>
          </div>

          {/* Register Button */}
          <button
            onClick={() => navigate("/movies")}
            className="w-full bg-teal-500 hover:bg-teal-600 text-zinc-900 font-semibold py-3 rounded-lg transition-all"
          >
            Create Account
          </button>
        </div>

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
