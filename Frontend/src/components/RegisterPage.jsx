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

    console.log("formData:", formData);
    console.log("type of username:", typeof formData.username);
    try {
      const res = await api.post("/auth/register", {
        username: formData.username.trim(),
        password: formData.password,
      });

      console.log("registration success", res.data);
      setsucess("user is registered");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (e) {
      seterror(e.response?.data?.message || "kei error aayo la");
      console.log(e);
    } finally {
      setloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-500 mb-2">FilmVault</h1>
          <p className="text-slate-400 text-sm">Join our film community.</p>
        </div>

        {/* Form Card */}

        <form
          onSubmit={handleregister}
          className="bg-zinc-800 border border-zinc-700 rounded-xl p-8 space-y-6"
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
              onChange={handlechange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-zinc-900 font-semibold py-3 rounded-lg transition-all disabled:opacity-60"
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
