import CopyButton from "./CopyButton.jsx";

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UrlTable({ urls, onDelete, loading }) {
  if (loading) {
    return <p className="py-8 text-center text-slate-500">Loading your links...</p>;
  }

  if (!urls || urls.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 py-12 text-center">
        <p className="text-slate-500">No shortened URLs yet.</p>
        <p className="mt-1 text-sm text-slate-400">
          Create one from the Home page to see it here.
        </p>
      </div>
    );
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 font-medium text-slate-600">Original URL</th>
            <th className="px-4 py-3 font-medium text-slate-600">Short URL</th>
            <th className="px-4 py-3 font-medium text-slate-600">Clicks</th>
            <th className="px-4 py-3 font-medium text-slate-600">Created At</th>
            <th className="px-4 py-3 font-medium text-slate-600">Last Access</th>
            <th className="px-4 py-3 font-medium text-slate-600">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {urls.map((url) => {
            const originalUrl = url.originalUrl || url.original_url || "";
            const shortCode = url.shortCode || url.short_code || "";
            const shortUrl = url.shortUrl || `${apiBaseUrl}/${shortCode}`;
            const createdAt = url.createdAt || url.created_at;
            const lastAccessedAt = url.lastAccessedAt || url.last_accessed_at;

            return (
              <tr key={url.id} className="hover:bg-slate-50">
                <td className="max-w-xs truncate px-4 py-3 text-slate-700" title={originalUrl}>
                  {originalUrl}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-slate-900 underline underline-offset-2 hover:text-slate-600"
                    >
                      {shortCode}
                    </a>
                    <CopyButton text={shortUrl} />
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">{url.clicks ?? 0}</td>
                <td className="px-4 py-3 text-slate-700">{formatDate(createdAt)}</td>
                <td className="px-4 py-3 text-slate-700">{formatDate(lastAccessedAt)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onDelete(url.id)}
                    type="button"
                    className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
