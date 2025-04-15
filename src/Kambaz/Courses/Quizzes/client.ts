import axios from 'axios';

const API_BASE = import.meta.env.VITE_REMOTE_SERVER || 'http://localhost:4000';
const QUIZZES_API = `${API_BASE}/api/quizzes`;


const api = axios.create({
  withCredentials: true
});


export const fetchAllQuizzes = async () => {
  const response = await api.get(QUIZZES_API);
  return response.data;
};


export const fetchQuizzesByCourse = async (courseId: string) => {
  const response = await api.get(`${API_BASE}/api/courses/${courseId}/quizzes`);
  return response.data;
};


export const fetchQuiz = async (quizId: string) => {
  const response = await api.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};


export const createQuiz = async (quiz: any) => {
  const response = await api.post(QUIZZES_API, quiz);
  return response.data;
};


export const updateQuiz = async (quizId: string, quiz: any) => {
  const response = await api.put(`${QUIZZES_API}/${quizId}`, quiz);
  return response.data;
};


export const deleteQuiz = async (quizId: string) => {
  const response = await api.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};


export const submitQuizAttempt = async (quizId: string, answers: any) => {
  const response = await api.post(`${API_BASE}/api/quiz-attempts`, {
    quizId,
    answers
  });
  return response.data;
};


export const fetchMyQuizAttempts = async () => {
  const response = await api.get(`${API_BASE}/api/my-quiz-attempts`);
  return response.data;
};

export const fetchQuizAttempts = async (quizId: string) => {
  const response = await api.get(`${QUIZZES_API}/${quizId}/attempts`);
  return response.data;
};