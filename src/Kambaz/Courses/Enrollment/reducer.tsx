import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import * as db from "../../Database";

export interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

export interface EnrollmentState {
  enrollments: Enrollment[];
}

const initialState: EnrollmentState = {
  enrollments: db.enrollments
};

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {
    
    getEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
    },

    addEnrollment: (state, action: PayloadAction<{ user: string; course: string }>) => {
      const { user, course } = action.payload;

      const exists = state.enrollments.some(
        enrollment => enrollment.user === user && enrollment.course === course
      );

      if (!exists) {
        const newEnrollment: Enrollment = {
          _id: uuidv4(),
          user,
          course
        };

        state.enrollments.push(newEnrollment);
      }
    },

    deleteEnrollment: (state, action: PayloadAction<{ user: string; course: string }>) => {
      const { user, course } = action.payload;

      state.enrollments = state.enrollments.filter(
        enrollment => !(enrollment.user === user && enrollment.course === course)
      );
    }
  }
});

export const {
  getEnrollments,
  addEnrollment,
  deleteEnrollment
} = enrollmentSlice.actions;

export default enrollmentSlice.reducer;
