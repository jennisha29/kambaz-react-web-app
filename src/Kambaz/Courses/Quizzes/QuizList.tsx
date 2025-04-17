import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setQuizzes, deleteQuiz, setQuizPublished } from "./reducer";
import { Dropdown } from "react-bootstrap";
import * as client from "./client";

// Import icons
import { FaRocket, FaCheck, FaBan, FaEllipsisV } from "react-icons/fa";

export default function QuizList() {
    const { cid } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [refreshKey, setRefreshKey] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    
    const { currentUser } = useSelector((state: any) => state.accountReducer || {});
    const isFaculty = currentUser && currentUser.role === "FACULTY";
    
    // Get course information
    // const { courses } = useSelector((state: any) => state.coursesReducer || { courses: [] });
    // const course = useMemo(() => courses.find((c: any) => c._id === cid), [courses, cid]);
    // const courseName = course?.name || "Course";

    const fetchQuizzes = async () => {
        try {
            if (cid) {
                console.log("Fetching quizzes for course:", cid);
                const fetchedQuizzes = await client.findQuizzesForCourse(cid);
                console.log("Quizzes fetched from server:", fetchedQuizzes);
                dispatch(setQuizzes(fetchedQuizzes));
                setRefreshKey(prevKey => prevKey + 1);
            }
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
    };

    useEffect(() => {
        console.log("Quizzes component mounted or updated with course ID:", cid);
        fetchQuizzes();
    }, [cid, dispatch]);
    
    useEffect(() => {
        console.log("Location changed to:", location.pathname);
        
        if (location.pathname.includes('/Quizzes') && !location.pathname.includes('/Quizzes/')) {
            console.log("Back on quizzes page, fetching from server");
            fetchQuizzes();
        }
    }, [location.pathname]);
    
    const allQuizzes = useSelector((state: any) => {
        const reduxQuizzes = state?.quizzesReducer?.quizzes || [];
        console.log("All quizzes from Redux:", reduxQuizzes);
        return reduxQuizzes;
    });
    
    const courseQuizzes = useMemo(() => {
        if (!Array.isArray(allQuizzes) || !cid) {
            console.log("No quizzes array or course ID");
            return [];
        }
    
        console.log(`Filtering for course ID: "${cid}" (${typeof cid})`);
        
        const filtered = allQuizzes.filter((q: any) => String(q.course) === String(cid));
        
        // Apply search filtering if search query exists
        const searchFiltered = searchQuery 
            ? filtered.filter((q: any) => 
                q.title?.toLowerCase().includes(searchQuery.toLowerCase()))
            : filtered;
            
        console.log(`Found ${searchFiltered.length} quizzes for course ${cid}`);
        return searchFiltered;
    }, [allQuizzes, cid, refreshKey, searchQuery]);

    const formatDate = (dateString: string): string => {
        try {
            if (!dateString) return "No date set";
            
            // Create a new date using the provided string
            const date = new Date(dateString);
            
            // Check if the date is valid
            if (isNaN(date.getTime())) {
                return "Invalid date";
            }
        
            const month = date.toLocaleString('default', { month: 'short' });
            const day = date.getDate();
            
            // Format the time part
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

    const handleQuizClick = (quizId: string) => {
        console.log("Navigating to quiz details:", quizId);
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}`);
    };
    
    const handleDeleteClick = (quizId: string) => {
        console.log("Delete clicked for quiz:", quizId);
        setQuizToDelete(quizId);
        setShowDeleteModal(true);
    };
    
    const confirmDelete = async () => {
        if (quizToDelete) {
            try {
                console.log("Confirming delete for quiz:", quizToDelete);
                await client.deleteQuiz(quizToDelete);
                dispatch(deleteQuiz(quizToDelete));
                setShowDeleteModal(false);
                setQuizToDelete(null);
                fetchQuizzes();
            } catch (error) {
                console.error("Error deleting quiz:", error);
            }
        }
    };
    
    const cancelDelete = () => {
        setShowDeleteModal(false);
        setQuizToDelete(null);
    };

    const handleEditClick = (quizId: string) => {
        console.log("Edit clicked for quiz:", quizId);
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/edit`);
    };

    const handlePublishToggle = async (quizId: string, isPublished: boolean) => {
        try {
            console.log(`${isPublished ? 'Unpublishing' : 'Publishing'} quiz:`, quizId);
            await client.publishQuiz(quizId, !isPublished);
            dispatch(setQuizPublished({ quizId, published: !isPublished }));
            fetchQuizzes(); // Refresh to ensure UI is up-to-date
        } catch (error) {
            console.error(`Error ${isPublished ? 'unpublishing' : 'publishing'} quiz:`, error);
        }
    };

    const handleAddQuiz = () => {
        console.log("Add Quiz clicked, navigating to:", `/Kambaz/Courses/${cid}/Quizzes/new`);
        navigate(`/Kambaz/Courses/${cid}/Quizzes/new`);
    };

    const getAvailabilityStatus = (quiz: any) => {
        if (!quiz) return "Not available";
        
        const now = new Date();
        
        // Handle availableFromDate
        let availableFrom = null;
        if (quiz.availableFromDate) {
            availableFrom = new Date(quiz.availableFromDate);
            // Ensure the date is valid
            if (isNaN(availableFrom.getTime())) {
                availableFrom = null;
            }
        }
        
        // Handle availableUntilDate
        let availableUntil = null;
        if (quiz.availableUntilDate) {
            availableUntil = new Date(quiz.availableUntilDate);
            // Ensure the date is valid
            if (isNaN(availableUntil.getTime())) {
                availableUntil = null;
            }
        }
        
        // Check availability status
        if (!availableFrom) {
            return "Not available";
        }
        
        if (now < availableFrom) {
            return `Not available until ${formatDate(quiz.availableFromDate)}`;
        }
        
        if (availableUntil && now > availableUntil) {
            return "Closed";
        }
        
        return "Available";
    };
    
    // Styles for publish status icons
    const publishedIconStyle = {
        backgroundColor: "#28a745",
        color: "white", 
        borderRadius: "50%", 
        width: "30px", 
        height: "30px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center"
    };
    
    const unpublishedIconStyle = {
        backgroundColor: "white",
        color: "#dc3545", 
        border: "2px solid #dc3545",
        borderRadius: "50%", 
        width: "30px", 
        height: "30px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center"
    };
    
    return (
        <div>    
            <div className="row">
                {/* Main Content */}
                <div className="col-md-11 ps-0">
                    {/* Search and Add Quiz controls */}
                    <div className="d-flex justify-content-between align-items-center my-3">
                        <div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search for Quiz"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ 
                                    width: "320px",
                                    marginLeft: "15px",
                                    fontSize: "14px"
                                }}
                            />
                        </div>
                        <div className="d-flex">
                            <button 
                                className="btn btn-danger me-2"
                                onClick={handleAddQuiz}
                                style={{ fontSize: "14px" }}
                            >
                                + Quiz
                            </button>
                            <Dropdown>
                                <Dropdown.Toggle 
                                    variant="outline-secondary" 
                                    id="dropdown-basic"
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ 
                                        width: '38px', 
                                        height: '38px', 
                                        padding: '0', 
                                        borderRadius: '4px' 
                                    }}
                                >
                                    <FaEllipsisV />
                                </Dropdown.Toggle>

                                <Dropdown.Menu align="end">
                                    <Dropdown.Item href="#">Edit</Dropdown.Item>
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                    <Dropdown.Item href="#">Publish</Dropdown.Item>
                                    <Dropdown.Item href="#">Copy</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item href="#">Sort by Name</Dropdown.Item>
                                    <Dropdown.Item href="#">Sort by Due Date</Dropdown.Item>
                                    <Dropdown.Item href="#">Sort by Available Date</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    
                    {/* Quizzes Container */}
                    <div className="border rounded"
                    style={{ borderColor: "#ced4da", borderWidth: "1px", marginLeft: "15px" }}>
                        {/* Quizzes Header */}
                        <div className="p-2 d-flex justify-content-between align-items-center bg-light border-bottom">
                            <div className="d-flex align-items-center">
                                <span className="me-1">▾</span>
                                <span className="fw-bold" style={{ fontSize: "15px" }}>Assignment Quizzes</span>
                            </div>
                        </div>
                        
                        {/* Empty State or Quiz List */}
                        {courseQuizzes.length === 0 ? (
                            <div className="p-4 text-center text-muted">
                                <div>No quizzes found for this course.</div>
                                <div className="mt-2">Click "+ Quiz" to add a new quiz.</div>
                            </div>
                        ) : (
                            <div>
                                {courseQuizzes.map((quiz: any) => {
                                    const status = getAvailabilityStatus(quiz);
                                    const isClosed = status === "Closed";
                                    // const isNotAvailable = status.includes("Not available until");
                                    
                                    return (
                                        <div 
                                            key={`${quiz._id || quiz.id}-${refreshKey}`} 
                                            className="border-bottom"
                                            style={{ padding: "12px 15px" }}
                                        >
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="d-flex">
                                                    <div className="me-3 mt-1">
                                                        {/* Replace SVG with Rocket icon */}
                                                        <FaRocket 
                                                            className="text-success" 
                                                            size={18} 
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="mb-1">
                                                            <a 
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleQuizClick(quiz._id || quiz.id);
                                                                }}
                                                                className="text-dark fw-medium text-decoration-none"
                                                                style={{ fontSize: "15px" }}
                                                            >
                                                                {quiz.title || "Untitled Quiz"}
                                                            </a>
                                                        </div>
                                                        <div className="text-secondary" style={{ fontSize: "13px" }}>
                                                            {/* Status display */}
                                                            <span style={{ fontWeight: isClosed ? "bold" : "normal" }}>
                                                                {status} | 
                                                            </span>
                                                            <span> Due {formatDate(quiz.dueDate)} | </span>
                                                            <span>{quiz.points} pts | </span>
                                                            <span>{quiz.questions?.length || 0} Questions</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    {/* Published status icon - green checkmark or red prohibition */}
                                                    <div 
                                                        style={quiz.published ? publishedIconStyle : unpublishedIconStyle}
                                                        onClick={() => isFaculty && !isClosed && handlePublishToggle(quiz._id, quiz.published)}
                                                        className={isFaculty && !isClosed ? "cursor-pointer" : ""}
                                                    >
                                                        {quiz.published ? (
                                                            <FaCheck size={14} />
                                                        ) : (
                                                            <FaBan size={14} />
                                                        )}
                                                    </div>
                                                    
                                                    {/* Context menu */}
                                                    <div className="ms-2">
                                                        <Dropdown>
                                                            <Dropdown.Toggle 
                                                                variant="link" 
                                                                id={`dropdown-${quiz._id}`} 
                                                                className="text-secondary p-0"
                                                            >
                                                                <FaEllipsisV />
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu align="end">
                                                                <Dropdown.Item onClick={() => handleEditClick(quiz._id)}>Edit</Dropdown.Item>
                                                                <Dropdown.Item onClick={() => handleDeleteClick(quiz._id)}>Delete</Dropdown.Item>
                                                                <Dropdown.Item 
                                                                    onClick={() => handlePublishToggle(quiz._id, quiz.published)}
                                                                    disabled={isClosed}
                                                                >
                                                                    {quiz.published ? 'Unpublish' : 'Publish'}
                                                                </Dropdown.Item>
                                                                <Dropdown.Item>Copy</Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={cancelDelete}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to remove this quiz? This action cannot be undone.
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}