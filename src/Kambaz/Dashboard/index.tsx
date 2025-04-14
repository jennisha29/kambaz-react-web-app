import { Link, useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, FormControl, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import {
  addCourse,
  deleteCourse,
  updateCourse,
  setSelectedCourse,
} from "../Courses/reducer";
import * as coursesClient from "../Courses/client";
import * as userClient from "../Account/client";
import * as enrollmentClient from "../Courses/Enrollment/client";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEnrollmentView, setIsEnrollmentView] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { selectedCourse } = useSelector((state: any) => state.coursesReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentReducer);

  const isFaculty = currentUser?.role === "FACULTY";

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        await userClient.findMyCourses();
        const allCourses = await coursesClient.fetchAllCourses();
        const userEnrollments = await enrollmentClient.findEnrollmentsForUser(currentUser._id);
        const normalEnrollments = userEnrollments.map((e: any) => ({
          user: e.user?._id || e.user,
          course: e.course?._id || e.course,
        }));

        setCourses(allCourses);
        dispatch({ type: "enrollment/getEnrollments", payload: normalEnrollments });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, dispatch]);

  const coursesCount = courses.length;

  const handleAddCourse = async () => {
    try {
      const newCourse = await userClient.createCourse(selectedCourse);
      dispatch(addCourse(newCourse));
      setCourses([...courses, newCourse]);
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleUpdateCourse = async () => {
    try {
      await coursesClient.updateCourse(selectedCourse);
      dispatch(updateCourse());
      setCourses(courses.map((c) => (c._id === selectedCourse._id ? selectedCourse : c)));
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!courseToDelete) return;

      await coursesClient.deleteCourse(courseToDelete);
      dispatch(deleteCourse(courseToDelete));
      setCourses(courses.filter((c) => c._id !== courseToDelete));

      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleSetCourse = (course: any) => {
    dispatch(setSelectedCourse(course));
  };

  const handleCourseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSelectedCourse({ ...selectedCourse, name: e.target.value }));
  };

  const handleCourseDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSelectedCourse({ ...selectedCourse, description: e.target.value }));
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollmentClient.enrollUserInCourse(currentUser._id, courseId);
      dispatch({
        type: "enrollment/addEnrollment",
        payload: { user: currentUser._id, course: courseId },
      });
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    try {
      await enrollmentClient.unenrollUserFromCourse(currentUser._id, courseId);
      dispatch({
        type: "enrollment/deleteEnrollment",
        payload: { user: currentUser._id, course: courseId },
      });
    } catch (error) {
      console.error("Error unenrolling from course:", error);
    }
  };

  const toggleEnrollmentView = () => {
    setIsEnrollmentView(!isEnrollmentView);
  };

  const handleGoToCourse = (courseId: string, isEnrolled: boolean) => {
    if (isEnrolled) {
      navigate(`/Kambaz/Courses/${courseId}/Home`);
    } else {
      alert("You must be enrolled in this course to access it.");
    }
  };

  if (loading) {
    return <div>Loading courses...</div>;
  }

  return (
    <div id="wd-dashboard" style={{ position: "relative" }}>
      <Button
        variant="primary"
        className="position-absolute top-0 end-0 m-2"
        onClick={toggleEnrollmentView}
      >
        Enrollment
      </Button>

      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      {isFaculty && (
        <>
          <h5>
            New Course
            <Button
              variant="primary"
              className="float-end"
              onClick={handleAddCourse}
              id="wd-add-new-course-click"
            >
              Add
            </Button>
            <Button
              variant="warning"
              className="float-end me-2"
              onClick={handleUpdateCourse}
              id="wd-update-course-click"
            >
              Update
            </Button>
          </h5>
          <br />

          <FormControl
            value={selectedCourse.name}
            onChange={handleCourseNameChange}
            className="mb-2"
            placeholder="Course Name"
          />

          <FormControl
            as="textarea"
            rows={3}
            value={selectedCourse.description}
            onChange={handleCourseDescriptionChange}
            placeholder="Course Description"
          />
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">
        {isEnrollmentView ? "All Courses" : "Published Courses"} ({coursesCount})
      </h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {courses.map((c: any) => {
            const isEnrolled = enrollments.some(
              (enrollment: any) =>
                enrollment.user === currentUser?._id &&
                enrollment.course === c._id
            );

            return (
              <Col key={c._id} className="wd-dashboard-course" style={{ width: "320px" }}>
                <Card>
                  <Link
                    to={isEnrolled ? `/Kambaz/Courses/${c._id}/Home` : "#"}
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                    onClick={(e) => {
                      if (!isEnrolled) {
                        e.preventDefault();
                        alert("You must be enrolled in this course to access it.");
                      }
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={c.image || "/images/reactjs.jpg"}
                      width="100%"
                      height={200}
                      alt={`${c.name} image`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/images/reactjs.jpg";
                      }}
                    />
                    <Card.Body className="card-body">
                      <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {c.name}
                      </Card.Title>
                      <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "50px" }}>
                        {c.description}
                      </Card.Text>
                    </Card.Body>
                  </Link>

                  <div className="p-2">
                    {isEnrollmentView ? (
                      <div style={{ display: "flex", gap: "5px" }}>
                        <Button variant="primary" onClick={() => handleGoToCourse(c._id, isEnrolled)}>Go</Button>

                        {isEnrolled ? (
                          <Button variant="danger" onClick={() => handleUnenroll(c._id)}>Unenroll</Button>
                        ) : (
                          <Button variant="success" onClick={() => handleEnroll(c._id)}>Enroll</Button>
                        )}

                        {isFaculty && (
                          <>
                            <Button id="wd-edit-course-click" className="btn btn-warning" onClick={() => handleSetCourse(c)}>Edit</Button>
                            <Button variant="danger" onClick={() => handleDeleteClick(c._id)} id="wd-delete-course-click">Delete</Button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: "flex" }}>
                        <Button variant="primary" onClick={() => handleGoToCourse(c._id, isEnrolled)} className="me-2">Go</Button>

                        {isFaculty && (
                          <div style={{ display: "flex" }}>
                            <Button id="wd-edit-course-click" className="btn btn-warning me-2" onClick={() => handleSetCourse(c)}>Edit</Button>
                            <Button variant="danger" onClick={() => handleDeleteClick(c._id)} id="wd-delete-course-click">Delete</Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this course? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}