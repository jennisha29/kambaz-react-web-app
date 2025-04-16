import { createSlice } from "@reduxjs/toolkit";
import { Quiz, QuizAttempt, QuizQuestion } from "./client";

interface QuizzesState {
  quizzes: Quiz[];
  selectedQuiz: Quiz | null;
  quizAttempts: QuizAttempt[];
}

// Try to load initial state from localStorage if available
const loadInitialState = (): QuizzesState => {
  try {
    const savedQuizzes = localStorage.getItem('quizzes');
    if (savedQuizzes) {
      console.log("Loaded quizzes from localStorage");
      return { 
        quizzes: JSON.parse(savedQuizzes),
        selectedQuiz: null,
        quizAttempts: []
      };
    }
  } catch (e) {
    console.error("Failed to load quizzes from localStorage:", e);
  }
  
  return { 
    quizzes: [],
    selectedQuiz: null,
    quizAttempts: []
  };
};

const initialState: QuizzesState = loadInitialState();
console.log("Initial quizzes data:", initialState.quizzes);

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    // Set all quizzes
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
      
      try {
        localStorage.setItem('quizzes', JSON.stringify(action.payload));
      } catch (e) {
        console.error("Failed to save quizzes to localStorage:", e);
      }
    },
    
    // Add a new quiz
    addQuiz: (state, action) => {
      const quizToAdd = {
        ...action.payload,
        course: String(action.payload.course)
      };
      
      state.quizzes = [...state.quizzes, quizToAdd];
      
      try {
        localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
        console.log("Updated localStorage with new quizzes array");
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    },
    
    // Update an existing quiz
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
      }
      
      console.log("Updated quizzes state after update:", state.quizzes);
      
      try {
        localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    },
    
    // Delete a quiz
    deleteQuiz: (state, action) => {
      console.log("Deleting quiz from Redux:", action.payload);
      state.quizzes = state.quizzes.filter(quiz => quiz._id !== action.payload);
      
      if (state.selectedQuiz && state.selectedQuiz._id === action.payload) {
        state.selectedQuiz = null;
      }
      
      console.log("Updated quizzes state after delete:", state.quizzes);
      
      try {
        localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    },
    
    // Set the selected quiz
    setSelectedQuiz: (state, action) => {
      state.selectedQuiz = action.payload;
    },
    
    // Add a question to a quiz
    addQuestion: (state, action) => {
      if (state.selectedQuiz) {
        if (!state.selectedQuiz.questions) {
          state.selectedQuiz.questions = [];
        }
        
        // Add the question to the selected quiz
        state.selectedQuiz.questions.push(action.payload);
        
        // Update total points for the quiz
        state.selectedQuiz.points = state.selectedQuiz.questions.reduce(
          (sum, q) => sum + q.points, 0
        );
        
        // Update the quiz in the quizzes array
        const index = state.quizzes.findIndex(q => q._id === state.selectedQuiz?._id);
        if (index !== -1) {
          state.quizzes[index] = { ...state.selectedQuiz };
        }
        
        try {
          localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
        } catch (e) {
          console.error("Failed to save to localStorage:", e);
        }
      }
    },
    
    // Update a question in a quiz
    updateQuestion: (state, action) => {
      if (state.selectedQuiz && state.selectedQuiz.questions) {
        // Find and update the question in the selected quiz
        const questionIndex = state.selectedQuiz.questions.findIndex(
          q => q._id === action.payload._id
        );
        
        if (questionIndex !== -1) {
          state.selectedQuiz.questions[questionIndex] = action.payload;
          
          // Update total points for the quiz
          state.selectedQuiz.points = state.selectedQuiz.questions.reduce(
            (sum, q) => sum + q.points, 0
          );
          
          // Update the quiz in the quizzes array
          const quizIndex = state.quizzes.findIndex(q => q._id === state.selectedQuiz?._id);
          if (quizIndex !== -1) {
            state.quizzes[quizIndex] = { ...state.selectedQuiz };
          }
          
          try {
            localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
          } catch (e) {
            console.error("Failed to save to localStorage:", e);
          }
        }
      }
    },
    
    // Delete a question from a quiz
    deleteQuestion: (state, action) => {
      if (state.selectedQuiz && state.selectedQuiz.questions) {
        // Remove the question from the selected quiz
        state.selectedQuiz.questions = state.selectedQuiz.questions.filter(
          q => q._id !== action.payload
        );
        
        // Update total points for the quiz
        state.selectedQuiz.points = state.selectedQuiz.questions.reduce(
          (sum, q) => sum + q.points, 0
        );
        
        // Update the quiz in the quizzes array
        const quizIndex = state.quizzes.findIndex(q => q._id === state.selectedQuiz?._id);
        if (quizIndex !== -1) {
          state.quizzes[quizIndex] = { ...state.selectedQuiz };
        }
        
        try {
          localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
        } catch (e) {
          console.error("Failed to save to localStorage:", e);
        }
      }
    },
    
    // Set quiz publish status
    setQuizPublished: (state, action) => {
      const { quizId, published } = action.payload;
      
      // Update publish status in quizzes array
      const quizIndex = state.quizzes.findIndex(q => q._id === quizId);
      if (quizIndex !== -1) {
        state.quizzes[quizIndex].published = published;
      }
      
      // Update selected quiz if it's the one being published/unpublished
      if (state.selectedQuiz && state.selectedQuiz._id === quizId) {
        state.selectedQuiz.published = published;
      }
      
      try {
        localStorage.setItem('quizzes', JSON.stringify(state.quizzes));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    },
    
    // Set quiz attempts
    setQuizAttempts: (state, action) => {
      state.quizAttempts = action.payload;
    },
    
    // Add a quiz attempt
    addQuizAttempt: (state, action) => {
      state.quizAttempts.push(action.payload);
    }
  },
});

export const {
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