import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Film, Lock, User } from "lucide-react";

import api from "../api/axios";

const initialFormData = {
  username: "",
  password: "",
};

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      console.log("Login failed:", err);

      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg-base)] px-4 py-12 text-[var(--color-text-primary)]">
      <BackgroundGlow />

      <div className="relative z-10 w-full max-w-sm">
        <BrandSection />

        <div className="rounded-xl border border-[color:var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-lg shadow-black/5">
          <form onSubmit={handleLogin} className="space-y-4">
            <InputField
              icon={<User size={14} />}
              label="Username"
              type="text"
              name="username"
              placeholder="yourusername"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
            />

            <PasswordField
              value={formData.password}
              onChange={handleChange}
              showPassword={showPassword}
              togglePassword={() => setShowPassword((prev) => !prev)}
            />

            {error && <ErrorMessage message={error} />}

            <button
              type="submit"
              disabled={loading}
              className="h-10 w-full rounded-lg bg-[var(--color-text-primary)] text-sm font-medium text-[var(--color-bg-base)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <Divider />

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="h-10 w-full rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-card)] text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
          >
            Create an account
          </button>
        </div>

        <FooterText />
      </div>
    </div>
  );
};

const BackgroundGlow = () => (
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute -left-32 top-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/[0.06] blur-3xl" />
    <div className="absolute -right-32 bottom-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/[0.04] blur-3xl" />
  </div>
);

const BrandSection = () => (
  <div className="mb-8 flex flex-col items-center text-center">
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-text-primary)] text-[var(--color-bg-base)]">
      <Film size={20} />
    </div>

    <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>

    <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
      Sign in to continue to FilmVault
    </p>
  </div>
);

const InputField = ({
  icon,
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  autoComplete,
}) => (
  <div>
    <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
      {label}
    </label>

    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
        {icon}
      </div>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="h-10 w-full rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-input)] pl-9 pr-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] outline-none transition focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/15"
      />
    </div>
  </div>
);

const PasswordField = ({ value, onChange, showPassword, togglePassword }) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between">
      <label className="block text-xs font-medium text-[var(--color-text-secondary)]">
        Password
      </label>

      <button
        type="button"
        className="text-xs font-medium text-teal-500 transition hover:text-teal-400"
      >
        Forgot?
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
        placeholder="••••••••"
        value={value}
        onChange={onChange}
        autoComplete="current-password"
        className="h-10 w-full rounded-lg border border-[color:var(--color-border)] bg-[var(--color-bg-input)] pl-9 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] outline-none transition focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/15"
      />

      <button
        type="button"
        onClick={togglePassword}
        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--color-text-muted)] transition hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2">
    <p className="text-xs text-red-400">{message}</p>
  </div>
);

const Divider = () => (
  <div className="my-5 flex items-center gap-3">
    <div className="h-px flex-1 bg-[color:var(--color-border)]" />

    <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
      New to FilmVault
    </span>

    <div className="h-px flex-1 bg-[color:var(--color-border)]" />
  </div>
);

const FooterText = () => (
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
);

export default LoginPage;
