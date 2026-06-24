export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.eventmax.in/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
export const ADMIN_TOKEN_KEY = "eventmax_admin_token";

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const token = getAdminToken();
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...options
  });

  const data = await response.json();
  if (response.status === 401) {
    clearAdminToken();
    if (window.location.pathname !== "/admin/login") {
      window.history.replaceState({}, "", "/admin/login");
      window.dispatchEvent(new Event("eventmax-auth-change"));
    }
  }
  if (!response.ok || data.success === false) {
    throw new Error(data.error || "API request failed");
  }
  return data;
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const data = await apiRequest("/uploads/image", {
    method: "POST",
    body: formData
  });
  return data.file.url;
}

export function resolveApiAssetUrl(url) {
  if (!url) return "";
  return String(url).replace(/^https?:\/\/(?:127\.0\.0\.1|localhost):5000/i, API_ORIGIN);
}
