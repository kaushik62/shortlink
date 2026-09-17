import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

export async function registerUser(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data.user || response.data.data?.user;
}

export async function loginUser(payload) {
  const response = await api.post("/auth/login", payload);
  return response.data.user || response.data.data?.user;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data.user || response.data.data?.user;
}

export async function logoutUser() {
  await api.post("/auth/logout");
}

export async function shortenUrl(originalUrl) {
  const response = await api.post("/urls", { originalUrl });
  return response.data.data;
}

export async function fetchUrls() {
  const response = await api.get("/urls");
  return response.data.data;
}

export async function deleteUrl(id) {
  await api.delete(`/urls/${id}`);
}
