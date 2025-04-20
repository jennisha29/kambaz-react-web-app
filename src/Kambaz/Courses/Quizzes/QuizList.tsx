import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setQuizzes, deleteQuiz, setQuizPublished } from "./reducer";
import { Dropdown } from "react-bootstrap";
import * as client from "./client";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { FaEllipsisV } from "react-icons/fa";

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
    
    const fetchQuizzes = async () => {
        try {
            if (cid) {
                const fetchedQuizzes = await client.findQuizzesForCourse(cid);
                dispatch(setQuizzes(fetchedQuizzes));
                setRefreshKey(prevKey => prevKey + 1);
            }
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, [cid, dispatch]);
    
    useEffect(() => {
        
        if (location.pathname.includes('/Quizzes') && !location.pathname.includes('/Quizzes/')) {
            fetchQuizzes();
        }
    }, [location.pathname]);
    
    const allQuizzes = useSelector((state: any) => {
        const reduxQuizzes = state?.quizzesReducer?.quizzes || [];
        return reduxQuizzes;
    });
    
    const courseQuizzes = useMemo(() => {
        if (!Array.isArray(allQuizzes) || !cid) {
            return [];
        }
        
        const filtered = allQuizzes.filter((q: any) => String(q.course) === String(cid));
        
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

            const date = new Date(dateString);
            
            if (isNaN(date.getTime())) {
                return "Invalid date";
            }
        
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
        if (!isFaculty) {
            alert("Only faculty members can edit quizzes.");
            return;
        }
        console.log("Edit clicked for quiz:", quizId);
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/edit`);
    };

    const handlePublishToggle = async (quizId: string, isPublished: boolean) => {
        try {
            console.log(`${isPublished ? 'Unpublishing' : 'Publishing'} quiz:`, quizId);
            await client.publishQuiz(quizId, !isPublished);
            dispatch(setQuizPublished({ quizId, published: !isPublished }));
            fetchQuizzes();
        } catch (error) {
            console.error(`Error ${isPublished ? 'unpublishing' : 'publishing'} quiz:`, error);
        }
    };

    const handleAddQuiz = () => {
        if (!isFaculty) {
            alert("Only faculty members can create quizzes.");
            return;
        }
        console.log("Add Quiz clicked, navigating to:", `/Kambaz/Courses/${cid}/Quizzes/new`);
        navigate(`/Kambaz/Courses/${cid}/Quizzes/new`);
    };

    const getAvailabilityStatus = (quiz: any) => {
        if (!quiz) return "Not available";
        
        const now = new Date();
        
        let availableFrom = null;
        if (quiz.availableFromDate) {
            availableFrom = new Date(quiz.availableFromDate);
            if (isNaN(availableFrom.getTime())) {
                availableFrom = null;
            }
        }
        
        let availableUntil = null;
        if (quiz.availableUntilDate) {
            availableUntil = new Date(quiz.availableUntilDate);
            if (isNaN(availableUntil.getTime())) {
                availableUntil = null;
            }
        }
        
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

    useEffect(() => {
      const style = document.createElement("style");
      style.innerHTML = `
        .dropdown-toggle::after {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    
      return () => {
        document.head.removeChild(style);
      };
    }, []);
    
    
    return (
        <div>    
            <div className="row">
              <div className="col-md-11 ps-0">
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
                            {isFaculty && (
                                <button 
                                    className="btn btn-danger me-2"
                                    onClick={handleAddQuiz}
                                    style={{ fontSize: "14px" }}
                                >
                                    + Quiz
                                </button>
                            )}
                            <Dropdown>
                                <Dropdown.Toggle 
                                     as="div"
                                    variant="outline-secondary" 
                                    id="dropdown-basic"
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ 
                                        width: '32px', 
                                        height: '38px', 
                                        borderRadius: '8px',
                                        backgroundColor: '#f8f9fa',
                                        border: '1px solid #ced4da',                                     
                                        cursor: 'pointer',
                                        padding: '0',
                                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'                  
                                         
                                    }}
                                >
                                    <FaEllipsisV style={{ color: '#6c757d' }} />
                                </Dropdown.Toggle>
                            </Dropdown>
                        </div>
                    </div>
                    
                    <div className="border rounded"
                    style={{ borderColor: "#ced4da", borderWidth: "1px", marginLeft: "15px" }}>
                        <div className="p-2 d-flex justify-content-between align-items-center bg-light border-bottom">
                            <div className="d-flex align-items-center">
                                <span className="me-1">▾</span>
                                <span className="fw-bold" style={{ fontSize: "15px" }}>Assignment Quizzes</span>
                            </div>
                        </div>
                        
                        {courseQuizzes.length === 0 ? (
                            <div className="p-4 text-center text-muted">
                                <div>No quizzes found for this course.</div>
                                {isFaculty && (
                                    <div className="mt-2">Click "+ Quiz" to add a new quiz.</div>
                                )}
                            </div>
                        ) : (
                            <div>
                                {courseQuizzes.map((quiz: any) => {
                                    const status = getAvailabilityStatus(quiz);
                                    const isClosed = status === "Closed";
                                    
                                    return (
                                        <div 
                                            key={`${quiz._id || quiz.id}-${refreshKey}`} 
                                            className="border-bottom"
                                            style={{ padding: "12px 15px" }}
                                        >
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="d-flex">
                                                    <div className="me-3 mt-1">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" className="text-success">
                                                            <path fill="currentColor" d="M13.13,22.19L11.5,18.36C13.07,17.78 14.54,17 15.9,16.09L13.13,22.19M5.64,12.5L1.81,10.87L7.91,8.1C7,9.46 6.22,10.93 5.64,12.5M21.61,2.39C21.61,2.39 16.66,0.269 11,5.93C8.81,8.12 7.5,10.53 6.65,12.64C6.37,13.39 6.56,14.21 7.11,14.77L9.24,16.89C9.79,17.45 10.61,17.63 11.36,17.35C13.5,16.53 15.88,15.19 18.07,13C23.73,7.34 21.61,2.39 21.61,2.39M14.54,9.46C13.76,8.68 13.76,7.41 14.54,6.63C15.32,5.85 16.59,5.85 17.37,6.63C18.14,7.41 18.15,8.68 17.37,9.46C16.59,10.24 15.32,10.24 14.54,9.46Z"/>
                                                        </svg>
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
                                                        <span>
                                                          {status.startsWith("Not available until") ? (
                                                            <>
                                                            <span style={{ fontWeight: "bold", color: "#6c757d" }}>Not available until</span>
                                                            {` ${formatDate(quiz.availableFromDate)} | `}
                                                            </>
                                                            ) : status === "Available" ? (
                                                            <span style={{ fontWeight: "bold", color: "#6c757d" }}>Available | </span>
                                                            ) : status === "Closed" ? (
                                                            <span style={{ fontWeight: "bold", color: "#6c757d" }}>Closed | </span>
                                                            ) : (
                                                              `${status} | `
                                                            )}
                                                        </span>
                                                            {/* <span>
                                                                {status} | 
                                                            </span> */}
                                                            <span><span style={{ fontWeight: "bold", color: "#6c757d" }}> Due</span> {formatDate(quiz.dueDate)} | </span>
                                                            <span>{quiz.points} pts | </span>
                                                            <span>{quiz.questions?.length || 0} Questions</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    {isFaculty && (
                                                        <div 
                                                            onClick={() => !isClosed && handlePublishToggle(quiz._id, quiz.published)}
                                                            style={{ 
                                                                cursor: !isClosed ? 'pointer' : 'default',
                                                                marginRight: "10px"
                                                            }}
                                                        >
                                                            {quiz.published ? (
                                                                <GreenCheckmark />
                                                            ) : (
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                    <circle cx="12" cy="12" r="10" stroke="#b21e35" strokeWidth="2.5" />
                                                                    <line x1="5" y1="5" x2="19" y2="19" stroke="#b21e35" strokeWidth="2.5" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    {(isFaculty || quiz.published) && (
                                                        <div>
                                                            <Dropdown>
                                                                <Dropdown.Toggle 
                                                                    as="div" 
                                                                    id={`dropdown-${quiz._id}`}
                                                                    className="d-flex align-items-center justify-content-center"
                                                                    style={{ 
                                                                      cursor: 'pointer',
                                                                      marginTop: '2px',
                                                                     }}
                                                                >
                                                                    <FaEllipsisV style={{ color: '#6c757d' }} />
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu align="end">
                                                                    {isFaculty && (
                                                                        <>
                                                                            <Dropdown.Item onClick={() => handleEditClick(quiz._id)}>Edit</Dropdown.Item>
                                                                            <Dropdown.Item onClick={() => handleDeleteClick(quiz._id)}>Delete</Dropdown.Item>
                                                                            <Dropdown.Item 
                                                                                onClick={() => handlePublishToggle(quiz._id, quiz.published)}
                                                                                disabled={isClosed}
                                                                            >
                                                                                {quiz.published ? 'Unpublish' : 'Publish'}
                                                                            </Dropdown.Item>
                                                                            <Dropdown.Item>Copy</Dropdown.Item>
                                                                        </>
                                                                    )}
                                                                    {!isFaculty && quiz.published && (
                                                                        <Dropdown.Item onClick={() => handleQuizClick(quiz._id)}>View Quiz</Dropdown.Item>
                                                                    )}
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    )}
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