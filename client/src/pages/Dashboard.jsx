import { useEffect, useMemo, useState } from "react";
import UrlTable from "../components/UrlTable.jsx";
import { fetchUrls, deleteUrl } from "../services/api.js";

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUrls() {
    setLoading(true);
    setError("");
    try {
      setUrls(await fetchUrls());
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load your links.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUrls();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this short URL?")) return;
    try {
      await deleteUrl(id);
      setUrls((prev) => prev.filter((url) => url.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete the URL.");
    }
  }

  const totalClicks = useMemo(
    () => urls.reduce((sum, url) => sum + Number(url.clicks || 0), 0),
    [urls],
  );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-slate-400">OVERVIEW</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
            Your links
          </h1>
          <p className="mt-2 text-slate-500">
            Manage and monitor every short link from one place.
          </p>
        </div>
        <button
          onClick={loadUrls}
          disabled={loading}
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Links</p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {urls.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">Links created by you</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Clicks</p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {totalClicks}
          </p>
          <p className="mt-1 text-xs text-slate-400">Across all your links</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Link Performance</p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {urls.length > 0 ? Math.round(totalClicks / urls.length) : 0}
          </p>
          <p className="mt-1 text-xs text-slate-400">Average clicks per link</p>
        </div>
      </div>

      <UrlTable urls={urls} onDelete={handleDelete} loading={loading} />
    </div>
  );
}
