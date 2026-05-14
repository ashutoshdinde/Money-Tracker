/** Production: set `VITE_API_BASE_URL` in Vercel (e.g. https://money-tracker-q3v2.onrender.com/api). */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'
).replace(/\/$/, '');
