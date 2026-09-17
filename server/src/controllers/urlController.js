import * as urlService from "../services/urlService.js";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

function formatUrl(url) {
  if (!url) return null;
  return {
    id: url.id,
    userId: url.user_id,
    user_id: url.user_id,
    originalUrl: url.original_url,
    original_url: url.original_url,
    shortCode: url.short_code,
    short_code: url.short_code,
    shortUrl: `${BASE_URL}/${url.short_code}`,
    clicks: Number(url.clicks || 0),
    createdAt: url.created_at,
    created_at: url.created_at,
    lastAccessedAt: url.last_accessed_at,
    last_accessed_at: url.last_accessed_at,
  };
}

// Create short URL
export async function createUrl(req, res, next) {
  try {
    const url = await urlService.createShortUrl(
      req.body.originalUrl,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: formatUrl(url),
    });
  } catch (error) {
    next(error);
  }
}

// Get all URLs
export async function getAllUrls(req, res, next) {
  try {
    const urls = await urlService.listUrls(req.user.id);

    res.json({
      success: true,
      data: urls.map(formatUrl),
    });
  } catch (error) {
    next(error);
  }
}

// Get one URL
export async function getUrl(req, res, next) {
  try {
    const url = await urlService.getUrlById(
      req.params.id,
      req.user.id
    );

    if (!url) {
      return res.status(404).json({
        success: false,
        error: "URL not found",
      });
    }

    res.json({
      success: true,
      data: formatUrl(url),
    });
  } catch (error) {
    next(error);
  }
}

// Delete URL
export async function removeUrl(req, res, next) {
  try {
    await urlService.deleteUrl(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      message: "Short URL deleted",
    });
  } catch (error) {
    next(error);
  }
}

// Redirect short URL
export async function redirectToOriginal(req, res, next) {
  try {
    const originalUrl = await urlService.resolveAndTrackClick(
      req.params.shortCode
    );

    res.redirect(originalUrl);
  } catch (error) {
    if (error.message === "URL not found") {
      return res.status(404).send("Short URL not found");
    }
    next(error);
  }
}