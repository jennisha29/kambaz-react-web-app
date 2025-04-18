import { createSlice } from "@reduxjs/toolkit";
import { Quiz, QuizAttempt} from "./client";

interface QuizzesState {
  quizzes: Quiz[];
  selectedQuiz: Quiz | null;
  quizAttempts: QuizAttempt[];
  loading: boolean;
  error: string | null;
}

const loadInitialState = (): QuizzesState => {
  try {
    const savedQuizzes = localStorage.getItem('quizzes');
    const savedSelectedQuiz = localStorage.getItem('selectedQuiz');
    
    if (savedQuizzes) {
      console.log("Loaded quizzes from localStorage");
      return { 
        quizzes: JSON.parse(savedQuizzes),
        selectedQuiz: savedSelectedQuiz ? JSON.parse(savedSelectedQuiz) : null,
        quizAttempts: [],
        loading: false,
        error: null
      };
    }
  } catch (e) {
    console.error("Failed to load quizzes from localStorage:", e);
  }
  
  return { 
    quizzes: [],
    selectedQuiz: null,
    quizAttempts: [],
    loading: false,
    error: null
  };
};

const initialState: QuizzesState = loadInitialState();
console.log("Initial quizzes data:", initialState.quizzes);

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
      state.loading = false;
      state.error = null;
      
      try {
        localStorage.setItem('quizzes', JSON.stringify(action.payload));
      } catch (e) {
        console.error("Failed to save quizzes to localStorage:", e);
      }
    },
    
    addQuiz: (state, action) => {
      const quizToAdd = {
        ...action.payload,
        course: String(action.payload.course)
      };
      
      state.quizzes = [...state.quizzes, quizToAdd];
      state.loading = false;
      state.error = null;
      
      try {
        localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
        console.log("Updated localStorage with new quizzes array");
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    },
    
    updateQuiz: (state, action) => {
      console.log("Updating quiz in Redux:", action.payload);
      const updatedQuiz = {
        ...action.payload,
        course: String(action.payload.course)
      };
      
      state.quizzes = state.quizzes.map((quiz) =>
        quiz._id === updatedQuiz._id ? updatedQuiz : quiz
      );
      
      if (state.selectedQuiz && state.selectedQuiz._id === updatedQuiz._id) {
        state.selectedQuiz = updatedQuiz;
        try {
          localStorage.setItem('selectedQuiz', JSON.stringify(updatedQuiz));
        } catch (e) {
          console.error("Failed to save selected quiz to localStorage:", e);
        }
      }
      
      state.loading = false;
      state.error = null;
      
      console.log("Updated quizzes state after update:", state.quizzes);
      
      try {
        localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    },
    
    deleteQuiz: (state, action) => {
      console.log("Deleting quiz from Redux:", action.payload);
      state.quizzes = state.quizzes.filter(quiz => quiz._id !== action.payload);
      
      if (state.selectedQuiz && state.selectedQuiz._id === action.payload) {
        state.selectedQuiz = null;
        try {
          localStorage.removeItem('selectedQuiz');
        } catch (e) {
          console.error("Failed to remove selected quiz from localStorage:", e);
        }
      }
      
      state.loading = false;
      state.error = null;
      
      console.log("Updated quizzes state after delete:", state.quizzes);
      
      try {
        localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    },
    
    setSelectedQuiz: (state, action) => {
      console.log("Setting selected quiz:", action.payload);
      state.selectedQuiz = action.payload;
      state.error = null;
      
      try {
        if (action.payload) {
          localStorage.setItem('selectedQuiz', JSON.stringify(action.payload));
        } else {
          localStorage.removeItem('selectedQuiz');
        }
      } catch (e) {
        console.error("Failed to save selected quiz to localStorage:", e);
      }
    },
    
    addQuestion: (state, action) => {
      console.log("Adding question to Redux:", action.payload);
      if (state.selectedQuiz) {
        if (!state.selectedQuiz.questions) {
          state.selectedQuiz.questions = [];
        }
        
        state.selectedQuiz.questions.push(action.payload);
        
        state.selectedQuiz.points = state.selectedQuiz.questions.reduce(
          (sum, q) => sum + (Number(q.points) || 0), 0
        );
        
        const index = state.quizzes.findIndex(q => q._id === state.selectedQuiz?._id);
        if (index !== -1) {
          state.quizzes[index] = { ...state.selectedQuiz };
        }
        
        try {
          localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
          localStorage.setItem('selectedQuiz', JSON.stringify(state.selectedQuiz));
        } catch (e) {
          console.error("Failed to save to localStorage:", e);
        }
      }
      
      state.loading = false;
      state.error = null;
    },
    
    updateQuestion: (state, action) => {
      console.log("Updating question in Redux:", action.payload);
      if (state.selectedQuiz && state.selectedQuiz.questions) {
        const questionIndex = state.selectedQuiz.questions.findIndex(
          q => q._id === action.payload._id
        );
        
        if (questionIndex !== -1) {
          state.selectedQuiz.questions[questionIndex] = action.payload;
          
          state.selectedQuiz.points = state.selectedQuiz.questions.reduce(
            (sum, q) => sum + (Number(q.points) || 0), 0
          );
          
          const quizIndex = state.quizzes.findIndex(q => q._id === state.selectedQuiz?._id);
          if (quizIndex !== -1) {
            state.quizzes[quizIndex] = { ...state.selectedQuiz };
          }
          
          try {
            localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
            localStorage.setItem('selectedQuiz', JSON.stringify(state.selectedQuiz));
          } catch (e) {
            console.error("Failed to save to localStorage:", e);
          }
        }
      }
      
      state.loading = false;
      state.error = null;
    },
    
    deleteQuestion: (state, action) => {
      console.log("Deleting question from Redux:", action.payload);
      if (state.selectedQuiz && state.selectedQuiz.questions) {
        state.selectedQuiz.questions = state.selectedQuiz.questions.filter(
          q => q._id !== action.payload
        );

        state.selectedQuiz.points = state.selectedQuiz.questions.reduce(
          (sum, q) => sum + (Number(q.points) || 0), 0
        );
        
        const quizIndex = state.quizzes.findIndex(q => q._id === state.selectedQuiz?._id);
        if (quizIndex !== -1) {
          state.quizzes[quizIndex] = { ...state.selectedQuiz };
        }
        
        try {
          localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
          localStorage.setItem('selectedQuiz', JSON.stringify(state.selectedQuiz));
        } catch (e) {
          console.error("Failed to save to localStorage:", e);
        }
      }
      
      state.loading = false;
      state.error = null;
    },
    
    setQuizPublished: (state, action) => {
      const { quizId, published } = action.payload;
      
      const quizIndex = state.quizzes.findIndex(q => q._id === quizId);
      if (quizIndex !== -1) {
        state.quizzes[quizIndex].published = published;
      }

      if (state.selectedQuiz && state.selectedQuiz._id === quizId) {
        state.selectedQuiz.published = published;
        
        try {
          localStorage.setItem('selectedQuiz', JSON.stringify(state.selectedQuiz));
        } catch (e) {
          console.error("Failed to save selected quiz to localStorage:", e);
        }
      }
      
      try {
        localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
      
      state.loading = false;
      state.error = null;
    },
    
    setQuizAttempts: (state, action) => {
      state.quizAttempts = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    addQuizAttempt: (state, action) => {
      state.quizAttempts.push(action.payload);
      state.loading = false;
      state.error = null;
    }
  },
});

export const {
  setLoading,
  setError,
  setQuizzes,
  addQuiz,
  updateQuiz,
  deleteQuiz,
  setSelectedQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  setQuizPublished,
  setQuizAttempts,
  addQuizAttempt
} = quizzesSlice.actions;

export default quizzesSlice.reducer;