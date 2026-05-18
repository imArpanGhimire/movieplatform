import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User } from "lucide-react";

import api from "../api/axios";
import moviesBg from "../images/bg1.jpg";

const initialFormData = {
  username: "",
  password: "",
};

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNotice, setShowNotice] = useState(true);

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        username: formData.username.trim(),
        password: formData.password,
      });

      setSuccess("Account created! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.log(err);

      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      {/* LEFT PANEL */}
      <div className="relative hidden h-screen w-[52%] lg:block">
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
          {/* LOGO */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-text-primary)] text-[var(--color-bg-base)]">
                <span className="text-sm font-bold">F</span>
              </div>

              <span className="text-base font-semibold">FilmVault</span>
            </div>

            <p className="text-sm text-[var(--color-text-muted)]">
              Create your FilmVault account.
            </p>
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-bold tracking-tight">Create account</h1>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Join FilmVault and start reviewing movies.
          </p>

          {/* FORM */}
          <form onSubmit={handleRegister} className="mt-8 space-y-4">
            {/* NOTICE */}
            {showNotice && (
              <div className="relative rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-2">
                <button
                  type="button"
                  onClick={() => setShowNotice(false)}
                  className="absolute right-2 top-2 text-xs text-yellow-300 hover:text-white"
                >
                  ✕
                </button>

                <span className="block pr-5 text-[11px] leading-relaxed text-yellow-200">
                  Remember your username. You'll need it if you ever forget your
                  password.
                </span>
              </div>
            )}

            {/* USERNAME */}
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
                  className="h-11 w-full rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] pl-9 pr-3 text-sm outline-none"
                />
              </div>
            </div>

            {/* PASSWORD */}
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
                  value={formData.password}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] pl-9 pr-10 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && <p className="text-xs text-red-500">{error}</p>}

            {/* SUCCESS */}
            {success && <p className="text-xs text-green-500">{success}</p>}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-[var(--color-text-primary)] text-sm font-semibold text-[var(--color-bg-base)]"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--color-border)]" />

            <span className="text-xs text-[var(--color-text-muted)]">
              Already have an account?
            </span>

            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={() => navigate("/login")}
            className="mt-4 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] py-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Sign in instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
