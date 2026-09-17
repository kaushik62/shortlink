import { useState } from "react";

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail in insecure contexts; fail silently rather
      // than breaking the UI.
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700"
      type="button"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
