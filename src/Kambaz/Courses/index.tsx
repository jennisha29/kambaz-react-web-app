import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import QuizList from "./Quizzes/QuizList"; // Update this import
import Details from "./Quizzes/Details"; // Add this import
import People from "./People";
import { Navigate, Route, Routes, useParams, useLocation } from "react-router";
import { useSelector } from "react-redux";
import QuizEditor from "./Quizzes/QuizEditor";
import QuizQuestionsEditor from "./Quizzes/QuizQuestionsEditor";
import QuizPreview from "./Quizzes/QuizPreview";
import QuizAttempt from "./Quizzes/QuizAttempt";

export default function Courses() {
  const { cid } = useParams();
  const { courses } = useSelector((state: any) => state.coursesReducer);

  const course = courses.find((course: any) => course._id === cid);

  const { pathname } = useLocation();
  const currentSection = pathname.split("/")[4] || "Home";

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        {course && course.name} &gt; {currentSection}
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation />
        </div>
        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route path="Piazza" element={<h2>Piazza</h2>} />
            <Route path="Zoom" element={<h2>Zoom</h2>} />
            <Route path="Assignments" element={<Assignments />} />
            <Route path="Assignments/new" element={<AssignmentEditor />} />
            <Route path="Assignments/:aid" element={<AssignmentEditor />} />

            {/* Quiz routes */}
            <Route path="Quizzes" element={<QuizList />} />
            <Route path="Quizzes/new" element={<QuizEditor />} />
            <Route path="Quizzes/:qid" element={<Details />} />
            <Route path="Quizzes/:qid/edit" element={<QuizEditor />} />
            <Route
              path="Quizzes/:qid/questions"
              element={<QuizQuestionsEditor />}
            />
            <Route path="Quizzes/:qid/preview" element={<QuizPreview />} />
            <Route path="Quizzes/:qid/take" element={<QuizAttempt />} />
            <Route path="Grades" element={<h2>Grades</h2>} />
            <Route path="People" element={<People />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
