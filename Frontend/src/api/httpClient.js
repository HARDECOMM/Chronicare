// src/api/httpClient.js
const BASE_URL = import.meta.env.VITE_API_URL;  // ✅ use your env var

function buildHeaders(token, extra = {}) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function handleResponse(res) {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(data?.error || `Request failed with status ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return data;
}

export const httpClient = {
  get: (path, token) =>
    fetch(`${BASE_URL}${path}`, { headers: buildHeaders(token) }).then(handleResponse),
  post: (path, body, token) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(body),
    }).then(handleResponse),
  patch: (path, body, token) =>
    fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: buildHeaders(token),
      body: JSON.stringify(body),
    }).then(handleResponse),
};
