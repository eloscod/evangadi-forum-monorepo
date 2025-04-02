import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const questionAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

questionAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

questionAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export const getQuestions = async (page = 1, limit = 5) => {
  try {
    const response = await questionAxios.get("/questions", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch questions" };
  }
};

export const getQuestionById = async (questionId) => {
  try {
    const response = await questionAxios.get(`/questions/${questionId}`);
    return response.data.question;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch question" };
  }
};

export const getAnswersByQuestionId = async (questionId) => {
  try {
    const response = await questionAxios.get(`/answers/${questionId}`);
    return response.data.answers || [];
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch answers" };
  }
};

export const postQuestion = async (questionData) => {
  try {
    const response = await questionAxios.post("/questions", questionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to post question" };
  }
};

export const postAnswer = async (answerData) => {
  try {
    const response = await questionAxios.post(`/answers`, answerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to post answer" };
  }
};

export const updateAnswer = async (answerId, answerData) => {
  try {
    const response = await questionAxios.put(
      `/answers/${answerId}`,
      answerData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update answer" };
  }
};

export const deleteAnswer = async (answerId) => {
  try {
    const response = await questionAxios.delete(`/answers/${answerId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete answer" };
  }
};

export const voteQuestion = async (questionId, voteType) => {
  try {
    const response = await questionAxios.post(`/vote/question/${questionId}`, {
      vote_value: voteType,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to vote on question" };
  }
};

export const voteAnswer = async (answerId, voteType) => {
  try {
    const response = await questionAxios.post(`/vote/answer/${answerId}`, {
      vote_value: voteType,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to vote on answer" };
  }
};
