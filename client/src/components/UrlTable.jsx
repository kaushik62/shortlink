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
          {urls.map((url) => (
            <tr key={url.id} className="hover:bg-slate-50">
              <td className="max-w-xs truncate px-4 py-3 text-slate-700" title={url.originalUrl}>
                {url.originalUrl}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-900 underline underline-offset-2 hover:text-slate-600"
                  >
                    {url.shortCode}
                  </a>
                  <CopyButton text={url.shortUrl} />
                </div>
              </td>
              <td className="px-4 py-3 text-slate-700">{url.clicks}</td>
              <td className="px-4 py-3 text-slate-700">{formatDate(url.createdAt)}</td>
              <td className="px-4 py-3 text-slate-700">{formatDate(url.lastAccessedAt)}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
