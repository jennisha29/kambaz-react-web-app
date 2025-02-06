import { Form, Button, Row, Col } from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div>
      <div>Assignment Name</div>
      <Form.Control type="text" value="A1" className="mb-3" />
      <Form.Control
        as="textarea"
        rows={6}
        className="mb-3"
        value={`The assignment is available online

Submit a link to the landing page of your Web application running on Netlify.

The landing page should include the following:
- Your full name and section
- Links to each of the lab assignments
- Link to the Kanbas application
- Links to all relevant source code repositories

The Kanbas application should include a link to navigate back to the landing page.`}
      />

      <Row className="mb-3">
        <Col xs={2} className="text-end">
          Points
        </Col>
        <Col>
          <Form.Control type="text" value="100" />
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
              defaultValue="2024-05-13"
              className="mb-3"
            />

            <div className="d-flex gap-3">
              <div>
                <div>Available from</div>
                <Form.Control 
                  type="date"
                  defaultValue="2024-05-06"
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
        <Button variant="secondary" className="me-2">Cancel</Button>
        <Button variant="danger">Save</Button>
      </div>
    </div>
  );
}
