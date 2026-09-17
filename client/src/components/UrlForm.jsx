import { useState } from "react";
import { shortenUrl } from "../services/api.js";

export default function UrlForm({ onShortened }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!originalUrl.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);
    try {
      const result = await shortenUrl(originalUrl.trim());
      onShortened(result);
      setOriginalUrl("");
    } catch (err) {
      setError(err.response?.data?.error || "Unable to shorten this URL.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full p-1">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="originalUrl"
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="https://example.com/your-long-url"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </div>
      {error && <p className="mt-2 px-1 text-sm text-red-600">{error}</p>}
    </form>
  );
}
