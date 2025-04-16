import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export enum QuestionType {
  MULTIPLE_CHOICE = "Multiple Choice",
  TRUE_FALSE = "True/False",
  FILL_IN_BLANK = "Fill in the Blank"
}

export interface QuizQuestion {
  _id?: string;
  title: string;
  questionType: QuestionType;
  points: number;
  questionText: string;
  choices?: string[];
  correctAnswer: string | boolean | string[] | number; 
}


export interface Quiz {
  _id?: string;
  title: string;
  description?: string;
  points: number;
  dueDate: string;
  availableFromDate?: string;
  availableUntilDate?: string;
  course: string;
  published: boolean;
  quizType: string;
  assignmentGroup: string;
  shuffleAnswers: boolean; // Changed from string to boolean
  timeLimit?: number;
  multipleAttempts: boolean; // Changed from string to boolean
  attempts?: number;
  showCorrectAnswers: boolean; // Changed from string to boolean
  accessCode?: string;
  oneQuestionAtATime: boolean; // Changed from string to boolean
  webcamRequired: boolean; // Changed from string to boolean
  lockQuestionsAfterAnswering: boolean; // Changed from string to boolean
  questions: QuizQuestion[];
  // Add student score tracking
  userScore?: number;
}


export interface QuizAttempt {
  _id?: string;
  quiz: string;
  user: string;
  startTime: string;
  endTime?: string;
  score: number;
  answers: {
    questionId: string;
    answer: string | boolean | string[] | number;
    correct: boolean;
  }[];
}


export const findQuizzesForCourse = async (courseId: string) => {
  try {
    const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/quizzes`);
    console.log("Quizzes fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error finding quizzes for course:", error);
    return [];
  }
};


export const findQuizById = async (quizId: string) => {
  try {
    const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Error finding quiz by ID:", error);
    throw error;
  }
};


export const createQuiz = async (courseId: string, quiz: Partial<Quiz>) => {
  try {
    console.log("Creating quiz with data:", quiz);
    const response = await axiosWithCredentials.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
    console.log("Server response after creating quiz:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};


export const updateQuiz = async (quiz: Partial<Quiz>) => {
  try {
    console.log("Updating quiz with data:", quiz);
    if (!quiz._id) {
      throw new Error("Quiz ID is required for update");
    }
    const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quiz._id}`, quiz);
    console.log("Server response after updating quiz:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating quiz:", error);
    throw error;
  }
};


export const deleteQuiz = async (quizId: string) => {
  try {
    const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
};

export const publishQuiz = async (quizId: string, publish: boolean) => {
  try {
    const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/publish`, { published: publish });
    return response.data;
  } catch (error) {
    console.error(`Error ${publish ? 'publishing' : 'unpublishing'} quiz:`, error);
    throw error;
  }
};

export const submitQuizAttempt = async (quizId: string, attempt: Omit<QuizAttempt, "_id">) => {
  try {
    const response = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/attempts`, attempt);
    return response.data;
  } catch (error) {
    console.error("Error submitting quiz attempt:", error);
    throw error;
  }
};

export const getQuizAttemptsForUser = async (quizId: string, userId: string) => {
  try {
    const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting quiz attempts:", error);
    throw error;
  }
};

export const getAllQuizAttempts = async (quizId: string) => {
  try {
    const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts`);
    return response.data;
  } catch (error) {
    console.error("Error getting all quiz attempts:", error);
    throw error;
  }
};