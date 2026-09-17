import * as urlService from "../services/urlService.js";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// Create short URL
export async function createUrl(req, res) {
  try {
    const url = await urlService.createShortUrl(
      req.body.originalUrl,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: {
        ...url,
        shortUrl: `${BASE_URL}/${url.short_code}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get all URLs
export async function getAllUrls(req, res) {
  try {
    const urls = await urlService.listUrls(req.user.id);

    res.json({
      success: true,
      data: urls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get one URL
export async function getUrl(req, res) {
  try {
    const url = await urlService.getUrlById(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      data: url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Delete URL
export async function removeUrl(req, res) {
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Redirect short URL
export async function redirectToOriginal(req, res) {
  try {
    const originalUrl = await urlService.resolveAndTrackClick(
      req.params.shortCode
    );

    res.redirect(originalUrl);

  } catch (error) {
    res.status(500).send("Unable to redirect");
  }
}