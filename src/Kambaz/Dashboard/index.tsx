import { Link } from "react-router-dom";
import { Card, Row, Col, Button, FormControl } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as db from "../Database";

export default function Dashboard(
  { courses, course, setCourse, addNewCourse,
    deleteCourse, updateCourse }: {
    courses: any[]; course: any; setCourse: (course: any) => void;
    addNewCourse: () => void; deleteCourse: (courseId: string) => void;
    updateCourse: () => void; })
{
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = db;
  // checking if the current user has the FACULTY role
  const isFaculty = currentUser?.role === "FACULTY";
  const enrolledCoursesCount = courses.filter((course) =>
    enrollments.some(
      (enrollment) =>
        enrollment.user === currentUser?._id &&
        enrollment.course === course._id
    )
  ).length;
  
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      
      {isFaculty && (
        <>
          <h5>
              New Course
              <Button 
                  variant="primary"
                  className="float-end"
                  onClick={addNewCourse}
                  id="wd-add-new-course-click"
              >
                  Add
              </Button>
              <Button 
                  variant="warning"
                  className="float-end me-2"
                  onClick={updateCourse}
                  id="wd-update-course-click"
              >
                  Update
              </Button>
          </h5><br />
          
          <FormControl 
              value={course.name} 
              onChange={(e) => setCourse({...course, name: e.target.value})}
              className="mb-2" 
              placeholder="Course Name"
          />
          
          <FormControl 
              as="textarea"
              rows={3}
              value={course.description} 
              onChange={(e) => setCourse({...course, description: e.target.value})}
              placeholder="Course Description"
          />
          <hr />
        </>
      )}
      
      <h2 id="wd-dashboard-published">
        Published Courses ({enrolledCoursesCount})
      </h2> <hr />
      <div id="wd-dashboard-courses">
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {courses
                .filter((course) =>
                  enrollments.some(
                    (enrollment) =>
                      enrollment.user === currentUser?._id &&
                      enrollment.course === course._id
                  )
                )
                .map((c) => (
                  <Col key={c._id} className="wd-dashboard-course" style={{ width: "320px" }}>
                      <Card>
                          <Link to={`/Kambaz/Courses/${c._id}/Home`}
                              className="wd-dashboard-course-link text-decoration-none text-dark">
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
                                  <div className="d-flex justify-content-between">
                                      <Button variant="primary">Go</Button>
                                    
                                      {isFaculty && (
                                        <div>
                                            <Button 
                                                id="wd-edit-course-click"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    setCourse(c);
                                                }}
                                                className="btn btn-warning me-2"
                                            >
                                                Edit
                                            </Button>
                                            <Button 
                                                variant="danger"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    deleteCourse(c._id);
                                                }}
                                                id="wd-delete-course-click"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                      )}
                                  </div>
                              </Card.Body>
                          </Link>
                      </Card>
                  </Col>
              ))}
          </Row>
      </div>
    </div>
  );
}