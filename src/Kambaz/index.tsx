import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import ProtectedRoute from "./Account/ProtectedRoute";
import Enrollments from "./Courses/Enrollment/index";
import Session from "./Account/Session";
import * as courseClient from "./Courses/client";
import * as userClient from "./Account/client";
import "./styles.css";

// Quizzes screens
import Quizzes from "./Courses/Quizzes/QuizList";
import QuizEditor from "./Courses/Quizzes/Editor";
import QuizTaker from "./Courses/Quizzes/Taker";
import QuizResults from "./Courses/Quizzes/Results";

export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>([]);
  const [course, setCourse] = useState<any>({
    name: "New Course",
    description: "New Description"
  });
  const [enrolling, setEnrolling] = useState<boolean>(false);

  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const findCoursesForUser = async () => {
    try {
      if (!currentUser) return;
      const courses = await userClient.findCoursesForUser(currentUser._id);
      setCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };

  // const fetchCourses = async () => {
  //   try {
  //     if (!currentUser) return;
  //     const allCourses = await courseClient.fetchAllCourses();
  //     const enrolledCourses = await userClient.findCoursesForUser(
  //       currentUser._id
  //     );
  //     const courses = allCourses.map((course: any) => {
  //       if (enrolledCourses.find((c: any) => c._id === course._id)) {
  //         return { ...course, enrolled: true };
  //       } else {
  //         return course;
  //       }
  //     });
  //     setCourses(courses);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const fetchCourses = async () => {
    try {
      if (!currentUser) return;
      const allCourses = await courseClient.fetchAllCourses();
      const enrolledCourses = await userClient.findCoursesForUser(
        currentUser._id
      );
      
      // Guard against null/undefined
      const coursesWithEnrollmentInfo = allCourses.map((course: any) => {
        if (Array.isArray(enrolledCourses) && 
            enrolledCourses.some((c: any) => c && c._id === course._id)) {
          return { ...course, enrolled: true };
        } else {
          return course;
        }
      });
      
      setCourses(coursesWithEnrollmentInfo);
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Fallback to empty array on error
      setCourses([]);
    }
  };

  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    try{
    console.log(`Attempting to ${enrolled ? 'enroll in' : 'unenroll from'} course ${courseId}`);
    if (enrolled) {
      await userClient.enrollIntoCourse(currentUser._id, courseId);
    } else {
      await userClient.unenrollFromCourse(currentUser._id, courseId);
    }
    console.log('API call successful');
    setCourses(
      courses.map((course) => {
        if (course._id === courseId) {
          return { ...course, enrolled: enrolled };
        } else {
          return course;
        }
      })
    );
  }catch (error) {
    console.error(`Error ${enrolled ? 'enrolling' : 'unenrolling'}:`, error);
  }
  };
 

  const addNewCourse = async () => {
    try {
      const newCourse = await courseClient.createCourse(course);
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

  useEffect(() => {
    if (currentUser) {
      if (enrolling) {
        fetchCourses();
      } else {
        findCoursesForUser();
      }
    }
  }, [currentUser, enrolling]);

  return (
    <Session>
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          <Routes>
            <Route path="/" element={<Navigate to="Account" />} />
            <Route path="/Account/*" element={<Account />} />

            <Route
              path="/Dashboard"
              element={
                <ProtectedRoute>
                  {React.createElement(Dashboard, {
                    courses,
                    course,
                    setCourse,
                    addNewCourse,
                    deleteCourse,
                    updateCourse,
                    enrolling,
                    setEnrolling,
                    updateEnrollment
                  })}    
                </ProtectedRoute>
              }
            />

            <Route
              path="/Courses/:cid/*"
              element={
                <ProtectedRoute requiresEnrollment={true}>
                  {React.createElement(Courses, { courses })}
                </ProtectedRoute>
              }
            />

            <Route
              path="/Courses/:cid/Quizzes"
              element={
                <ProtectedRoute requiresEnrollment={true}>
                  <Quizzes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Courses/:cid/Quizzes/:qid"
              element={
                <ProtectedRoute requiresEnrollment={true}>
                  <QuizEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Courses/:cid/Quizzes/:qid/Take"
              element={
                <ProtectedRoute requiresEnrollment={true}>
                  <QuizTaker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Courses/:cid/Quizzes/:qid/Results"
              element={
                <ProtectedRoute requiresEnrollment={true}>
                  <QuizResults />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Enrollments"
              element={
                <ProtectedRoute>
                  <Enrollments />
                </ProtectedRoute>
              }
            />

            <Route path="/Calendar" element={<h1>Calendar</h1>} />
            <Route path="/Inbox" element={<h1>Inbox</h1>} />
          </Routes>
        </div>
      </div>
    </Session>
  );
}