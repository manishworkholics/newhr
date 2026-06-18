const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.29.85:5000/api";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: options.body instanceof FormData
      ? options.headers || {}
      : { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  const data = await response.json();
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
