// Backend API calls must use an explicitly configured server URL.
// GitHub Pages hosts static files only; it cannot execute Express routes.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  if (!API_BASE_URL) {
    throw new Error('Bu özellik için ayrı bir API sunucusu gerekir. GitHub Pages yalnızca site arayüzünü barındırır; VITE_API_BASE_URL yapılandırılmamış.');
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return fetch(`${API_BASE_URL}${normalizedPath}`, init);
}
