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
import QuizEditor from "./Courses/Quizzes/QuizEditor";
import QuizList from "./Courses/Quizzes/QuizList";
import Details from "./Courses/Quizzes/Details";
import "./styles.css";

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
      setCourses(Array.isArray(courses) ? courses.filter(c => c !== null && c !== undefined) : []);
    } catch (error) {
      console.error(error);
      setCourses([]);
    }
  };

  const fetchCourses = async () => {
    try {
      if (!currentUser) return;
      const allCourses = await courseClient.fetchAllCourses();
      const enrolledCourses = await userClient.findCoursesForUser(
        currentUser._id
      );
      
      const validCourses = Array.isArray(allCourses) 
        ? allCourses.filter(c => c !== null && c !== undefined)
        : [];
      
      const coursesWithEnrollmentInfo = validCourses.map((course: any) => {
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
      setCourses([]);
    }
  };

  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    try {
      console.log(`Attempting to ${enrolled ? 'enroll in' : 'unenroll from'} course ${courseId}`);
      if (enrolled) {
        await userClient.enrollIntoCourse(currentUser._id, courseId);
      } else {
        await userClient.unenrollFromCourse(currentUser._id, courseId);
      }
      console.log('API call successful');
    
      setCourses(prevCourses => 
        prevCourses.map((c) => {
          if (c && c._id === courseId) {
            return { ...c, enrolled: enrolled };
          }
          return c;
        })
      );
      
      if (enrolling) {
        await fetchCourses();
      } else {
        await findCoursesForUser();
      }
    } catch (error) {
      console.error(`Error ${enrolled ? 'enrolling' : 'unenrolling'}:`, error);
    }
  };

  const addNewCourse = async () => {
    try {
      const newCourse = await courseClient.createCourse(course);
      
      if (newCourse) {
        setCourses(prevCourses => [...prevCourses, newCourse]);
      }
      
      setCourse({
        name: "New Course",
        description: "New Description"
      });
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      await courseClient.deleteCourse(courseId);
      
      setCourses(prevCourses => 
        prevCourses.filter((c) => c && c._id !== courseId)
      );
      
      if (course && course._id === courseId) {
        setCourse({
          name: "New Course",
          description: "New Description"
        });
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const updateCourse = async () => {
    try {
      if (!course || !course._id) {
        console.error("No valid course selected for update");
        return;
      }
      
      await courseClient.updateCourse(course);
      
      setCourses(prevCourses =>
        prevCourses.map((c) => {
          if (c && c._id === course._id) {
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
                    courses: courses.filter(c => c !== null),
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
                  {React.createElement(Courses, { 
                    courses: courses.filter(c => c !== null)
                  })}
                </ProtectedRoute>
              }
            />
            <Route
            path="/Kambaz/Courses/:cid/Quizzes"
            element={
            <ProtectedRoute requiresEnrollment={true}>
              <QuizList />
            </ProtectedRoute>
          }/>
          
          <Route
          path="/Kambaz/Courses/:cid/Quizzes/new"
          element={
          <ProtectedRoute requiresEnrollment={true}>
            <QuizEditor />
          </ProtectedRoute>
        }/>
        
         <Route
          path="/Kambaz/Courses/:cid/Quizzes/:qid"
        element={
        <ProtectedRoute requiresEnrollment={true}>
          <Details />
        </ProtectedRoute> } />
        
        <Route
        path="/Kambaz/Courses/:cid/Quizzes/:qid/edit"
        element={
        <ProtectedRoute requiresEnrollment={true}>
          <QuizEditor />
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