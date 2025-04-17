import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setQuizzes, deleteQuiz, setQuizPublished } from "./reducer";
import { Dropdown } from "react-bootstrap";
import * as client from "./client";
import CourseNavigation from "../Navigation"; // Import the existing CourseNavigation component

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
    const { courses } = useSelector((state: any) => state.coursesReducer || { courses: [] });
    const course = useMemo(() => courses.find((c: any) => c._id === cid), [courses, cid]);
    const courseName = course?.name || "Course";

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
        navigate(`/Kambaz/Courses/${cid}/Quizzes/new`);
    };

    // Check if a quiz is available based on dates
    const getAvailabilityStatus = (quiz: any) => {
        const now = new Date();
        const availableFrom = quiz.availableFromDate ? new Date(quiz.availableFromDate) : null;
        const availableUntil = quiz.availableUntilDate ? new Date(quiz.availableUntilDate) : null;
        
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
    
    return (
        <div>
            {/* Course-specific header */}
            <div>
                <h2 className="text-danger m-0">
                    {courseName} &gt; Quizzes
                </h2>
            </div>
            
            <hr className="mt-2 mb-3" />
            
            <div className="row">
                {/* Left Navigation - Using existing CourseNavigation component */}
                <div className="col-md-2 d-none d-md-block">
                    <CourseNavigation />
                </div>
                
                {/* Main Content */}
                <div className="col-md-10 ps-0">
                    {/* Student View button */}
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-outline-secondary">
                            <i className="fas fa-user"></i> Student View
                        </button>
                    </div>
                    
                    {/* Search and Add Quiz controls */}
                    <div className="d-flex justify-content-between align-items-center my-3 ms-0">
                        <div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search for Quiz"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: "320px" }}
                            />
                        </div>
                        <div className="d-flex">
                            <button 
                                className="btn btn-danger me-2"
                                onClick={handleAddQuiz}
                            >
                                + Quiz
                            </button>
                            <button className="btn btn-light">
                                <i className="fas fa-ellipsis-v"></i>
                            </button>
                        </div>
                    </div>
                    
                    {/* Quizzes Container */}
                    <div className="border rounded">
                        {/* Quizzes Header */}
                        <div className="p-2 d-flex justify-content-between align-items-center bg-light border-bottom">
                            <div className="d-flex align-items-center">
                                <span className="me-1">▾</span>
                                <span className="fw-bold">Assignment Quizzes</span>
                            </div>
                        </div>
                        
                        {/* Empty State or Quiz List */}
                        {courseQuizzes.length === 0 ? (
                            <div className="p-4 text-center text-muted">
                                <div>No quizzes found for this course.</div>
                                <div className="mt-2">Click "+ Quiz" to add a new quiz.</div>
                                <div className="mt-1 text-secondary">
                                    <small>Debug: Found {allQuizzes?.length || 0} total quizzes, looking for course ID: {cid}</small>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {courseQuizzes.map((quiz: any) => (
                                    <div 
                                        key={`${quiz._id || quiz.id}-${refreshKey}`} 
                                        className="border-bottom"
                                        style={{ borderLeft: "4px solid #28a745", padding: "12px 15px" }}
                                    >
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <div className="d-flex align-items-center mb-1">
                                                    <svg className="text-success me-2" width="20" height="20" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"></path>
                                                    </svg>
                                                    <a 
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleQuizClick(quiz._id || quiz.id);
                                                        }}
                                                        className="text-primary text-decoration-none"
                                                        style={{ fontSize: "16px" }}
                                                    >
                                                        {quiz.title || "Untitled Quiz"}
                                                    </a>
                                                </div>
                                                <div className="ms-4 text-secondary">
                                                    {getAvailabilityStatus(quiz) === "Closed" ? (
                                                        <span>Closed | </span>
                                                    ) : getAvailabilityStatus(quiz) === "Available" ? (
                                                        <span>Available | </span>
                                                    ) : (
                                                        <span>{getAvailabilityStatus(quiz)} | </span>
                                                    )}
                                                    <span>Due {formatDate(quiz.dueDate)} | </span>
                                                    <span>{quiz.points} pts | </span>
                                                    <span>{quiz.questions?.length || 0} Questions</span>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                {/* Published status (checkmark) */}
                                                <span 
                                                    className={`me-3 fs-5 ${quiz.published ? "text-success" : "text-danger"}`}
                                                    onClick={() => isFaculty && handlePublishToggle(quiz._id, quiz.published)}
                                                    style={{ cursor: isFaculty ? 'pointer' : 'default' }}
                                                >
                                                    {quiz.published ? "✓" : "🚫"}
                                                </span>
                                                
                                                {/* Context menu */}
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="link" id={`dropdown-${quiz._id}`} className="text-secondary p-0">
                                                        <i className="fas fa-ellipsis-v"></i>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu align="end">
                                                        <Dropdown.Item onClick={() => handleEditClick(quiz._id)}>Edit</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handleDeleteClick(quiz._id)}>Delete</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handlePublishToggle(quiz._id, quiz.published)}>
                                                            {quiz.published ? 'Unpublish' : 'Publish'}
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>Copy</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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