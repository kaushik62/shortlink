import { z } from "zod";

// Validates the payload for POST /api/urls.
// Uses z.string().url() to make sure we only ever try to shorten something
// that actually looks like a URL.
export const createUrlSchema = z.object({
  originalUrl: z
    .string({ required_error: "originalUrl is required" })
    .trim()
    .min(1, "originalUrl is required")
    .url("originalUrl must be a valid URL (include http:// or https://)"),
});
