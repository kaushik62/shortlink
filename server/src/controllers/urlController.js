import * as urlService from "../services/urlService.js";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

function toResponseShape(row) {
  return {
    id: row.id,
    originalUrl: row.original_url,
    shortCode: row.short_code,
    shortUrl: `${BASE_URL}/${row.short_code}`,
    clicks: row.clicks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastAccessedAt: row.last_accessed_at,
  };
}

export async function createUrl(req, res, next) {
  try {
    const row = await urlService.createShortUrl(req.body.originalUrl, req.user.id);
    res.status(201).json({ success: true, data: toResponseShape(row) });
  } catch (err) { next(err); }
}

export async function getAllUrls(req, res, next) {
  try {
    const rows = await urlService.listUrls(req.user.id);
    res.json({ success: true, data: rows.map(toResponseShape) });
  } catch (err) { next(err); }
}

export async function getUrl(req, res, next) {
  try {
    const row = await urlService.getUrlById(req.params.id, req.user.id);
    res.json({ success: true, data: toResponseShape(row) });
  } catch (err) { next(err); }
}

export async function removeUrl(req, res, next) {
  try {
    await urlService.deleteUrl(req.params.id, req.user.id);
    res.json({ success: true, message: "Short URL deleted" });
  } catch (err) { next(err); }
}

export async function redirectToOriginal(req, res, next) {
  try {
    const originalUrl = await urlService.resolveAndTrackClick(req.params.shortCode);
    res.redirect(originalUrl);
  } catch (err) { next(err); }
}
