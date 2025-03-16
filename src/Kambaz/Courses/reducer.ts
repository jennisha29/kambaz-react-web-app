import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import * as db from "../Database";

// Define the Course type
export interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  image: string;
  description: string;
}

// Define the initial state
export interface CoursesState {
  courses: Course[];
  selectedCourse: Course;
}

const initialCourse: Course = {
  _id: "0",
  name: "New Course",
  number: "New Number",
  startDate: "2023-09-10",
  endDate: "2023-12-15",
  image: "/images/reactjs.jpg",
  description: "New Description"
};

const initialState: CoursesState = {
  courses: db.courses,
  selectedCourse: initialCourse
};

// Create the slice
const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    // Get all courses (initialize)
    getCourses: (state) => {
      state.courses = db.courses;
    },
    
    // Add a new course
    addCourse: (state) => {
      const newCourse = { ...state.selectedCourse, _id: uuidv4() };
      state.courses.push(newCourse);
      state.selectedCourse = initialCourse;
    },
    
    // Delete a course
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(
        (course) => course._id !== action.payload
      );
    },
    
    // Update a course
    updateCourse: (state) => {
      state.courses = state.courses.map((course) => {
        if (course._id === state.selectedCourse._id) {
          return state.selectedCourse;
        }
        return course;
      });
    },
    
    // Set the selected course (for editing)
    setSelectedCourse: (state, action: PayloadAction<Course>) => {
      state.selectedCourse = action.payload;
    },
    
    // Reset the form (clear selected course)
    resetSelectedCourse: (state) => {
      state.selectedCourse = initialCourse;
    }
  }
});

// Export actions
export const {
  getCourses,
  addCourse,
  deleteCourse,
  updateCourse,
  setSelectedCourse,
  resetSelectedCourse
} = coursesSlice.actions;

// Export reducer
export default coursesSlice.reducer;