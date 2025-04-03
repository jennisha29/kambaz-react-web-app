import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Button, Row, Col, Modal, Form } from "react-bootstrap";
import * as enrollmentClient from "./client";
import * as courseClient from "../client";
import { getEnrollments, addEnrollment, deleteEnrollment } from "./reducer";

export default function Enrollments() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  
  // New course state
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer || {});
  const { enrollments } = useSelector((state: any) => state.enrollmentReducer || { enrollments: [] });
  
  // Check if user is faculty
  const isFaculty = currentUser && currentUser.role === "FACULTY";
  
  // Fetch courses and enrollments data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all courses
        const allCourses = await courseClient.fetchAllCourses();
        setCourses(allCourses);
        
        // Fetch user's enrollments and update Redux store
        if (currentUser) {
          await enrollmentClient.findEnrollmentsForUser(currentUser._id);
          dispatch(getEnrollments());
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser, dispatch]);
  
  // Check if user is enrolled in a specific course
  const isEnrolled = (courseId: string) => {
    return enrollments.some((e: any) => 
      e.user === currentUser?._id && e.course === courseId
    );
  };
  
  // Handle enrolling in a course
  const handleEnroll = async (courseId: string) => {
    try {
      if (currentUser) {
        await enrollmentClient.enrollUserInCourse(currentUser._id, courseId);
        dispatch(addEnrollment({ user: currentUser._id, course: courseId }));
        await enrollmentClient.findEnrollmentsForUser(currentUser._id);
        dispatch(getEnrollments());
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };
  
  // Handle unenrolling from a course
  const handleUnenroll = async (courseId: string) => {
    try {
      if (currentUser) {
        await enrollmentClient.unenrollUserFromCourse(currentUser._id, courseId);
        dispatch(deleteEnrollment({ user: currentUser._id, course: courseId }));
        await enrollmentClient.findEnrollmentsForUser(currentUser._id);
        dispatch(getEnrollments());
      }
    } catch (error) {
      console.error("Error unenrolling from course:", error);
    }
  };
  
  // Navigate to course content
  const handleCourseAccess = (courseId: string) => {
    if (isFaculty || isEnrolled(courseId)) {
      navigate(`/Kambaz/Courses/${courseId}/Home`);
    } else {
      setShowAccessModal(true);
    }
  };
  
  // Return to Dashboard
  const handleEnrollmentButtonClick = () => {
    navigate('/Kambaz/Dashboard');
  };
  
  // Handle course edit
  const handleEditCourse = (course: any) => {
    setNewCourse(course);
  };
  
  // Handle course delete confirmation
  const handleDeleteConfirm = async () => {
    if (courseToDelete && isFaculty) {
      try {
        await courseClient.deleteCourse(courseToDelete);
        // Refresh courses after deletion
        const allCourses = await courseClient.fetchAllCourses();
        setCourses(allCourses);
        setShowDeleteModal(false);
        setCourseToDelete(null);
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };
  
  // Show delete confirmation modal
  const handleDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };
  
  // Add new course (placeholder)
  const handleAddCourse = () => {
    alert("Add course functionality would be implemented here");
  };
  
  // Update course (placeholder)
  const handleUpdateCourse = () => {
    alert("Update course functionality would be implemented here");
  };
  
  if (loading) {
    return <div>Loading courses...</div>;
  }
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Dashboard</h1>
        <Button variant="primary" onClick={handleEnrollmentButtonClick}>
          Enrollment
        </Button>
      </div>
      <hr />
      
      {isFaculty && (
        <>
          <div className="d-flex justify-content-between align-items-center">
            <h5>New Course</h5>
            <div>
              <Button variant="warning" className="me-2" onClick={handleUpdateCourse}>
                Update
              </Button>
              <Button variant="primary" onClick={handleAddCourse}>
                Add
              </Button>
            </div>
          </div>
          
          <Form.Control
            type="text"
            placeholder="New Course"
            className="mb-2 mt-3"
            value={newCourse.name}
            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
          />
          
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="New Description"
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          />
          <hr />
        </>
      )}
      
      <h2>Published Courses ({courses.length})</h2>
      <hr />
      
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {courses.map((course) => (
          <Col key={course._id}>
            <Card>
              <Card.Img 
                variant="top" 
                src={course.image || "/images/reactjs.jpg"} 
                style={{ height: "200px", objectFit: "cover" }}
                alt={`${course.name} image`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/images/reactjs.jpg";
                }}
              />
              <div className="p-2">
                <h5 className="fw-bold">{course.name}</h5>
                <p className="small text-muted">{course.description}</p>
              </div>
              
              <div className="p-2 d-flex gap-1">
                <Button variant="primary" size="sm" onClick={() => handleCourseAccess(course._id)}>
                  Go
                </Button>
                {isEnrolled(course._id) ? (
                  <Button variant="danger" size="sm" onClick={() => handleUnenroll(course._id)}>
                    Unenroll
                  </Button>
                ) : (
                  <Button variant="success" size="sm" onClick={() => handleEnroll(course._id)}>
                    Enroll
                  </Button>
                )}
                <Button variant="warning" size="sm" onClick={() => handleEditCourse(course)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteClick(course._id)}>
                  Delete
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this course? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Access Denied Modal */}
      <Modal
        show={showAccessModal}
        onHide={() => setShowAccessModal(false)}
        centered
        backdropClassName="modal-backdrop"
      >
        <Modal.Body className="bg-dark text-white text-center p-4">
          <p>You must be enrolled in this course to access it.</p>
          <Button variant="light" className="rounded-pill px-4" onClick={() => setShowAccessModal(false)}>
            OK
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
