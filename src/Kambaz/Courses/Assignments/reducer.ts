import { createSlice } from "@reduxjs/toolkit";
import { assignments } from "../../Database";

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  points: number;
  dueDate: string;
  availableFromDate: string;
  availableUntilDate?: string;
  course: string;
  module?: string;
  [key: string]: any;
}

interface AssignmentsState {
  assignments: Assignment[];
}

const loadInitialState = (): AssignmentsState => {
  try {
    const savedAssignments = localStorage.getItem('assignments');
    if (savedAssignments) {
      console.log("Loaded assignments from localStorage");
      return { assignments: JSON.parse(savedAssignments) };
    }
  } catch (e) {
    console.error("Failed to load from localStorage:", e);
  }
  
  console.log("Using default assignments from Database");
  return { assignments };
};

const initialState = loadInitialState();
console.log("Initial assignments data:", initialState.assignments);

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, action) => { 
      const assignmentToAdd: Assignment = {
        ...action.payload,
        course: String(action.payload.course)
      };
      
      state.assignments = [...state.assignments, assignmentToAdd];
          
      try {
        localStorage.setItem('assignments', JSON.stringify(state.assignments));
        console.log("Updated localStorage with new assignments array");
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    },
    deleteAssignment: (state, action) => {
      console.log("Deleting assignment from Redux:", action.payload);
      state.assignments = state.assignments.filter(
        (assignment: Assignment) => assignment._id !== action.payload
      );
      
      console.log("Updated assignments state after delete:", state.assignments);
      try {
        localStorage.setItem('assignments', JSON.stringify(state.assignments));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    },

    updateAssignment: (state, action) => {
      console.log("Updating assignment in Redux:", action.payload);
      const updatedAssignment: Assignment = {
        ...action.payload,
        course: String(action.payload.course)
      };
      
      state.assignments = state.assignments.map((assignment: Assignment) =>
        assignment._id === updatedAssignment._id
          ? updatedAssignment
          : assignment
      );
      
      console.log("Updated assignments state after update:", state.assignments);
      
      try {
        localStorage.setItem('assignments', JSON.stringify(state.assignments));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    },
    setAssignments: (state, action) => {
      console.log("Setting all assignments in Redux:", action.payload);
      state.assignments = action.payload;
      
      try {
        localStorage.setItem('assignments', JSON.stringify(action.payload));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    },
  },
});

export const {
  addAssignment,
  deleteAssignment,
  updateAssignment,
  setAssignments
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;