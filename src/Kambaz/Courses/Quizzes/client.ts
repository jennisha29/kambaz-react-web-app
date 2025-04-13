import axios from 'axios';

const API_BASE = import.meta.env.VITE_REMOTE_SERVER || 'http://localhost:4000';
const QUIZZES_API = `${API_BASE}/api/quizzes`;

// Configure axios with credentials for session support
const api = axios.create({
  withCredentials: true
});

// Get all quizzes
export const fetchAllQuizzes = async () => {
  const response = await api.get(QUIZZES_API);
  return response.data;
};

// Get quizzes for a specific course
export const fetchQuizzesByCourse = async (courseId: string) => {
  const response = await api.get(`${API_BASE}/api/courses/${courseId}/quizzes`);
  return response.data;
};

// Get a specific quiz
export const fetchQuiz = async (quizId: string) => {
  const response = await api.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

// Create a new quiz (faculty only)
export const createQuiz = async (quiz: any) => {
  const response = await api.post(QUIZZES_API, quiz);
  return response.data;
};

// Update a quiz (faculty only)
export const updateQuiz = async (quizId: string, quiz: any) => {
  const response = await api.put(`${QUIZZES_API}/${quizId}`, quiz);
  return response.data;
};

// Delete a quiz (faculty only)
export const deleteQuiz = async (quizId: string) => {
  const response = await api.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

// Submit a quiz attempt (student only)
export const submitQuizAttempt = async (quizId: string, answers: any) => {
  const response = await api.post(`${API_BASE}/api/quiz-attempts`, {
    quizId,
    answers
  });
  return response.data;
};

// Get my quiz attempts
export const fetchMyQuizAttempts = async () => {
  const response = await api.get(`${API_BASE}/api/my-quiz-attempts`);
  return response.data;
};

// Get quiz attempts for a specific quiz (faculty only)
export const fetchQuizAttempts = async (quizId: string) => {
  const response = await api.get(`${QUIZZES_API}/${quizId}/attempts`);
  return response.data;
};