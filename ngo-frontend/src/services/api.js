import axios from "axios";

const API = axios.create({
  baseURL: "http://18.234.55.208:8000",
  timeout: 10000,
});
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (response) => response,

  (error) => {
    const method = error.config?.method?.toUpperCase() || "REQUEST";
    const url = error.config?.url || "unknown-url";
    console.error(`[API ${method}] ${url}`, error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default API;
