// src/api/httpClient.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function handle(res, method, path) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = `${method} ${path} failed: ${res.status}`;
    try {
      const json = JSON.parse(text);
      if (json?.error) message = json.error;
    } catch {}
    throw new Error(message);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  // fallback: return raw text so caller can decide what to do
  return { raw: await res.text() };
}

export const httpClient = {
  get: async (path, token) => {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return handle(res, "GET", path);
  },

  post: async (path, body, token) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return handle(res, "POST", path);
  },

  patch: async (path, body, token) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return handle(res, "PATCH", path);
  },

  delete: async (path, token) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return handle(res, "DELETE", path);
  },
};
