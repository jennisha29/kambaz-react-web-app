import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Tabs, Tab } from "react-bootstrap";
import { useDispatch } from "react-redux"; // Removed useSelector since it's not used
import { updateQuiz, addQuiz } from "./reducer";
import * as client from "./client";
import { Quiz } from "./client"; // Import the Quiz interface

export default function QuizEditor() {
  const { qid, cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid && qid !== "new") {
        try {
          setLoading(true);
          const fetchedQuiz = await client.findQuizById(qid);
          
          // Convert string values to boolean for compatibility with server schema
          const formattedQuiz = {
            ...fetchedQuiz,
            shuffleAnswers: typeof fetchedQuiz.shuffleAnswers === 'string' 
              ? fetchedQuiz.shuffleAnswers === 'Yes' 
              : fetchedQuiz.shuffleAnswers,
            multipleAttempts: typeof fetchedQuiz.multipleAttempts === 'string'
              ? fetchedQuiz.multipleAttempts === 'Yes'
              : fetchedQuiz.multipleAttempts,
            showCorrectAnswers: typeof fetchedQuiz.showCorrectAnswers === 'string'
              ? fetchedQuiz.showCorrectAnswers === 'Immediately'
              : fetchedQuiz.showCorrectAnswers,
            oneQuestionAtATime: typeof fetchedQuiz.oneQuestionAtTime === 'string'
              ? fetchedQuiz.oneQuestionAtTime === 'Yes'
              : fetchedQuiz.oneQuestionAtATime,
            webcamRequired: typeof fetchedQuiz.webcamRequired === 'string'
              ? fetchedQuiz.webcamRequired === 'Yes'
              : fetchedQuiz.webcamRequired,
            lockQuestionsAfterAnswering: typeof fetchedQuiz.lockQuestionsAfterAnswering === 'string'
              ? fetchedQuiz.lockQuestionsAfterAnswering === 'Yes'
              : fetchedQuiz.lockQuestionsAfterAnswering
          };
          
          setQuiz(formattedQuiz);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching quiz:", error);
          setLoading(false);
        }
      } else if (qid === "new") {
        // Set default values for a new quiz with boolean values
        setQuiz({
          title: "New Quiz",
          description: "",
          quizType: "Graded Quiz",
          points: 100,
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
          dueDate: new Date().toISOString(),
          availableFromDate: new Date().toISOString(),
          availableUntilDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          course: cid || "",
          published: false,
          questions: []
        });
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [qid, cid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox vs other inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setQuiz((prev: Quiz | null) => prev ? { ...prev, [name]: checked } : null);
    } else {
      setQuiz((prev: Quiz | null) => prev ? { ...prev, [name]: value } : null);
    }
  };

  const saveQuiz = async (publish: boolean = false) => {
    if (!quiz) return;
    
    try {
      const quizToSave = {
        ...quiz,
        published: publish || quiz.published
      };
      
      let savedQuiz;
      if (qid === "new") {
        savedQuiz = await client.createQuiz(cid as string, quizToSave);
        dispatch(addQuiz(savedQuiz));
      } else {
        savedQuiz = await client.updateQuiz(quizToSave);
        dispatch(updateQuiz(savedQuiz));
      }
      
      if (publish) {
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      } else {
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${savedQuiz._id}`);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found.</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{qid === "new" ? "Create New Quiz" : `Edit Quiz: ${quiz.title}`}</h2>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "details")}
        className="mb-4"
      >
        <Tab eventKey="details" title="Details">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={quiz.title || ""}
                onChange={handleInputChange}
                placeholder="Quiz Title"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={quiz.description || ""}
                onChange={handleInputChange}
                placeholder="Quiz Description"
                rows={3}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Quiz Type</Form.Label>
              <Form.Select 
                name="quizType" 
                value={quiz.quizType || "Graded Quiz"}
                onChange={handleInputChange}
              >
                <option value="Graded Quiz">Graded Quiz</option>
                <option value="Practice Quiz">Practice Quiz</option>
                <option value="Graded Survey">Graded Survey</option>
                <option value="Ungraded Survey">Ungraded Survey</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Assignment Group</Form.Label>
              <Form.Select 
                name="assignmentGroup" 
                value={quiz.assignmentGroup || "Quizzes"}
                onChange={handleInputChange}
              >
                <option value="Quizzes">Quizzes</option>
                <option value="Exams">Exams</option>
                <option value="Assignments">Assignments</option>
                <option value="Project">Project</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                label="Shuffle Answers"
                name="shuffleAnswers"
                checked={quiz.shuffleAnswers}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Time Limit (minutes)</Form.Label>
              <Form.Control
                type="number"
                name="timeLimit"
                value={quiz.timeLimit || 20}
                onChange={handleInputChange}
                min={0}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                label="Multiple Attempts"
                name="multipleAttempts"
                checked={quiz.multipleAttempts}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            {quiz.multipleAttempts && (
              <Form.Group className="mb-3">
                <Form.Label>Number of Attempts</Form.Label>
                <Form.Control
                  type="number"
                  name="attempts"
                  value={quiz.attempts || 1}
                  onChange={handleInputChange}
                  min={1}
                />
              </Form.Group>
            )}
            
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                label="Show Correct Answers"
                name="showCorrectAnswers"
                checked={quiz.showCorrectAnswers}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Access Code (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="accessCode"
                value={quiz.accessCode || ""}
                onChange={handleInputChange}
                placeholder="Leave blank for no access code"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                label="One Question at a Time"
                name="oneQuestionAtATime"
                checked={quiz.oneQuestionAtATime}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                label="Webcam Required"
                name="webcamRequired"
                checked={quiz.webcamRequired}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                label="Lock Questions After Answering"
                name="lockQuestionsAfterAnswering"
                checked={quiz.lockQuestionsAfterAnswering}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="dueDate"
                value={formatDateForInput(quiz.dueDate)}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Available From Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="availableFromDate"
                value={formatDateForInput(quiz.availableFromDate)}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Available Until Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="availableUntilDate"
                value={formatDateForInput(quiz.availableUntilDate)}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <div className="d-flex gap-2 justify-content-end mt-4">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="success" onClick={() => saveQuiz()}>
                Save
              </Button>
              <Button variant="primary" onClick={() => saveQuiz(true)}>
                Save & Publish
              </Button>
            </div>
          </Form>
        </Tab>
        
        <Tab eventKey="questions" title="Questions">
          <div className="p-4">
            <h3>Quiz Questions</h3>
            
            {quiz.questions && quiz.questions.length > 0 ? (
              <div>
                {quiz.questions.map((question, index) => (
                  <div key={question._id || index} className="card mb-3">
                    <div className="card-header d-flex justify-content-between">
                      <span>Question {index + 1}</span>
                      <span>{question.points} pts</span>
                    </div>
                    <div className="card-body">
                      <h5>{question.title}</h5>
                      <p>{question.questionText}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info">
                No questions added yet. Click "Add Question" to create your first question.
              </div>
            )}
            
            <Button variant="primary" className="mt-3">
              Add Question
            </Button>
            
            <div className="d-flex gap-2 justify-content-end mt-4">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="success" onClick={() => saveQuiz()}>
                Save
              </Button>
              <Button variant="primary" onClick={() => saveQuiz(true)}>
                Save & Publish
              </Button>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

// Helper function to format dates for input elements
const formatDateForInput = (dateString?: string): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format YYYY-MM-DDTHH:MM
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return "";
  }
};