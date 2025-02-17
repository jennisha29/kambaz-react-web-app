import { Form, Button, Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { assignments } from "../../Database";

export default function AssignmentEditor() {
  const { aid, cid } = useParams();
  const assignment = assignments.find((a) => a._id === aid);

  if (!assignment) {
    return <div>Assignment not found</div>;
  }

  const formatDateForInput = (dateString: string): string => {
    return dateString.split('T')[0];
  };

  return (
    <div>
      <div>Assignment Name</div>
      <Form.Control 
        type="text" 
        value={assignment.title} 
        className="mb-3" 
      />
      
      <Form.Control
        as="textarea"
        rows={6}
        className="mb-3"
        value={assignment.description}
      />

      <Row className="mb-3">
        <Col xs={2} className="text-end">
          Points
        </Col>
        <Col>
          <Form.Control type="text" value={assignment.points} />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col xs={2} className="text-end">
          Assignment Group
        </Col>
        <Col>
          <Form.Select>
            <option>ASSIGNMENTS</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col xs={2} className="text-end">
          Display Grade as
        </Col>
        <Col>
          <Form.Select>
            <option>Percentage</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col xs={2} className="text-end">
          Submission Type
        </Col>
        <Col>
          <div className="border p-3">
            <Form.Select className="mb-3">
              <option>Online</option>
            </Form.Select>

            <div>Online Entry Options</div>
            <div className="mt-2">
              <Form.Check type="checkbox" label="Text Entry" />
              <Form.Check type="checkbox" label="Website URL" defaultChecked />
              <Form.Check type="checkbox" label="Media Recordings" />
              <Form.Check type="checkbox" label="Student Annotation" />
              <Form.Check type="checkbox" label="File Uploads" />
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col xs={2} className="text-end">
          Assign
        </Col>
        <Col>
          <div className="border p-3">
            <div>Assign to</div>
            <div className="d-flex align-items-center mb-3">
              <Form.Control value="Everyone" />
              <Button variant="light" className="ms-2">×</Button>
            </div>

            <div>Due</div>
            <Form.Control 
              type="date"
              value={formatDateForInput(assignment.dueDate)}
              className="mb-3"
            />

            <div className="d-flex gap-3">
              <div>
                <div>Available from</div>
                <Form.Control 
                  type="date"
                  value={formatDateForInput(assignment.availableFromDate)}
                />
              </div>
              <div>
                <div>Until</div>
                <Form.Control type="date" />
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <div className="text-end">
        <Link 
          to={`/Kambaz/Courses/${cid}/Assignments`} 
          className="btn btn-secondary me-2"
        >
          Cancel
        </Link>
        <Link 
          to={`/Kambaz/Courses/${cid}/Assignments`}
          className="btn btn-danger"
        >
          Save
        </Link>
      </div>
    </div>
  );
}