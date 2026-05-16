/** Production: set `VITE_API_URL` (e.g. https://your-backend-domain.com). */
const apiHost = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
export const API_BASE_URL = `${apiHost.replace(/\/$/, '')}/api`;
