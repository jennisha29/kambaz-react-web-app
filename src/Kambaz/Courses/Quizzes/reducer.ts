import { createSlice } from "@reduxjs/toolkit";
import { quizzes as rawQuizzes } from "../../Database";

interface QuizQuestion {
  id: string;
  text: string;
  type: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface Quiz {
  _id: string;
  courseId: string;
  title: string;
  status: string;
  published: boolean;
  availableDate: string;
  dueDate: string;
  points: number;
  questions: QuizQuestion[];
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  [key: string]: any;
}

interface QuizzesState {
  quizzes: Quiz[];
}

const mapToQuizType = (q: any): Quiz => ({
  ...q,
  courseId: q.course || q.courseId || "",
  createdBy: q.createdBy || "system",
  createdAt: q.createdAt || new Date().toISOString(),
});

const loadInitialState = (): QuizzesState => {
  try {
    const savedQuizzes = localStorage.getItem("quizzes");
    if (savedQuizzes) {
      console.log("Loaded quizzes from localStorage");
      return {
        quizzes: JSON.parse(savedQuizzes).map(mapToQuizType),
      };
    }
  } catch (e) {
    console.error("Failed to load from localStorage:", e);
  }

  console.log("Using default quizzes from Database");
  return {
    quizzes: rawQuizzes.map(mapToQuizType),
  };
};

const initialState = loadInitialState();
console.log("Initial quizzes data:", initialState.quizzes);

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    addQuiz: (state, action) => {
      const quizToAdd: Quiz = {
        ...action.payload,
        courseId: String(action.payload.courseId),
        createdBy: action.payload.createdBy || "system",
        createdAt: new Date().toISOString(),
      };
      state.quizzes.push(quizToAdd);
      localStorage.setItem("quizzes", JSON.stringify(state.quizzes));
    },

    deleteQuiz: (state, action) => {
      state.quizzes = state.quizzes.filter((quiz) => quiz._id !== action.payload);
      localStorage.setItem("quizzes", JSON.stringify(state.quizzes));
    },

    updateQuiz: (state, action) => {
      const updatedQuiz: Quiz = {
        ...action.payload,
        courseId: String(action.payload.courseId),
        updatedAt: new Date().toISOString(),
      };
      state.quizzes = state.quizzes.map((quiz) =>
        quiz._id === updatedQuiz._id ? updatedQuiz : quiz
      );
      localStorage.setItem("quizzes", JSON.stringify(state.quizzes));
    },

    setQuizzes: (state, action) => {
      state.quizzes = action.payload.map(mapToQuizType);
      localStorage.setItem("quizzes", JSON.stringify(state.quizzes));
    },
  },
});

export const { addQuiz, deleteQuiz, updateQuiz, setQuizzes } = quizzesSlice.actions;
export default quizzesSlice.reducer;
