import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "./reducer";
import * as client from "./client";

export default function Editor() {
  const { aid, cid } = useParams();
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isNewAssignment = !aid || aid === "new";

  const { currentUser } = useSelector((state: any) => state?.accountReducer || {});
  const isFaculty = currentUser?.role === "FACULTY";
  
  useEffect(() => {
    if (!isFaculty) {
      navigate(`/Kambaz/Courses/${cid}/Assignments`);
    }
  }, [isFaculty, navigate, cid]);
  
  const [assignment, setAssignment] = useState<any>({
    _id: "",
    title: "",
    description: "",
    points: 100,
    dueDate: new Date().toISOString().split('T')[0],
    availableFromDate: new Date().toISOString().split('T')[0],
    availableUntilDate: "",
    course: cid || "",
    module: "Multiple Modules"
  });
  
  const [checkboxes, setCheckboxes] = useState({
    textEntry: false,
    websiteURL: true,
    mediaRecordings: false,
    studentAnnotation: false,
    fileUploads: false
  });
  
  useEffect(() => {
    const fetchAssignment = async () => {
      if (!isNewAssignment && aid) {
        try {
          console.log("Fetching assignment with ID:", aid);
          const fetchedAssignment = await client.findAssignmentById(aid);
          console.log("Assignment data retrieved:", fetchedAssignment);
          
          if (fetchedAssignment) {
            setAssignment({
              ...fetchedAssignment,
              dueDate: formatDateForInput(fetchedAssignment.dueDate),
              availableFromDate: formatDateForInput(fetchedAssignment.availableFromDate || fetchedAssignment.dueDate),
              availableUntilDate: fetchedAssignment.availableUntilDate ? 
                formatDateForInput(fetchedAssignment.availableUntilDate) : ""
            });
          }
        } catch (error) {
          console.error("Error fetching assignment:", error);
        }
      }
    };
    
    fetchAssignment();
  }, [aid, isNewAssignment]);
  
  const formatDateForInput = (dateString: string): string => {
    try {
      if (!dateString) return new Date().toISOString().split('T')[0];
      return dateString.split('T')[0];
    } catch (e) {
      console.error("Error formatting date:", e);
      return new Date().toISOString().split('T')[0];
    }
  };
  
  const handleSave = async () => {
    if (!assignment.title.trim()) {
      alert("Assignment Name is required");
      return;
    }
    
    const formattedAssignment = {
      ...assignment,
      course: String(cid),
      dueDate: `${assignment.dueDate}T23:59:00`,
      availableFromDate: `${assignment.availableFromDate}T00:00:00`,
      availableUntilDate: assignment.availableUntilDate ? `${assignment.availableUntilDate}T23:59:00` : ""
    };
    
    try {
      if (isNewAssignment) {
    
        const newAssignment = await client.createAssignment(cid as string, formattedAssignment);
        console.log("New assignment created on server:", newAssignment);
        dispatch(addAssignment(newAssignment));
      } else {
      
        const updatedAssignment = await client.updateAssignment(formattedAssignment);
        console.log("Assignment updated on server:", updatedAssignment);
        dispatch(updateAssignment(updatedAssignment));
      }
      
      navigate(`/Kambaz/Courses/${cid}/Assignments`);
    } catch (error) {
      console.error("Error saving assignment:", error);
      alert("Error saving assignment. Please try again.");
    }
  };
  
  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };
  
  if (!isFaculty) {
    return null; 
  }
  
  if (isNewAssignment) {
    return (
      <div className="p-3">
        <h3>Create Assignment</h3>
        
        <div className="mb-4">
          <div className="mb-3">
            <label className="mb-2">Assignment Name</label>
            <Form.Control 
              type="text" 
              value={assignment.title} 
              onChange={(e) => setAssignment({...assignment, title: e.target.value})}
              placeholder="Enter assignment title"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="mb-2">Assignment Description</label>
            <Form.Control
              as="textarea"
              rows={6}
              value={assignment.description}
              onChange={(e) => setAssignment({...assignment, description: e.target.value})}
              placeholder="Enter assignment description"
            />
          </div>
          
          <Row className="mb-3">
            <Col xs={2} className="d-flex align-items-center">
              <label>Points</label>
            </Col>
            <Col>
              <Form.Control 
                type="number" 
                value={assignment.points}
                onChange={(e) => setAssignment({...assignment, points: parseInt(e.target.value) || 0})}
                min="0"
              />
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col xs={2} className="d-flex align-items-center">
              <label>Module</label>
            </Col>
            <Col>
              <Form.Control 
                type="text" 
                value={assignment.module}
                onChange={(e) => setAssignment({...assignment, module: e.target.value})}
              />
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col xs={2} className="d-flex align-items-center">
              <label>Assign</label>
            </Col>
            <Col>
              <div className="border p-3">
                <div className="mb-2">Due</div>
                <Form.Control 
                  type="date"
                  value={assignment.dueDate}
                  onChange={(e) => setAssignment({...assignment, dueDate: e.target.value})}
                  className="mb-3"
                />
                
                <Row>
                  <Col md={6}>
                    <div className="mb-2">Available from</div>
                    <Form.Control 
                      type="date"
                      value={assignment.availableFromDate}
                      onChange={(e) => setAssignment({...assignment, availableFromDate: e.target.value})}
                    />
                  </Col>
                  <Col md={6}>
                    <div className="mb-2">Until</div>
                    <Form.Control 
                      type="date"
                      value={assignment.availableUntilDate}
                      onChange={(e) => setAssignment({...assignment, availableUntilDate: e.target.value})}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-end mt-4">
            <Button 
              variant="secondary" 
              className="me-2"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              variant="danger"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-3">
      <h3>Edit Assignment</h3>
      
      <div className="mb-4">
        <label className="mb-2">Assignment Name</label>
        <Form.Control 
          type="text" 
          value={assignment.title} 
          onChange={(e) => setAssignment({...assignment, title: e.target.value})}
          className="mb-4"
          placeholder="Enter assignment title"
          required
        />
        
        <label className="mb-2">Assignment Description</label>
        <Form.Control
          as="textarea"
          rows={4}
          value={assignment.description}
          onChange={(e) => setAssignment({...assignment, description: e.target.value})}
          className="mb-4"
          placeholder="Enter assignment description"
        />
        
        <Row className="mb-4">
          <Col xs={2} className="text-end pt-2">
            <label>Points</label>
          </Col>
          <Col>
            <Form.Control 
              type="number" 
              value={assignment.points}
              onChange={(e) => setAssignment({...assignment, points: parseInt(e.target.value) || 0})}
              min="0"
            />
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col xs={2} className="text-end pt-2">
            <label>Assignment Group</label>
          </Col>
          <Col>
            <Form.Select>
              <option>ASSIGNMENTS</option>
            </Form.Select>
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col xs={2} className="text-end pt-2">
            <label>Display Grade as</label>
          </Col>
          <Col>
            <Form.Select>
              <option>Percentage</option>
            </Form.Select>
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col xs={2} className="text-end pt-2">
            <label>Submission Type</label>
          </Col>
          <Col>
            <div className="border p-3">
              <Form.Select className="mb-3">
                <option>Online</option>
              </Form.Select>

              <div>Online Entry Options</div>
              <div className="mt-2">
                <Form.Check 
                  type="checkbox" 
                  label="Text Entry" 
                  checked={checkboxes.textEntry}
                  onChange={(e) => setCheckboxes({...checkboxes, textEntry: e.target.checked})}
                />
                <Form.Check 
                  type="checkbox" 
                  label="Website URL" 
                  checked={checkboxes.websiteURL}
                  onChange={(e) => setCheckboxes({...checkboxes, websiteURL: e.target.checked})}
                />
                <Form.Check 
                  type="checkbox" 
                  label="Media Recordings" 
                  checked={checkboxes.mediaRecordings}
                  onChange={(e) => setCheckboxes({...checkboxes, mediaRecordings: e.target.checked})}
                />
                <Form.Check 
                  type="checkbox" 
                  label="Student Annotation" 
                  checked={checkboxes.studentAnnotation}
                  onChange={(e) => setCheckboxes({...checkboxes, studentAnnotation: e.target.checked})}
                />
                <Form.Check 
                  type="checkbox" 
                  label="File Uploads" 
                  checked={checkboxes.fileUploads}
                  onChange={(e) => setCheckboxes({...checkboxes, fileUploads: e.target.checked})}
                />
              </div>
            </div>
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col xs={2} className="text-end pt-2">
            <label>Assign</label>
          </Col>
          <Col>
            <div className="border p-3">
              <div>Assign to</div>
              <div className="d-flex align-items-center mb-3">
                <Form.Control value="Everyone" readOnly />
                <Button variant="light" className="ms-2">×</Button>
              </div>

              <div>Due</div>
              <Form.Control 
                type="date"
                value={assignment.dueDate}
                className="mb-3"
                onChange={(e) => setAssignment({...assignment, dueDate: e.target.value})}
              />

              <Row className="g-3">
                <Col md={6}>
                  <div>Available from</div>
                  <Form.Control 
                    type="date"
                    value={assignment.availableFromDate}
                    onChange={(e) => setAssignment({...assignment, availableFromDate: e.target.value})}
                  />
                </Col>
                <Col md={6}>
                  <div>Until</div>
                  <Form.Control 
                    type="date"
                    value={assignment.availableUntilDate}
                    onChange={(e) => setAssignment({...assignment, availableUntilDate: e.target.value})}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        
        <div className="d-flex justify-content-end">
          <Button 
            variant="secondary" 
            className="me-2"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            variant="danger"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}