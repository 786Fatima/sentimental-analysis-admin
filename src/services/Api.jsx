import axios from "axios";

export const API_BASE_URL = "http://127.0.0.1:5000/api/v1/sentimental-analysis";

export const MAX_LOGIN_TIME = 3600 * 24 * 2; // 2 days in seconds

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header to every request using token from localStorage
API.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
