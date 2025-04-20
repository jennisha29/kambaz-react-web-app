import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export enum QuestionType {
  MULTIPLE_CHOICE = "Multiple Choice",
  TRUE_FALSE = "True/False",
  FILL_IN_BLANK = "Fill in the Blank",
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
  shuffleAnswers: boolean;
  timeLimit?: number;
  multipleAttempts: boolean;
  attempts?: number;
  showCorrectAnswers: boolean;
  showCorrectAnswerOption?: string;
  accessCode?: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  questions: QuizQuestion[];
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

    const response = await axiosWithCredentials.get(
      `${COURSES_API}/${courseId}/quizzes`
    );
    // console.log("Quizzes fetched:", response.data);

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
    if (!quiz.title) {
      throw new Error("Quiz title is required");
    }

    if (!courseId) {
      throw new Error("Course ID is required to create a quiz");
    }
    const { _id, ...quizWithoutId } = quiz;

    const quizData = {
      ...quizWithoutId,
      course: courseId,
    };

    const response = await axiosWithCredentials.post(
      `${COURSES_API}/${courseId}/quizzes`,
      quizData
    );

    return response.data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};

export const updateQuiz = async (quiz: Partial<Quiz>) => {
  try {

    if (!quiz._id) {
      throw new Error("Quiz ID is required for update");
    }
    const quizId = quiz._id;
    const response = await axiosWithCredentials.put(
      `${QUIZZES_API}/${quizId}`,
      quiz
    );
    return response.data;
  } catch (error) {
    console.error("Error in client.updateQuiz:", error);
    throw error;
  }
};

export const deleteQuiz = async (quizId: string) => {
  try {
    const response = await axiosWithCredentials.delete(
      `${QUIZZES_API}/${quizId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
};

export const publishQuiz = async (quizId: string, publish: boolean) => {
  try {
    const response = await axiosWithCredentials.put(
      `${QUIZZES_API}/${quizId}/publish`,
      { published: publish }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error ${publish ? "publishing" : "unpublishing"} quiz:`,
      error
    );
    throw error;
  }
};

export const submitQuizAttempt = async (
  quizId: string,
  attempt: Omit<QuizAttempt, "_id">
) => {
  try {
    const response = await axiosWithCredentials.post(
      `${QUIZZES_API}/${quizId}/attempts`,
      attempt
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting quiz attempt:", error);
    throw error;
  }
};

export const getQuizAttemptsForUser = async (
  quizId: string,
  userId: string
) => {
  try {
    const response = await axiosWithCredentials.get(
      `${QUIZZES_API}/${quizId}/quiz-attempts/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting quiz attempts:", error);
    throw error;
  }
};

export const getAllQuizAttempts = async (quizId: string) => {
  try {
    const response = await axiosWithCredentials.get(
      `${QUIZZES_API}/${quizId}/attempts`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting all quiz attempts:", error);
    throw error;
  }
};

export const addQuestionToQuiz = async (
  quizId: string,
  question: QuizQuestion
) => {
  try {

    const response = await axiosWithCredentials.post(
      `${QUIZZES_API}/${quizId}/questions`,
      question
    );

    return response.data;
  } catch (error) {
    console.error("Error adding question to quiz:", error);
    throw error;
  }
};

export const updateQuizQuestion = async (
  quizId: string,
  questionId: string,
  updates: Partial<QuizQuestion>
) => {
  try {

    const response = await axiosWithCredentials.put(
      `${QUIZZES_API}/${quizId}/questions/${questionId}`,
      updates
    );


    return response.data;
  } catch (error) {
    console.error("Error updating quiz question:", error);
    throw error;
  }
};

export const deleteQuizQuestion = async (
  quizId: string,
  questionId: string
) => {
  try {
    const response = await axiosWithCredentials.delete(
      `${QUIZZES_API}/${quizId}/questions/${questionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting quiz question:", error);
    throw error;
  }
};

const QUIZ_ATTEMPTS_API = `${REMOTE_SERVER}/api/quiz-attempts`;

export const createQuizAttempt = async (attempt: Omit<QuizAttempt, "_id">) => {
  try {
    const response = await axiosWithCredentials.post(
      QUIZ_ATTEMPTS_API,
      attempt
    );
    return response.data;
  } catch (error) {
    console.error("Error creating quiz attempt:", error);
    throw error;
  }
};

export const findQuizAttemptsByUserId = async (userId: string) => {
  try {
    const response = await axiosWithCredentials.get(
      `${QUIZ_ATTEMPTS_API}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz attempts by userId:", error);
    throw error;
  }
};
