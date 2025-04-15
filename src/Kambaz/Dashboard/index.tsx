import { Link, useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, FormControl, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import { getEnrollments } from '../Courses/Enrollment/reducer';
import {
  addCourse as addCourseAction,
  deleteCourse as deleteCourseAction,
  updateCourse as updateCourseAction,
  setSelectedCourse,
} from "../Courses/reducer";
import * as enrollmentClient from "../Courses/Enrollment/client";

export default function Dashboard({ 
  courses,
  course,
  setCourse,
  addNewCourse,
  deleteCourse,
  updateCourse,
  enrolling, 
  setEnrolling,
  updateEnrollment
}: { 
  courses: any[];
  course: any;
  setCourse: (course: any) => void;
  addNewCourse: () => void;
  deleteCourse: (courseId: string) => void;
  updateCourse: () => void;
  enrolling: boolean; 
  setEnrolling: (enrolling: boolean) => void;
  updateEnrollment: (courseId: string, enrolled: boolean) => Promise<void>;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments = [] } = useSelector((state: any) => state.enrollmentReducer || {});

  const isFaculty = currentUser?.role === "FACULTY";

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
  
      try {
        setLoading(true);
        const userEnrollments = await enrollmentClient.findEnrollmentsForUser(currentUser._id);
        
        // Add type checking before mapping
        if (Array.isArray(userEnrollments)) {
          dispatch(getEnrollments(userEnrollments.map((e: any) => ({
            _id: e._id,
            user: e.user?._id || e.user,
            course: e.course?._id || e.course,
          }))));
        } else {
          console.error("Expected array of enrollments but got:", userEnrollments);
          // Initialize with empty array if not an array
          dispatch(getEnrollments([]));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        // Initialize with empty array on error
        dispatch(getEnrollments([]));
      }
    };
  
    fetchData();
  }, [currentUser, dispatch]);

  // Count of enrolled courses - only counting enrolled courses when not in enrolling mode
  const coursesCount = useMemo(() => {
    if (enrolling) {
      return courses?.length || 0;
    } else {
      // Count only enrolled courses
      return courses?.filter(c => {
        if (!c) return false;
        return Boolean(
          (Array.isArray(enrollments) && currentUser && 
            enrollments.some(
              (enrollment: any) =>
                enrollment &&
                enrollment.user &&
                enrollment.course &&
                currentUser?._id &&
                enrollment.user === currentUser._id &&
                enrollment.course === c._id
            )) || 
          (c && c.enrolled === true)
        );
      }).length || 0;
    }
  }, [enrolling, courses, enrollments, currentUser]);

  const handleSetCourse = (course: any) => {
    if (!course) return;
    setCourse(course);
    dispatch(setSelectedCourse(course));
  };

  const handleCourseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCourse = { ...course, name: e.target.value };
    setCourse(updatedCourse);
    dispatch(setSelectedCourse(updatedCourse));
  };

  const handleCourseDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCourse = { ...course, description: e.target.value };
    setCourse(updatedCourse);
    dispatch(setSelectedCourse(updatedCourse));
  };

  const handleDeleteClick = (courseId: string) => {
    if (!courseId) return;
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!courseToDelete) return;
      
      await deleteCourse(courseToDelete);
      // The parent component will handle fetching updated courses
      // We still dispatch to keep Redux in sync
      dispatch(deleteCourseAction(courseToDelete));

      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleAddCourse = async () => {
    try {
      await addNewCourse();
      // The parent component will handle fetching updated courses
      // We still dispatch to keep Redux in sync
      dispatch(addCourseAction());
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleUpdateCourse = async () => {
    try {
      await updateCourse();
      // The parent component will handle fetching updated courses
      // We still dispatch to keep Redux in sync
      dispatch(updateCourseAction());
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!courseId) return;
    try {
      await updateEnrollment(courseId, true)
      dispatch({
        type: "enrollment/addEnrollment",
        payload: { user: currentUser._id, course: courseId },
      });
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    if (!courseId) return;
    try {
      await updateEnrollment(courseId, false);
      dispatch({
        type: "enrollment/deleteEnrollment",
        payload: { user: currentUser._id, course: courseId },
      });
    } catch (error) {
      console.error("Error unenrolling from course:", error);
    }
  };

  const handleGoToCourse = (courseId: string, isEnrolled: boolean) => {
    if (!courseId) return;
    if (isEnrolled) {
      navigate(`/Kambaz/Courses/${courseId}/Home`);
    } else {
      alert("You must be enrolled in this course to access it.");
    }
  };

  if (loading && (!courses || courses.length === 0)) {
    return <div>Loading courses...</div>;
  }

  if (!currentUser) {
    return <div>Please log in to view courses</div>;
  }

  if (!Array.isArray(courses)) {
    return <div>No courses available</div>;
  }

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">
        Dashboard
        <button onClick={() => setEnrolling(!enrolling)} className="float-end btn btn-primary">
          {enrolling ? "My Courses" : "All Courses"}
        </button>
      </h1>
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
            value={course?.name || ""}
            onChange={handleCourseNameChange}
            className="mb-2"
            placeholder="Course Name"
          />

          <FormControl
            as="textarea"
            rows={3}
            value={course?.description || ""}
            onChange={handleCourseDescriptionChange}
            placeholder="Course Description"
          />
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">
        {enrolling ? "All Courses" : "My Courses"} ({coursesCount})
      </h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {courses.map((c: any) => {
            if (!c) return null;
            
            const isEnrolled = Boolean(
              (Array.isArray(enrollments) && currentUser && c && 
                enrollments.some(
                  (enrollment: any) =>
                    enrollment &&
                    enrollment.user &&
                    enrollment.course &&
                    currentUser._id &&
                    enrollment.user === currentUser._id &&
                    enrollment.course === c._id
                )) || 
              (c && c.enrolled === true)
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
                    <div style={{ display: "flex", gap: "5px" }}>
                      <Button variant="primary" onClick={() => handleGoToCourse(c._id, isEnrolled)}>Go</Button>
                      
                      {/* Enrollment button moved here */}
                      {enrolling && (
                        <Button 
                          onClick={() => {
                            console.log(`Button clicked: ${isEnrolled ? 'unenroll' : 'enroll'} for course ${c._id}`);
                            isEnrolled ? handleUnenroll(c._id) : handleEnroll(c._id);
                          }}
                          variant={isEnrolled ? "danger" : "success"}
                        >
                          {isEnrolled ? "Unenroll" : "Enroll"}
                        </Button>
                      )}

                      {isFaculty && (
                        <>
                          <Button id="wd-edit-course-click" className="btn btn-warning" onClick={() => handleSetCourse(c)}>Edit</Button>
                          <Button variant="danger" onClick={() => handleDeleteClick(c._id)} id="wd-delete-course-click">Delete</Button>
                        </>
                      )}
                    </div>
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