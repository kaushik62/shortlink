import CopyButton from "./CopyButton.jsx";

export default function UrlResult({ result }) {
  if (!result) return null;

  return (
    <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-4">
      <p className="mb-1 text-sm text-slate-500">Your short URL is ready</p>
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <a
          href={result.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-medium text-slate-900 underline underline-offset-2 hover:text-slate-600"
        >
          {result.shortUrl}
        </a>
        <CopyButton text={result.shortUrl} />
      </div>
    </div>
  );
}
