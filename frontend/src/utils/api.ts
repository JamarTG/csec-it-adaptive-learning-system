import axios from "axios";
import { LoginFormFields, RegisterFormFields, CreateQuizPayload, UserUpdatePayload } from "../types/auth";

export const BASE_URL = "http://localhost:5000/api";

const axiosInstanceWithCredentials = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const handleRequest = async (request: Promise<any>) => {
  try {
    const { data } = await request;
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const AuthAPI = {
  register: (userData: RegisterFormFields) => handleRequest(axiosInstance.post("/auth/register", userData)),
  login: (userData: LoginFormFields) => handleRequest(axiosInstance.post("/auth/login", userData)),
  checkAuth: () => handleRequest(axiosInstanceWithCredentials.get("/auth/check-auth")),
};

export const UserAPI = {
  fetchUserInfo: () => handleRequest(axiosInstanceWithCredentials.get("/settings/user-info")),
  updateUserInfo: (userInfoPayload: UserUpdatePayload) =>
  handleRequest(axiosInstanceWithCredentials.put("/settings/user-info", userInfoPayload)),
  deleteAccount: () => handleRequest(axiosInstanceWithCredentials.post("settings/delete-account", {})),
};

export const QuizAPI = {
  createQuiz: (createQuizPayload: CreateQuizPayload) => handleRequest(axiosInstanceWithCredentials.post("/quiz/create", createQuizPayload)),
  getTopics: () => handleRequest(axiosInstanceWithCredentials.get("/topics")),
  getQuizzes: () => handleRequest(axiosInstanceWithCredentials.get("/quiz/all")),
  deleteQuiz: (quizId: string) => handleRequest(axiosInstanceWithCredentials.delete(`/quiz/${quizId}`)),
  // createQuiz: (quizData: any) => handleRequest(axiosInstanceWithCredentials.post("/quiz", quizData)),
  // updateQuiz: (quizId: string, quizData: any) => handleRequest(axiosInstanceWithCredentials.put(`/quiz/${quizId}`, quizData)),
  // deleteQuiz: (quizId: string) => handleRequest(axiosInstanceWithCredentials.delete(`/quiz/${quizId}`)),
};
