// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────
export const register = (data) => API.post("/auth/register", data);
export const login    = (data) => API.post("/auth/login", data);

// ── Items ─────────────────────────────────────────────────
// getItems supports ?type=lost|found &category= &status=open|resolved &search=
export const getItems    = (params) => API.get("/items", { params });
export const getMyItems  = ()       => API.get("/items/my");

// createItem uses FormData because it may include an image file
export const createItem  = (formData) =>
  API.post("/items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateStatus = (id, status) =>
  API.patch(`/items/${id}/status`, { status });

export const deleteItem  = (id) => API.delete(`/items/${id}`);

export default API;
