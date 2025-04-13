import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../Account/reducer";
import modulesReducer from "../Courses/Modules/reducer";
import assignmentsReducer from "../Courses/Assignments/reducer";
import coursesReducer from "../Courses/reducer";
import enrollmentReducer from "../Courses/Enrollment/reducer";
import quizzesReducer from "../Courses/Quizzes/reducer";

const store = configureStore({
  reducer: {
    accountReducer,
    modulesReducer,
    assignmentsReducer,
    coursesReducer,
    enrollmentReducer,
    quizzesReducer
  },
});

export default store;


