// pages/api/image-proxy.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// List of allowed domains for security
const ALLOWED_DOMAINS = [
  "cloudinary.com",
  "mrbrownbakery.com",
  "res.cloudinary.com",
  // Add other trusted domains here
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing or invalid URL parameter" });
  }

  try {
    // Parse the URL to check the domain for security
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    // Security check: Only allow specific domains
    if (
      !ALLOWED_DOMAINS.some((allowedDomain) => domain.includes(allowedDomain))
    ) {
      return res.status(403).json({
        error: "Domain not allowed",
        message:
          "For security reasons, we only proxy images from trusted domains.",
      });
    }

    // Fetch the image with timeout and proper headers
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 5000, // 5 second timeout
      headers: {
        "User-Agent": "Image Proxy Service",
        Accept: "image/*",
      },
      maxContentLength: 5 * 1024 * 1024, // 5MB max size
    });

    // Set response headers
    const contentType = response.headers["content-type"];
    res.setHeader("Content-Type", contentType);

    // Add caching headers
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day
    res.setHeader("Expires", new Date(Date.now() + 86400000).toUTCString());

    // Return the image data
    return res.send(response.data);
  } catch (error) {
    console.error("Error proxying image:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a non-2xx status
        return res.status(error.response.status).json({
          error: "External server error",
          status: error.response.status,
        });
      } else if (error.request) {
        // The request was made but no response was received
        return res.status(504).json({ error: "Gateway timeout" });
      } else {
        // Something happened in setting up the request
        return res.status(500).json({ error: "Request configuration error" });
      }
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}

// Configure the API route to handle larger payloads for images
export const config = {
  api: {
    bodyParser: false,
    responseLimit: "8mb",
  },
};
