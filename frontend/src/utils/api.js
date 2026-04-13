// ============================================================
// utils/api.js - Axios instance with base URL and auth header
// ============================================================

import axios from "axios";

// Create an axios instance with the backend base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// ---- Request Interceptor ----
// Automatically attach JWT token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
