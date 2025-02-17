import { ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import GreenCheckmark from "../Modules/GreenCheckmark";
import AssignmentsControls from "./AssignmentsControls";
import { assignments } from "../../Database";

export default function Assignments() {
    const { cid } = useParams();
    const courseAssignments = assignments.filter(
        (assignment) => assignment.course === cid
    );

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        const time = date.toLocaleString('default', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        }).toLowerCase();
        return `${month} ${day} at ${time}`;
    };
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
                        {courseAssignments.map((assignment, index) => (
                            <div key={assignment._id} 
                                className={`px-2 py-3 position-relative ${
                                    index !== courseAssignments.length - 1 ? 'border-bottom' : ''
                                }`}>
                                <div>
                                    <div className="d-flex align-items-center mb-2">
                                        <BsGripVertical className="me-2" />
                                        <FaFileAlt className="me-2 text-secondary" />
                                        <a 
                                            href={`#/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                                            className="text-primary text-decoration-none fs-5"
                                        >
                                            {assignment.title}
                                        </a>
                                    </div>
                                    <div className="ps-4">
                                        <span className="text-danger">{assignment.module}</span>
                                        <span className="text-secondary"> |
                                          <span className="fw-bold text-dark"> Not available until </span>
                                          {formatDate(assignment.availableFromDate)} |
                                        </span>
                                        <div className="text-secondary">
                                          <span className="fw-bold text-dark">Due </span>
                                          {formatDate(assignment.dueDate)} | {assignment.points} pts
                                        </div>
                                    </div>
                                    <div className="position-absolute end-0 top-50 translate-middle-y me-5">
                                        <GreenCheckmark />
                                    </div>
                                    <IoEllipsisVertical className="position-absolute end-0 top-50 translate-middle-y me-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}