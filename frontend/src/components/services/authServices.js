import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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
  try {
    const response = await authAxios.post("/users/register", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await authAxios.post("/users/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const getUserData = async () => {
  try {
    const response = await authAxios.get("/users/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user data" };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await authAxios.post("/users/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to send password reset email" }
    );
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await authAxios.post(`/users/reset-password/${token}`, {
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to reset password" };
  }
};
