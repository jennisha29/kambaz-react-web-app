import { ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import GreenCheckmark from "../Modules/GreenCheckmark";
import AssignmentsControls from "./AssignmentsControls";

export default function Assignments() {
  return (
    <div>
      <AssignmentsControls /><br /><br /><br />
  
      <ListGroup className="rounded-0" id="wd-assignments">
        <ListGroup.Item className="p-0">
          <div className="p-2 bg-light d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-4" />
              <span className="me-1">▾</span>
              <span className="ms-1 fw-bold">ASSIGNMENTS</span>
            </div>
            <div className="d-flex align-items-center">
              <span className="badge bg-light text-dark border rounded-pill px-3 py-2 fs-6">40% of Total</span>
              <button className="btn border-0 fs-3 bg-transparent fw-light mx-2 lh-1 p-0">+</button>
              <button className="btn border-0 bg-transparent p-0">
                <IoEllipsisVertical className="fs-4" />
              </button>
            </div>
          </div>
          <div style={{ borderLeft: "4px solid #28a745" }}>
            <div className="px-2 py-3 border-bottom position-relative">
              <div>
                <div className="d-flex align-items-center mb-2">
                  <BsGripVertical className="me-2" />
                  <FaFileAlt className="me-2 text-secondary" />
                  <a href="#/Kambaz/Courses/1234/Assignments/123" className="text-primary text-decoration-none fs-5">A1</a>
                </div>
                <div className="ps-4">
                  <span className="text-danger">Multiple Modules</span>
                  <span className="text-secondary"> | Not available until May 6 at 12:00am |</span>
                  <div className="text-secondary">Due May 13 at 11:59pm | 100 pts</div>
                </div>
                <div className="position-absolute end-0 top-50 translate-middle-y me-5">
                  <GreenCheckmark />
                </div>
                <IoEllipsisVertical className="position-absolute end-0 top-50 translate-middle-y me-3" />
              </div>
            </div>

            <div className="px-2 py-3 border-bottom position-relative">
              <div>
                <div className="d-flex align-items-center mb-2">
                  <BsGripVertical className="me-2" />
                  <FaFileAlt className="me-2 text-secondary" />
                  <a href="#/Kambaz/Courses/1234/Assignments/124" className="text-primary text-decoration-none fs-5">A2</a>
                </div>
                <div className="ps-4">
                  <span className="text-danger">Multiple Modules</span>
                  <span className="text-secondary"> | Not available until May 13 at 12:00am |</span>
                  <div className="text-secondary">Due May 20 at 11:59pm | 100 pts</div>
                </div>
                <div className="position-absolute end-0 top-50 translate-middle-y me-5">
                  <GreenCheckmark />
                </div>
                <IoEllipsisVertical className="position-absolute end-0 top-50 translate-middle-y me-3" />
              </div>
            </div>
            <div className="px-2 py-3 position-relative">
              <div>
                <div className="d-flex align-items-center mb-2">
                  <BsGripVertical className="me-2" />
                  <FaFileAlt className="me-2 text-secondary" />
                  <a href="#/Kambaz/Courses/1234/Assignments/125" className="text-primary text-decoration-none fs-5">A3</a>
                </div>
                <div className="ps-4">
                  <span className="text-danger">Multiple Modules</span>
                  <span className="text-secondary"> | Not available until May 20 at 12:00am |</span>
                  <div className="text-secondary">Due May 27 at 11:59pm | 100 pts</div>
                </div>
                <div className="position-absolute end-0 top-50 translate-middle-y me-5">
                  <GreenCheckmark />
                </div>
                <IoEllipsisVertical className="position-absolute end-0 top-50 translate-middle-y me-3" />
              </div>
            </div>
          </div>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}