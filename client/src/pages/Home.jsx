import { useState } from "react";
import UrlForm from "../components/UrlForm.jsx";
import UrlResult from "../components/UrlResult.jsx";

export default function Home() {
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-6xl">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-16 text-white shadow-2xl sm:px-12">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-slate-700/30 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            One long URL.
            <span className="block text-slate-400">One short link.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Create clean, short, and shareable links with fast redirection,
            reliable link management, and secure user authentication.
          </p>

          <div className="mx-auto mt-9 max-w-3xl rounded-2xl bg-white p-2 text-left shadow-2xl">
            <UrlForm onShortened={setResult} />
          </div>

          <div className="mx-auto mt-5 max-w-3xl">
            <UrlResult result={result} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 py-8 sm:grid-cols-3">
        {[
          [
            "01",
            "Short & Shareable",
            "Turn long URLs into clean, memorable short links that are easy to share anywhere.",
          ],
          [
            "02",
            "Fast Redirection",
            "Get near-instant redirects with optimized link lookups for a smooth browsing experience.",
          ],
          [
            "03",
            "Secure Link Management",
            "Create and manage your shortened URLs securely with authenticated user accounts.",
          ],
        ].map(([number, title, text]) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <span className="text-xs font-bold tracking-widest text-slate-400">
              {number}
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
