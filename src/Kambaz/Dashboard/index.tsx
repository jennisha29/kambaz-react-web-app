import { Link } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (8)</h2> <hr />
      <div id="wd-dashboard-courses">
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
             <Card>
              <Link to="/Kambaz/Courses/1234/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                  <Card.Img variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
                  <Card.Body>
                    <Card.Title className="wd-dashboard-course-title">CS1234 React JS</Card.Title>
                    <Card.Text  className="wd-dashboard-course-description">Full Stack software developer</Card.Text>
                    <Button variant="primary">Go</Button>
                  </Card.Body>
              </Link>
             </Card>
            </Col>

            <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
             <Card>
              <Link to="/Kambaz/Courses/5520/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                  <Card.Img variant="top" src="/images/mobileappdev.jpg" width="100%" height={160}/>
                  <Card.Body>
                    <Card.Title className="wd-dashboard-course-title">CS5520 App Development</Card.Title>
                    <Card.Text className="wd-dashboard-course-description">iOS, Android App Development</Card.Text>
                    <Button variant="primary">Go</Button>
                  </Card.Body>
              </Link>
             </Card>
            </Col>
            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
             <Card>
              <Link to="/Kambaz/Courses/6140/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/machinelearning.jpg" width="100%" height={160}/>
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title">CS6140 Machine Learning</Card.Title>
                  <Card.Text className="wd-dashboard-course-description">Algorithms and Statistical Models</Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
             </Card>
            </Col>

            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
             <Card>
              <Link to="/Kambaz/Courses/6620/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/cloud.jpg" width="100%" height={160}/>
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title">CS6620 Cloud Computing</Card.Title>
                  <Card.Text className="wd-dashboard-course-description">AWS, Azure, and Cloud Services</Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
             </Card>
            </Col>

            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
             <Card>
              <Link to="/Kambaz/Courses/5100/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/ai.jpg" width="100%" height={160}/>
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title">CS5100 Artificial Intelligence</Card.Title>
                  <Card.Text className="wd-dashboard-course-description">AI Principles and Applications</Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
             </Card>
            </Col>

            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
             <Card>
              <Link to="/Kambaz/Courses/5200/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/database.jpg" width="100%" height={160}/>
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title">CS5200 Database Management Systems</Card.Title>
                  <Card.Text className="wd-dashboard-course-description">Database Design and SQL</Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
             </Card>
            </Col>

            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
             <Card>
              <Link to="/Kambaz/Courses/6120/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/nlp.jpg" width="100%" height={160}/>
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title">CS6120 Natural Language Processing</Card.Title>
                  <Card.Text className="wd-dashboard-course-description">Text, Models Analysis</Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
             </Card>
            </Col>

            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
             <Card>
              <Link to="/Kambaz/Courses/6650/Home"
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/buildingscalable.jpg" width="100%" height={160}/>
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title">CS6650 Distributed Systems</Card.Title>
                  <Card.Text className="wd-dashboard-course-description">Computing and System Design</Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
             </Card>
            </Col>
          </Row>
        </div>
      </div>
  );
}





 

        