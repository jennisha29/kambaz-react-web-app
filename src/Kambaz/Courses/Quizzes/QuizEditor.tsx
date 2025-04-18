import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Nav, Dropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addQuiz, updateQuiz } from "./reducer";
import * as client from "./client";
import { Quiz } from "./client";
import { FaLock, FaBan, FaCheck, FaEdit, FaEye } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function QuizEditor() {
  const { qid, cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer || {});
  const isFaculty = currentUser && currentUser.role === "FACULTY";
  
  const isNewQuiz = !qid || qid === "new";
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [wordCount, setWordCount] = useState(0);

  const [assignments, setAssignments] = useState([
    {
      assignTo: "Everyone",
      dueDate: "",
      dueTime: "23:59",
      availableFromDate: "",
      availableFromTime: "00:00",
      availableUntilDate: "",
      availableUntilTime: "23:59"
    }
  ]);

  useEffect(() => {
    if (!isFaculty) {
      alert("Only faculty members can create or edit quizzes.");
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    }
  }, [isFaculty, navigate, cid]);

  const handleDateChange = (index: number, field: "dueDate" | "dueTime" | "availableFromDate" | "availableFromTime" | "availableUntilDate" | "availableUntilTime", value: string) => {
    const updated = [...assignments];
    updated[index][field] = value;
    setAssignments(updated);
  };

  const addAssignmentBlock = () => {
    setAssignments(prev => [
      ...prev,
      {
        assignTo: "Everyone",
        dueDate: "",
        dueTime: "23:59",
        availableFromDate: "",
        availableFromTime: "00:00",
        availableUntilDate: "",
        availableUntilTime: "23:59"
      }
    ]);
  };

  const removeAssignmentBlock = (index: number) => {
    setAssignments(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid && qid !== "new") {
        try {
          setLoading(true);
          const fetchedQuiz = await client.findQuizById(qid);
          // console.log("Fetched quiz:", fetchedQuiz);
          setQuiz(fetchedQuiz);
          
          const extractTimeFromDate = (dateString: string) => {
            if (!dateString) return "00:00";
            const date = new Date(dateString);
            return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
          };
  
          setAssignments([{
            assignTo: "Everyone",
            dueDate: fetchedQuiz.dueDate ? new Date(fetchedQuiz.dueDate).toISOString().split('T')[0] : "",
            dueTime: fetchedQuiz.dueDate ? extractTimeFromDate(fetchedQuiz.dueDate) : "23:59",
            availableFromDate: fetchedQuiz.availableFromDate ? new Date(fetchedQuiz.availableFromDate).toISOString().split('T')[0] : "",
            availableFromTime: fetchedQuiz.availableFromDate ? extractTimeFromDate(fetchedQuiz.availableFromDate) : "00:00",
            availableUntilDate: fetchedQuiz.availableUntilDate ? new Date(fetchedQuiz.availableUntilDate).toISOString().split('T')[0] : "",
            availableUntilTime: fetchedQuiz.availableUntilDate ? extractTimeFromDate(fetchedQuiz.availableUntilDate) : "23:59"
          }]);
          
          const words = fetchedQuiz.description ? 
            fetchedQuiz.description.trim().split(/\s+/).filter((w: string) => w.length > 0) : 
            [];
          setWordCount(words.length);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching quiz:", error);
          setLoading(false);
        }
      } else {
        const newQuiz = {
          title: "Unnamed Quiz",
          description: "",
          quizType: "Graded Quiz",
          points: 0,
          assignmentGroup: "Quizzes",
          shuffleAnswers: true,
          timeLimit: 20,
          multipleAttempts: false,
          attempts: 1,
          showCorrectAnswers: true,
          accessCode: "",
          oneQuestionAtATime: true,
          webcamRequired: false,
          lockQuestionsAfterAnswering: false,
          dueDate: "",
          availableFromDate: "",
          availableUntilDate: "",
          course: cid || "",
          published: false,
          questions: []
        };
        setQuiz(newQuiz);
        setWordCount(0);
        setLoading(false);
      }
    };
    
    if (isFaculty) {
      fetchQuiz();
    }
  }, [qid, cid, isFaculty]);

  const saveQuiz = async (publish = false) => {
    if (!quiz) return;
    
    if (!isFaculty) {
      alert("Only faculty members can save quizzes.");
      return;
    }
    
    try {
      const firstAssignment = assignments[0];

      const combineDateTime = (date: string, time: string) => {
        if (!date) return "";
        const [year, month, day] = date.split('-').map(num => parseInt(num));
        const [hours, minutes] = time.split(':').map(num => parseInt(num));
        const dateObj = new Date(year, month - 1, day, hours, minutes);
        return dateObj.toISOString();
      };
      
      const dueDate = combineDateTime(firstAssignment.dueDate, firstAssignment.dueTime || "23:59");
      const availableFromDate = combineDateTime(
        firstAssignment.availableFromDate, 
        firstAssignment.availableFromTime || "00:00"
      );
      const availableUntilDate = combineDateTime(
        firstAssignment.availableUntilDate, 
        firstAssignment.availableUntilTime || "23:59"
      );
      
      const quizData = {
        title: quiz.title,
        description: quiz.description || "",
        quizType: quiz.quizType,
        points: quiz.points,
        assignmentGroup: quiz.assignmentGroup,
        shuffleAnswers: quiz.shuffleAnswers,
        timeLimit: quiz.timeLimit,
        multipleAttempts: quiz.multipleAttempts,
        attempts: quiz.attempts,
        showCorrectAnswers: quiz.showCorrectAnswers,
        accessCode: quiz.accessCode || "",
        oneQuestionAtATime: quiz.oneQuestionAtATime,
        webcamRequired: quiz.webcamRequired,
        lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering,
        dueDate,
        availableFromDate,
        availableUntilDate,
        course: cid || "",
        published: publish || quiz.published,
        questions: quiz.questions || []
      };
      
      if (!isNewQuiz) {
        const quizToUpdate = {
          ...quizData,
          _id: qid
        };
        
        // console.log("Updating quiz with data:", JSON.stringify(quizToUpdate, null, 2));
        
        const updatedQuiz = await client.updateQuiz(quizToUpdate);
        // console.log("Quiz updated:", updatedQuiz);
        
        dispatch(updateQuiz(updatedQuiz));
        alert("Quiz updated successfully!");
      } else {
        // console.log("Creating new quiz with data:", JSON.stringify(quizData, null, 2));
        
        const savedQuiz = await client.createQuiz(cid as string, quizData);
        console.log("New quiz created:", savedQuiz);
        dispatch(addQuiz(savedQuiz));
        
        alert("Quiz created successfully!");
      }
      
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    } catch (error: any) {
      console.error("Error saving quiz:", error);
      
      let errorMessage = `Failed to ${isNewQuiz ? 'create' : 'update'} quiz. Please try again.`;
      
      if (error && typeof error === 'object') {
        if ('response' in error && error.response && typeof error.response === 'object') {
          const response = error.response as { data?: any; status?: number };
          
          console.error("Server response:", response.data);
          console.error("Status code:", response.status);
          
          if (response.data && typeof response.data === 'object' && 'message' in response.data) {
            errorMessage = String(response.data.message);
          }
        } else if ('message' in error && error.message) {
          errorMessage = String(error.message);
        }
      }
      
      alert(errorMessage);
    }
  };

  const handleCancel = () => navigate(`/Kambaz/Courses/${cid}/Quizzes`);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
    setQuiz(prev => prev ? { ...prev, description: text } : null);
  };
  
  const calculateTotalPoints = () => {
    if (!quiz?.questions?.length) return 0;
    return quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  };

  if (!isFaculty) {
    return null; 
  }

  if (loading) return <div>Loading quiz editor...</div>;
  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div className="container-fluid px-0">
      <div className="d-flex justify-content-between align-items-center mb-2 px-3">
        <h1 className="mb-0">{isNewQuiz ? "Create Quiz" : "Edit Quiz"}</h1>
        <div className="d-flex align-items-center">
          <span className="text-secondary me-3">Points {calculateTotalPoints()}</span>
          <div className="d-flex align-items-center me-3">
            {quiz.published ? (
              <FaCheck className="me-2 text-success" />
            ) : (
              <FaBan className="me-2 text-secondary" />
            )}
            <span className="text-secondary">
              {quiz.published ? "Published" : "Not Published"}
            </span>
          </div>
          <Dropdown>
            <Dropdown.Toggle variant="light" className="border" id="dropdown-options">
              <BsThreeDotsVertical />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item><FaEdit className="me-2" /> Edit Title</Dropdown.Item>
              <Dropdown.Item onClick={() => saveQuiz(true)}><FaCheck className="me-2" /> Publish</Dropdown.Item>
              <Dropdown.Item><FaEye className="me-2" /> Preview</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item><FaLock className="me-2" /> Lock Quiz</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <Nav variant="tabs" className="mb-3 border-bottom">
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'details'} 
            onClick={() => setActiveTab('details')}
            className={activeTab === 'details' ? "text-danger border-top border-start border-end" : ""}
          >
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'questions'} 
            onClick={() => {

              if (qid && qid !== "new") {
                navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/questions`);
              } else {

                alert("Please save the quiz first before adding questions.");
              }
            }}
            className={activeTab === 'questions' ? "text-danger border-top border-start border-end" : "text-secondary"}
          >
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === 'details' && (
        <div className="px-3">
          <Form>
            <Form.Group className="mb-4">
              <Form.Control
                type="text"
                placeholder="Unnamed Quiz"
                value={quiz.title || ""}
                onChange={(e) => setQuiz({...quiz, title: e.target.value})}
                className="p-2 border"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <h5 className="mb-3">Quiz Instructions:</h5>
              <Form.Control
              as="textarea"
              rows={5}
              value={quiz.description || ""}
              onChange={handleDescriptionChange}
              className="border"
              />
              <div className="text-end">
                <small className="text-muted ms-2">{wordCount} words</small>
              </div>
            </Form.Group>
            
            <div className="row mb-4 align-items-center">
              <div className="col-md-4">
                <Form.Label className="pt-2">Quiz Type</Form.Label>
                <Form.Select
                value={quiz.quizType}
                onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value })}
                >
                  <option value="Graded Quiz">Graded Quiz</option>
                  <option value="Practice Quiz">Practice Quiz</option>
                  <option value="Graded Survey">Graded Survey</option>
                  <option value="Ungraded Survey">Ungraded Survey</option>
                </Form.Select>
              </div>
              <div className="col-md-4">
                <Form.Label className="pt-2">Assignment Group</Form.Label>
                <Form.Select
                  value={quiz.assignmentGroup}
                  onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value })}
                >
                  <option value="Quizzes">Quizzes</option>
                  <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                  <option value="Exams">Exams</option>
                  <option value="Project">Project</option>
                </Form.Select>
              </div>
            </div>
            
            <h5 className="mb-3">Options</h5>
            
            <div className="ms-4 mb-3">
              <Form.Check
                type="checkbox"
                id="shuffle-answers"
                label="Shuffle Answers"
                checked={quiz.shuffleAnswers}
                onChange={(e) => setQuiz({...quiz, shuffleAnswers: e.target.checked})}
              />
            </div>
            
            <div className="ms-4 mb-3">
              <Form.Check
                type="checkbox"
                id="time-limit"
                label="Time Limit"
                checked={quiz.timeLimit !== undefined}
                onChange={(e) => setQuiz({...quiz, timeLimit: e.target.checked ? 20 : undefined})}
                className="mb-2"
              />
              
              {quiz.timeLimit !== undefined && (
                <div className="d-flex align-items-center ms-4">
                  <Form.Control
                    type="number"
                    value={quiz.timeLimit}
                    onChange={(e) => setQuiz({...quiz, timeLimit: parseInt(e.target.value)})}
                    style={{width: "80px"}}
                    className="me-2"
                  />
                  <span>Minutes</span>
                </div>
              )}
            </div>
            
            <div className="ms-4 mb-3 border rounded p-2">
              <Form.Check
                type="checkbox"
                id="multiple-attempts"
                label="Allow Multiple Attempts"
                checked={quiz.multipleAttempts}
                onChange={(e) => setQuiz({...quiz, multipleAttempts: e.target.checked})}
              />

              {quiz.multipleAttempts && (
                <div className="mt-2 ms-4">
                  <Form.Group>
                    <Form.Label>Number of Attempts</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={quiz.attempts || 1}
                      onChange={(e) => setQuiz({...quiz, attempts: parseInt(e.target.value)})}
                      style={{maxWidth: "100px"}}
                    />
                  </Form.Group>
                </div>
              )}
            </div>
            
            <div className="ms-4 mb-3">
              <Form.Check
                type="checkbox"
                id="show-correct"
                label="Show Correct Answers"
                checked={quiz.showCorrectAnswers}
                onChange={(e) => setQuiz({...quiz, showCorrectAnswers: e.target.checked})}
              />
            </div>
            
            <div className="ms-4 mb-3">
              <Form.Check
                type="checkbox"
                id="one-question"
                label="One Question at a Time"
                checked={quiz.oneQuestionAtATime}
                onChange={(e) => setQuiz({...quiz, oneQuestionAtATime: e.target.checked})}
              />
            </div>
            
            <div className="ms-4 mb-3">
              <Form.Check
                type="checkbox"
                id="webcam"
                label="Webcam Required"
                checked={quiz.webcamRequired}
                onChange={(e) => setQuiz({...quiz, webcamRequired: e.target.checked})}
              />
            </div>
            
            <div className="ms-4 mb-4">
              <Form.Check
                type="checkbox"
                id="lock-questions"
                label="Lock Questions After Answering"
                checked={quiz.lockQuestionsAfterAnswering}
                onChange={(e) => setQuiz({...quiz, lockQuestionsAfterAnswering: e.target.checked})}
              />
            </div>

            <h5 className="mb-3">Assign</h5>

            <div className="border rounded mb-4">
              {assignments.map((a, index) => (
                <div key={index} className="p-3 border-bottom">
                  <h6 className="mb-3">Assign to</h6>
                  <div className="mb-3 p-2 border rounded bg-light d-flex justify-content-between">
                    <span>{a.assignTo}</span>
                    {index > 0 && (
                      <button
                        type="button"
                        className="btn btn-sm text-secondary"
                        onClick={() => removeAssignmentBlock(index)}
                      >×</button>
                    )}
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Due</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="date"
                        value={a.dueDate}
                        onChange={(e) => handleDateChange(index, "dueDate", e.target.value)}
                        className="me-2"
                      />
                      <Form.Control
                        type="time"
                        value={a.dueTime}
                        onChange={(e) => handleDateChange(index, "dueTime", e.target.value)}
                      />
                    </div>
                  </Form.Group>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label>Available from</Form.Label>
                        <div className="d-flex">
                          <Form.Control
                            type="date"
                            value={a.availableFromDate}
                            onChange={(e) => handleDateChange(index, "availableFromDate", e.target.value)}
                            className="me-2"
                          />
                          <Form.Control
                            type="time"
                            value={a.availableFromTime}
                            onChange={(e) => handleDateChange(index, "availableFromTime", e.target.value)}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label>Until</Form.Label>
                        <div className="d-flex">
                          <Form.Control
                            type="date"
                            value={a.availableUntilDate}
                            onChange={(e) => handleDateChange(index, "availableUntilDate", e.target.value)}
                            className="me-2"
                          />
                          <Form.Control
                            type="time"
                            value={a.availableUntilTime}
                            onChange={(e) => handleDateChange(index, "availableUntilTime", e.target.value)}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-top p-2 bg-light text-center">
                <Button 
                  variant="light" 
                  className="border" 
                  size="sm" 
                  onClick={addAssignmentBlock}
                  type="button"
                >
                  <span className="me-1">+</span> Add
                </Button>
              </div>
            </div>
            
            <hr />

            <div className="d-flex justify-content-center mt-4 mb-5">
              <Button 
                variant="light" 
                className="border me-2" 
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={() => saveQuiz(false)}
                type="button"
              >
                {isNewQuiz ? "Create" : "Save"}
              </Button>
            </div>
          </Form>
        </div>
      )}
      
      {activeTab === 'questions' && (
        <div className="px-3">
          <div className="alert alert-info">
            No questions added yet. Click "Add Question" to create your first question.
          </div>
          
          <Button variant="primary" className="mt-3" type="button">
            Add Question
          </Button>
          
          <hr />
          
          <div className="d-flex justify-content-center mt-4 mb-5">
            <Button variant="light" className="border me-2" onClick={handleCancel} type="button">
              Cancel
            </Button>
            <Button variant="danger" onClick={() => saveQuiz(false)} type="button">
              {isNewQuiz ? "Create" : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}