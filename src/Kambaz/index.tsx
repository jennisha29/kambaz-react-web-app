import React from 'react';
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import ProtectedRoute from "./Account/ProtectedRoute";
import Enrollments from "./Courses/Enrollment";
import Session from "./Account/Session";
import * as courseClient from "./Courses/client";
import * as userClient from "./Account/client";
import "./styles.css";

export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>([]);
  const [course, setCourse] = useState<any>({
    name: "New Course",
    description: "New Description"
  });
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  // Add new course
  const addNewCourse = async () => {
    try {
      const newCourse = await userClient.createCourse(course);
      setCourses([...courses, newCourse]);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      await courseClient.deleteCourse(courseId);
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };
  
  const updateCourse = async () => {
    try {
      await courseClient.updateCourse(course);
      setCourses(
        courses.map((c) => {
          if (c._id === course._id) {
            return course;
          } else {
            return c;
          }
        })
      );
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      if (currentUser) {
        const courses = await userClient.findMyCourses();
        setCourses(courses);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchCourses();
  }, [currentUser]);

  return (
    <Session>
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          <Routes>
            <Route path="/" element={<Navigate to="Account" />} />
            <Route path="/Account/*" element={<Account />} />
            {/* <Route path="/Dashboard" element={
              <ProtectedRoute>
                <Dashboard courses={courses} />
              </ProtectedRoute>
            } /> */}
            <Route path="/Dashboard" element={
              <ProtectedRoute>
                {React.createElement(Dashboard, { 
                  courses,
                  course,
                  setCourse,
                  addNewCourse,
                  deleteCourse,
                  updateCourse
                })}
              </ProtectedRoute>
            } />
            {/* <Route path="/Courses/:cid/*" element={
              <ProtectedRoute requiresEnrollment={true}>
                <Courses courses={courses} />
              </ProtectedRoute>
            } /> */}
            <Route path="/Courses/:cid/*" element={
              <ProtectedRoute requiresEnrollment={true}>
                {React.createElement(Courses, { courses })}
              </ProtectedRoute>
            } />

            <Route path="/Enrollments" element={
              <ProtectedRoute>
                <Enrollments />
              </ProtectedRoute>
            } />
            <Route path="/Calendar" element={<h1>Calendar</h1>} />
            <Route path="/Inbox" element={<h1>Inbox</h1>} />
          </Routes>
        </div>
      </div>
    </Session>
  );
}