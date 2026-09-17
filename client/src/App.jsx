import { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AuthForm from "./components/AuthForm.jsx";
import { getCurrentUser, logoutUser } from "./services/api.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setCheckingAuth(false));
  }, []);

  async function handleLogout() {
    try { await logoutUser(); } finally {
      setUser(null);
      setPage("home");
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-950" />
          <p className="mt-3 text-sm text-slate-500">Loading ShortLink...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <main className="min-h-screen bg-slate-100 px-4 py-12"><AuthForm onAuthenticated={setUser} /></main>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <button onClick={() => setPage("home")} className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-950">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white">↗</span>
            ShortLink
          </button>

          <div className="flex items-center gap-1.5">
            <span className="mr-2 hidden text-sm text-slate-500 md:block">Hi, {user.name}</span>
            <button onClick={() => setPage("home")} className={`rounded-lg px-3 py-2 text-sm font-semibold ${page === "home" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Create</button>
            <button onClick={() => setPage("dashboard")} className={`rounded-lg px-3 py-2 text-sm font-semibold ${page === "dashboard" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Dashboard</button>
            <button onClick={handleLogout} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Logout</button>
          </div>
        </div>
      </nav>
      <main className="px-4 py-8">{page === "home" ? <Home /> : <Dashboard />}</main>
    </div>
  );
}
