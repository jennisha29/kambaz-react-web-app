import { useState } from "react";
import { FormControl, Form } from "react-bootstrap";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });
 
  const [module, setModule] = useState({
    id: "CS5610",
    name: "Web Development",
    description: "Building web applications with MERN stack",
    course: "CS Masters"
  });
 
  const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${REMOTE_SERVER}/lab5/module`;
 
  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
     
      <h4>Retrieving Objects</h4>
      <div className="d-flex gap-2 mb-3">
        <a id="wd-retrieve-assignments"
           className="btn btn-primary"
           href={`${ASSIGNMENT_API_URL}`}>
          Get Assignment
        </a>
        <a id="wd-retrieve-module"
           className="btn btn-primary"
           href={`${MODULE_API_URL}`}>
          Get Module
        </a>
      </div>
      <hr/>
     
      <h4>Retrieving Properties</h4>
      <div className="d-flex gap-2 mb-3">
        <a id="wd-retrieve-assignment-title"
           className="btn btn-primary"
           href={`${ASSIGNMENT_API_URL}/title`}>
          Get Title
        </a>
        <a id="wd-retrieve-module-name"
           className="btn btn-primary"
           href={`${MODULE_API_URL}/name`}>
          Get Module Name
        </a>
      </div>
      <hr/>
     
      <h4>Modifying Properties</h4>
      <div className="d-flex align-items-center mb-3">
        <FormControl
          className="me-2 flex-grow-1"
          id="wd-assignment-title"
          defaultValue={assignment.title}
          onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
        />
        <a id="wd-update-assignment-title"
           className="btn btn-primary"
           style={{ whiteSpace: 'nowrap', minWidth: '140px' }}
           href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
          Update Title
        </a>
      </div>
     
      <div className="d-flex align-items-center mb-3">
        <FormControl
          className="me-2 flex-grow-1"
          id="wd-assignment-score"
          type="number"
          defaultValue={assignment.score}
          onChange={(e) => setAssignment({ ...assignment, score: parseInt(e.target.value) || 0 })}
        />
        <a id="wd-update-assignment-score"
           className="btn btn-primary"
           style={{ whiteSpace: 'nowrap', minWidth: '140px' }}
           href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
          Update Score
        </a>
      </div>
     
      <div className="mb-3">
        <div className="d-flex align-items-center">
          <Form.Check
            id="wd-assignment-completed"
            type="checkbox"
            className="me-2"
            checked={assignment.completed}
            onChange={(e) => setAssignment({ ...assignment, completed: e.target.checked })}
          />
          <span className="me-3">Completed</span>
          <a id="wd-update-assignment-completed"
             className="btn btn-primary"
             style={{ whiteSpace: 'nowrap', minWidth: '180px' }}
             href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
            Update Completed
          </a>
        </div>
      </div>
     
      <hr/>
     
      <h4>Module Properties</h4>
      <div className="d-flex align-items-center mb-3">
        <FormControl
          className="me-2 flex-grow-1"
          id="wd-module-name"
          defaultValue={module.name}
          onChange={(e) => setModule({ ...module, name: e.target.value })}
        />
        <a id="wd-update-module-name"
           className="btn btn-primary"
           style={{ whiteSpace: 'nowrap', minWidth: '200px' }}
           href={`${MODULE_API_URL}/name/${module.name}`}>
          Update Module Name
        </a>
      </div>
     
      <div className="d-flex align-items-center mb-3">
        <FormControl
          className="me-2 flex-grow-1"
          id="wd-module-description"
          defaultValue={module.description}
          onChange={(e) => setModule({ ...module, description: e.target.value })}
        />
        <a id="wd-update-module-description"
           className="btn btn-primary"
           style={{ whiteSpace: 'nowrap', minWidth: '180px' }}
           href={`${MODULE_API_URL}/description/${module.description}`}>
          Update Description
        </a>
      </div>
    </div>
  );
}