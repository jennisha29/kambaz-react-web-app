import { BsSearch } from "react-icons/bs";
import { Button } from "react-bootstrap";

export default function AssignmentsControls() {
  return (
    <div id="wd-assignments-controls" className="text-nowrap">
      <div className="position-relative d-inline-block me-2">
        <BsSearch className="position-absolute start-3 top-50 translate-middle-y" />
        <input
          type="text"
          className="form-control ps-5"
          placeholder="Search for Assignment"
          id="wd-search-assignment"
        />
      </div>
      <Button variant="secondary" className="me-2" id="wd-add-assignment-group">
        + Group
      </Button>
      <Button variant="danger" id="wd-add-assignment">
        + Assignment
      </Button>
    </div>
  );
}