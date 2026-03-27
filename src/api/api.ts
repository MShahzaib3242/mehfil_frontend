import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");

      window.location.href = "/login";
    }

    if (error?.response?.data?.message === "ACCOUNT_DEACTIVATED") {
      return Promise.reject(error);
    }

    if (status === 403) {
      window.location.href = "/";

      toast.error("This page is not accessible or Blocked.");
    }

    return Promise.reject(error);
  },
);

export default api;
