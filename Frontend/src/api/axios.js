import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const { refreshToken, setAccessToken, logout } = useAuthStore.getState();

    if (error.response?.status === 401 && refreshToken && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`,
          { refresh: refreshToken }
        );
        setAccessToken(data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        logout();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;