import React from "react";

export function AuthShell({ mode = "login" }) {
  const signup = mode === "signup";
  return (
    <div className="premium-page">
      <nav className="premium-nav">
        <a href="/" className="premium-brand">
          <span className="brand-mark">↗</span><span>Shortly</span>
        </a>
      </nav>
      <main className="auth-shell">
        <section className="auth-card">
          <div className="auth-logo">↗</div>
          <h1 className="auth-title">{signup ? "Create your account" : "Welcome back"}</h1>
          <p className="auth-subtitle">
            {signup ? "Start creating short, memorable links in seconds." : "Log in to manage your links and analytics."}
          </p>

          {signup && <div className="auth-field"><label>Name</label><input placeholder="Your name" autoComplete="name" /></div>}
          <div className="auth-field"><label>Email</label><input type="email" placeholder="you@example.com" autoComplete="email" /></div>
          <div className="auth-field"><label>Password</label><input type="password" placeholder="••••••••" autoComplete={signup ? "new-password" : "current-password"} /></div>
          {signup && <div className="auth-field"><label>Confirm password</label><input type="password" placeholder="••••••••" autoComplete="new-password" /></div>}

          <button className="auth-button">{signup ? "Create account" : "Log in"}</button>

          <p className="auth-switch">
            {signup ? "Already have an account? " : "Don't have an account? "}
            <a href={signup ? "/login" : "/signup"}>{signup ? "Log in" : "Sign up"}</a>
          </p>
        </section>
      </main>
    </div>
  );
}
