import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Row, Col, Button, FormControl, Modal, Alert } from "react-bootstrap";
import * as enrollmentClient from "../Courses/Enrollment/client";
import { getEnrollments, addEnrollment, deleteEnrollment } from "../Courses/Enrollment/reducer";

interface DashboardProps {
  courses: any[];
  course?: any;
  setCourse?: (course: any) => void;
  addNewCourse?: () => void;
  deleteCourse?: (id: string) => void;
  updateCourse?: () => void;
}

export default function Dashboard({ 
  courses, 
  course, 
  setCourse, 
  addNewCourse, 
  deleteCourse, 
  updateCourse 
}: DashboardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentReducer);
  
  // State
  const [isEnrollmentView, setIsEnrollmentView] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<string>("success");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Check if user is faculty
  const isFaculty = currentUser?.role === "FACULTY";
  
  // Fetch fresh enrollment data when component mounts
  useEffect(() => {
    const refreshEnrollments = async () => {
      if (currentUser) {
        try {
          setIsLoading(true);
          // Get enrollments from server and pass to reducer
          const userEnrollments = await enrollmentClient.findEnrollmentsForUser(currentUser._id);
          dispatch(getEnrollments(userEnrollments));
        } catch (error) {
          console.error("Error fetching enrollments:", error);
          setAlertVariant("danger");
          setAlertMessage("Error loading enrollments. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    refreshEnrollments();
  }, [currentUser, dispatch]);
  
  // Toggle between enrolled courses and all courses
  const toggleEnrollmentView = () => {
    setIsEnrollmentView(!isEnrollmentView);
  };
  
  // Check if user is enrolled in a course
  const isEnrolled = (courseId: string) => {
    return enrollments.some(
      (enrollment: any) => 
        enrollment.user === currentUser?._id && 
        enrollment.course === courseId
    );
  };
  
  // Handle course access
  const handleCourseAccess = (courseId: string) => {
    if (isFaculty || isEnrolled(courseId)) {
      navigate(`/Kambaz/Courses/${courseId}/Home`);
    } else {
      setShowEnrollmentModal(true);
    }
  };

  
  
  // Handle enrollment
  const handleEnroll = async (courseId: string) => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      
      // Call REST API to enroll user
      const enrollmentResult = await enrollmentClient.enrollUserInCourse(currentUser._id, courseId);
      
      // Check if enrollment was successful
      if (enrollmentResult && enrollmentResult._id) {
        // Update Redux store with the actual enrollment from server
        dispatch(addEnrollment({ 
          user: currentUser._id, 
          course: courseId 
        }));
        
        setAlertVariant("success");
        setAlertMessage("Successfully enrolled in the course!");
      } else if (enrollmentResult && enrollmentResult.status === "USER_ALREADY_ENROLLED") {
        setAlertVariant("warning");
        setAlertMessage("You are already enrolled in this course.");
      } else {
        setAlertVariant("danger");
        setAlertMessage("Failed to enroll in course. Please try again.");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      setAlertVariant("danger");
      setAlertMessage("Failed to enroll in course. Please try again.");
    } finally {
      setIsLoading(false);
      
      // Auto-dismiss the alert after 3 seconds
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
    }
  };
  
  // Handle unenrollment
  const handleUnenroll = async (courseId: string) => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      
      // Call REST API to unenroll user
      const result = await enrollmentClient.unenrollUserFromCourse(currentUser._id, courseId);
      
      // Check status code for successful deletion (204 No Content)
      if (result === 204 || result === 200) {
        // Update Redux store - remove enrollment
        dispatch(deleteEnrollment({ 
          user: currentUser._id, 
          course: courseId 
        }));
        
        setAlertVariant("success");
        setAlertMessage("Successfully unenrolled from the course!");
      } else {
        setAlertVariant("danger");
        setAlertMessage("Failed to unenroll from course. Please try again.");
      }
    } catch (error) {
      console.error("Error unenrolling from course:", error);
      setAlertVariant("danger");
      setAlertMessage("Failed to unenroll from course. Please try again.");
    } finally {
      setIsLoading(false);
      
      // Auto-dismiss the alert after 3 seconds
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
    }
  };
  
  // Filter courses based on enrollment status and view
  const filteredCourses = isEnrollmentView 
    ? courses // Show all courses in enrollment view
    : isFaculty 
      ? courses // Faculty sees all courses in regular view
      : courses.filter(c => isEnrolled(c._id)); // Students see only enrolled courses in regular view
  
  // Count enrolled courses for the user
  const enrolledCoursesCount = isFaculty 
    ? courses.length 
    : courses.filter(c => isEnrolled(c._id)).length;
  
  return (
    <div id="wd-dashboard" style={{ position: "relative" }}>
      <Button
        variant="primary"
        className="position-absolute top-0 end-0 m-2"
        onClick={toggleEnrollmentView}
      >
        Enrollment
      </Button>
      
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      
      {alertMessage && (
        <Alert variant={alertVariant} onClose={() => setAlertMessage(null)} dismissible>
          {alertMessage}
        </Alert>
      )}
      
      {isFaculty && (
        <>
          <h5>
            New Course
            <Button 
              variant="primary"
              className="float-end"
              onClick={addNewCourse}
            >
              Add
            </Button>
            <Button 
              variant="warning"
              className="float-end me-2"
              onClick={updateCourse}
            >
              Update
            </Button>
          </h5>
          <br />
          
          <FormControl 
            className="mb-2"
            placeholder="Course Name" 
            value={course?.name || ""}
            onChange={(e) => setCourse && setCourse({...course, name: e.target.value})}
          />
          
          <FormControl 
            as="textarea"
            rows={3}
            className="mb-3"
            placeholder="Course Description"
            value={course?.description || ""}
            onChange={(e) => setCourse && setCourse({...course, description: e.target.value})}
          />
          <hr />
        </>
      )}
      
      <h2 id="wd-dashboard-published">
        Published Courses ({isEnrollmentView ? courses.length : enrolledCoursesCount})
      </h2> <hr />
      
      {isLoading && <div className="text-center my-3">Loading courses...</div>}
      
      <div id="wd-dashboard-courses">
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredCourses.map((c) => (
            <Col key={c._id} className="wd-dashboard-course" style={{ width: "320px" }}>
              <Card>
                <div 
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCourseAccess(c._id)}
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
                </div>
                
                <div className="p-2">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    <Button 
                      variant="primary" 
                      onClick={() => handleCourseAccess(c._id)}
                      disabled={isLoading}
                    >
                      Go
                    </Button>
                    
                    {/* Show Enroll/Unenroll only in enrollment view */}
                    {isEnrollmentView && (
                      isEnrolled(c._id) ? (
                        <Button 
                          variant="danger" 
                          onClick={() => handleUnenroll(c._id)}
                          disabled={isLoading}
                        >
                          Unenroll
                        </Button>
                      ) : (
                        <Button 
                          variant="success" 
                          onClick={() => handleEnroll(c._id)}
                          disabled={isLoading}
                        >
                          Enroll
                        </Button>
                      )
                    )}
                    
                    {/* Edit and Delete buttons always show for faculty */}
                    {isFaculty && (
                      <>
                        <Button 
                          variant="warning" 
                          onClick={() => setCourse && setCourse(c)}
                          disabled={isLoading}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="danger" 
                          onClick={() => deleteCourse && deleteCourse(c._id)}
                          disabled={isLoading}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      
      {/* Enrollment required modal */}
      <Modal 
        show={showEnrollmentModal} 
        onHide={() => setShowEnrollmentModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Enrollment Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>You must be enrolled in this course to access it.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowEnrollmentModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}