import axios from "axios";

const API_URL = "http://localhost:7700/api";

const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerUser = async (data) => {
  const response = await authAxios.post("/users/register", data);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await authAxios.post("/users/login", credentials);
  return response.data;
};

export const getUserData = async () => {
  const response = await authAxios.get("/users/me"); // Updated to match your endpoint
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await authAxios.post("/users/forgot-password", { email });
  return response.data;
}

export const resetPassword = async (token, password) => {
  const response = await authAxios.post(`/users/reset-password/${token}`, { password });
  return response.data;
}