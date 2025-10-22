import axios from "axios";
import { getAdminToken } from "./authToken";

export const API_BASE_URL =
  "http://127.0.0.1:5000/api/v1/sentimental-analysis/admin-panel";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// fallback token for development (use localStorage in production)
const FALLBACK_TOKEN =
  "eyJhZG1pbl9pZCI6IjY4ZTIxY2M0MzVlMDRlZjk1MWRmZTI2OSJ9.aPkY1A.YFJ0u911ujipNck2x5e4krUYizo";

// Attach Authorization header to every request using token from localStorage
API.interceptors.request.use(
  (config) => {
    const token = getAdminToken() || FALLBACK_TOKEN;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
