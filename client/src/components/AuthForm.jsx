import { useState } from "react";
import { loginUser, registerUser } from "../services/api.js";

export default function AuthForm({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isRegister = mode === "register";

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function switchMode() {
    setMode(isRegister ? "login" : "register");
    setError("");
    setShowPassword(false);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = isRegister
        ? await registerUser(form)
        : await loginUser({
            email: form.email,
            password: form.password,
          });

      onAuthenticated(user);
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.error || "Unable to authenticate. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 5h6m0 0v6m0-6L10 14"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 13v5a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h5"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            {isRegister
              ? "Create an account to start shortening and managing your links."
              : "Sign in to shorten links, track clicks, and manage your URLs."}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">

          {/* Mode Switch */}
          <div className="mb-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                !isRegister
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                isRegister
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={submit} className="space-y-5">

            {/* Name */}
            {isRegister && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full name
                </label>

                <div className="relative">
                  <svg
                    className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 20.25a7.5 7.5 0 0115 0"
                    />
                  </svg>

                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    required
                    minLength={2}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-950/5"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>

              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7.5l9 6 9-6"
                  />
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                  />
                </svg>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-950/5"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>

                {!isRegister && (
                  <button
                    type="button"
                    className="text-xs font-medium text-slate-500 hover:text-slate-950"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                  />
                  <path
                    strokeLinecap="round"
                    d="M8 10V7a4 4 0 018 0v3"
                  />
                </svg>

                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
                  minLength={isRegister ? 8 : 1}
                  placeholder={
                    isRegister
                      ? "Create a strong password"
                      : "Enter your password"
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-950/5"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.58 10.58a2 2 0 102.83 2.83"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 5.09A9.5 9.5 0 0112 4.5c5.25 0 9 4.5 9 7.5a8.4 8.4 0 01-2.13 3.82"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12s3.5-6 9.75-6 9.75 6 9.75 6-3.5 6-9.75 6-9.75-6-9.75-6z"
                      />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  )}
                </button>
              </div>

              {isRegister && (
                <p className="mt-2 text-xs text-slate-400">
                  Use at least 8 characters for your password.
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path
                    strokeLinecap="round"
                    d="M12 8v4"
                  />
                  <path
                    strokeLinecap="round"
                    d="M12 16h.01"
                  />
                </svg>

                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      className="opacity-25"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      d="M21 12a9 9 0 00-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Please wait...
                </>
              ) : (
                <>
                  {isRegister ? "Create account" : "Sign in"}
                  <span className="text-base transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={switchMode}
                className="font-semibold text-slate-950 hover:underline"
              >
                {isRegister ? "Sign in" : "Create one"}
              </button>
            </p>
          </div>
        </div>

        {/* Trust text */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Your links and account information are securely protected.
        </p>
      </div>
    </div>
  );
}
