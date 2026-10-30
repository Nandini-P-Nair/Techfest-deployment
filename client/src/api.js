const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// credentials: 'include' sends the httpOnly cookie.
// X-Requested-With is the CSRF guard header the server expects.
export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(API + path, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
