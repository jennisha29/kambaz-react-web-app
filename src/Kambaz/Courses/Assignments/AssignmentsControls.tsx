import { BsSearch } from "react-icons/bs";
import { Button } from "react-bootstrap";

export default function AssignmentsControls() {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="position-relative" style={{ width: "240px" }}>
        <BsSearch className="position-absolute start-3 top-50 translate-middle-y" />
        <input
          type="text"
          className="form-control ps-5"
          placeholder="Search for Assignment"
        />
      </div>

      
      <div>
        <Button variant="secondary" className="me-2">+ Group</Button>
        <Button variant="danger">+ Assignment</Button>
      </div>
    </div>
  );
}