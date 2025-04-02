import axios from "axios";

const API_URL = "http://localhost:7700/api";

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
  const response = await questionAxios.get("/questions", {
    params: { page, limit },
  });
  return response.data;
};

export const getQuestionById = async (questionId) => {
  const response = await questionAxios.get(`/questions/${questionId}`);
  return response.data.question;
};

export const getAnswersByQuestionId = async (questionId) => {
  const response = await questionAxios.get(`/answers/${questionId}`);
  return response.data.answers || [];
};

export const postQuestion = async (questionData) => {
  const response = await questionAxios.post("/questions", questionData);
  return response.data;
};

export const postAnswer = async (answerData) => {
  const response = await questionAxios.post(`/answers`, answerData);
  return response.data;
};

export const updateAnswer = async (answerId, answerData) => {
  const response = await questionAxios.put(`/answers/${answerId}`, answerData);
  return response.data;
};

export const deleteAnswer = async (answerId) => {
  const response = await questionAxios.delete(`/answers/${answerId}`);
  return response.data;
};

export const voteQuestion = async (questionId, voteType) => {
  const response = await questionAxios.post(`/vote/question/${questionId}`, {
    vote_value: voteType,
  });
  return response.data;
};

export const voteAnswer = async (answerId, voteType) => {
  const response = await questionAxios.post(`/vote/answer/${answerId}`, {
    vote_value: voteType,
  });
  return response.data;
};
