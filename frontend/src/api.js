export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.eventmax.in/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}

export function resolveApiAssetUrl(url) {
  if (!url) return "";
  return String(url).replace(/^https?:\/\/(?:127\.0\.0\.1|localhost):5000/i, API_ORIGIN);
}
