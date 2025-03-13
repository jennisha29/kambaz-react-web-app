import { useEffect, useState, useMemo } from "react";
import { ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import GreenCheckmark from "../Modules/GreenCheckmark";
import AssignmentsControls from "./AssignmentsControls";
import { assignments as fallbackAssignments } from "../../Database";
import { setAssignments } from "./reducer";

export default function Assignments() {
    const { cid } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [refreshKey, setRefreshKey] = useState(0);
    
    
    useEffect(() => {
        console.log("Assignments component mounted or updated with course ID:", cid);
        console.log("URL path:", location.pathname);
        
        setRefreshKey(prevKey => prevKey + 1);
    }, [cid]);
    
    useEffect(() => {
        console.log("Location changed to:", location.pathname);
        
        if (location.pathname.includes('/Assignments')) {
            console.log("Back on assignments page, loading from localStorage");
            
            setTimeout(() => {
                try {
                    const storedAssignments = localStorage.getItem('assignments');
                    if (storedAssignments) {
                        const parsedAssignments = JSON.parse(storedAssignments);
                        console.log("Found assignments in localStorage:", parsedAssignments);
                        
                        dispatch(setAssignments(parsedAssignments));
                        
                        setRefreshKey(prevKey => prevKey + 1);
                    }
                } catch (error) {
                    console.error("Error reading from localStorage:", error);
                }
            }, 300);
        }
    }, [location.pathname, dispatch]);
    
    const allAssignments = useSelector((state: any) => {
        const reduxAssignments = state?.assignmentsReducer?.assignments || [];
        console.log("All assignments from Redux:", reduxAssignments);
        return reduxAssignments.length > 0 ? reduxAssignments : fallbackAssignments;
    });
    
    
    const courseAssignments = useMemo(() => {
        if (!Array.isArray(allAssignments) || !cid) {
            console.log("No assignments array or course ID");
            return [];
        }
    
        console.log(`Filtering for course ID: "${cid}" (${typeof cid})`);
        
        allAssignments.forEach((a: any) => {
            const assignmentCourseId = String(a.course);
            const routeCourseId = String(cid);
            console.log(
                `Assignment "${a.title || a.name}" - course: "${assignmentCourseId}" (${typeof a.course}), ` +
                `match: ${assignmentCourseId === routeCourseId}`
            );
        });
        
        
        const filtered = allAssignments.filter((a: any) => String(a.course) === String(cid));
        console.log(`Found ${filtered.length} assignments for course ${cid}`);
        return filtered;
    }, [allAssignments, cid, refreshKey]);

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            const month = date.toLocaleString('default', { month: 'short' });
            const day = date.getDate();
            const time = date.toLocaleString('default', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
            }).toLowerCase();
            return `${month} ${day} at ${time}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid date";
        }
    };
    
    const handleAssignmentClick = (assignmentId: string) => {
        console.log("Navigating to assignment details:", assignmentId);
        navigate(`/Kambaz/Courses/${cid}/Assignments/${assignmentId}`);
    };
    
    return (
        <div>
            <AssignmentsControls />
            <div className="mb-4"></div>
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
                    
                    {courseAssignments.length === 0 ? (
                        <div className="p-3 text-center text-muted">
                            <div>No assignments found for this course.</div>
                            <div className="mt-2">Click "+ Assignment" to add a new assignment.</div>
                            <div className="mt-1 text-secondary">
                                <small>Debug: Found {allAssignments?.length || 0} total assignments, looking for course ID: {cid}</small>
                            </div>
                        </div>
                    ) : (
                        <div style={{ borderLeft: "4px solid #28a745" }}>
                            {courseAssignments.map((assignment: any, index: number) => (
                                <div key={`${assignment._id || assignment.id}-${refreshKey}`} 
                                    className={`px-2 py-3 position-relative ${
                                        index !== courseAssignments.length - 1 ? 'border-bottom' : ''
                                    }`}>
                                    <div>
                                        <div className="d-flex align-items-center mb-2">
                                            <BsGripVertical className="me-2" />
                                            <FaFileAlt className="me-2 text-secondary" />
                                            <a 
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleAssignmentClick(assignment._id || assignment.id);
                                                }}
                                                className="text-primary text-decoration-none fs-5"
                                            >
                                                {(() => {
                                                    
                                                    if (assignment.title && assignment.title.trim()) {
                                                        return assignment.title;
                                                    }
                                                    
                                                    if (assignment.name && assignment.name.trim()) {
                                                        return assignment.name;
                                                    }
                                                    
                                                    return "Untitled Assignment";
                                                })()}
                                            </a>
                                        </div>
                                        <div className="ps-4">
                                            {assignment.module && (
                                                <span className="text-danger">{assignment.module}</span>
                                            )}
                                            <span className="text-secondary">
                                                {assignment.module && " | "}
                                                <span className="fw-bold text-dark">Available from </span>
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
                    )}
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}