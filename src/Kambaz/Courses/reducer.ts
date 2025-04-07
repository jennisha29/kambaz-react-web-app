import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import * as db from "../Database";

export interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  image: string;
  description: string;
}

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


const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    getCourses: (state) => {
      state.courses = db.courses;
    },
    
    
    addCourse: (state) => {
      const newCourse = { ...state.selectedCourse, _id: uuidv4() };
      state.courses.push(newCourse);
      state.selectedCourse = initialCourse;
    },
    
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(
        (course) => course._id !== action.payload
      );
    },
    
    updateCourse: (state) => {
      state.courses = state.courses.map((course) => {
        if (course._id === state.selectedCourse._id) {
          return state.selectedCourse;
        }
        return course;
      });
    },
    
    setSelectedCourse: (state, action: PayloadAction<Course>) => {
      state.selectedCourse = action.payload;
    },
    
    resetSelectedCourse: (state) => {
      state.selectedCourse = initialCourse;
    }
  }
});

export const {
  getCourses,
  addCourse,
  deleteCourse,
  updateCourse,
  setSelectedCourse,
  resetSelectedCourse
} = coursesSlice.actions;


export default coursesSlice.reducer;