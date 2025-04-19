import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedQuiz } from "./reducer";
import * as client from "./client";


export default function Details() {
  const { qid, cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentUser } = useSelector((state: any) => state.accountReducer || {});
  const isFaculty = currentUser && currentUser.role === "FACULTY";

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid && qid !== "new") {
        try {
          setLoading(true);
          const fetchedQuiz = await client.findQuizById(qid);
          
          if (fetchedQuiz) {
            setQuiz(fetchedQuiz);
            dispatch(setSelectedQuiz(fetchedQuiz));
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching quiz:", error);
          setLoading(false);
        }
      } else if (qid === "new") {
        if (!isFaculty) {
          alert("Only faculty members can create quizzes.");
          navigate(`/Kambaz/Courses/${cid}/Quizzes`);
          return;
        }
        
        setQuiz({
          title: "New Quiz",
          quizType: "Graded Quiz",
          points: 100,
          assignmentGroup: "QUIZZES",
          shuffleAnswers: "No",
          timeLimit: 20,
          multipleAttempts: "No",
          attempts: 1,
          viewResponses: "Always",
          showCorrectAnswers: "Immediately",
          oneQuestionAtTime: "Yes",
          requireRespondusLockDown: "No",
          requiredToViewResults: "No",
          webcamRequired: "No",
          lockQuestionsAfterAnswering: "No",
          dueDate: new Date().toISOString(),
          availableFromDate: new Date().toISOString(),
          availableUntilDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          assignTo: "Everyone",
          course: cid,
          published: false,
          questions: []
        });
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [qid, cid, dispatch, isFaculty, navigate]);
  
  const handleEdit = () => {
    if (!isFaculty) {
      alert("Only faculty members can edit quizzes.");
      return;
    }

    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);

    setTimeout(() => {
      console.log("Current location after navigation:", window.location.pathname);
    }, 500);
  };
  
  const handlePreview = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/preview`);
  };
  
  const handleStartQuiz = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/take`);
  };


  const formatCorrectAnswerOption = (option: string | undefined) => {
    if (!option) return "Immediately";
    
    if (option === "immediately") return "Immediately";
    if (option === "after_due_date") return "After due date";
    
    if (option.startsWith("after_attempt_")) {
      const attemptNumber = option.split("_")[2];
      return `After attempt ${attemptNumber}`;
    }
    
    return option;
  };

  if (loading) {
    return <div>Loading quiz details...</div>;
  }
  
  if (!quiz) {
    return <div>Quiz not found.</div>;
  }
  
  return (
    <div>
      <div className="d-flex justify-content-end mb-4">
        {isFaculty && (
          <>
            <Button 
              variant="outline-secondary" 
              className="me-2"
              onClick={handlePreview}
            >
              Preview
            </Button>
            <Button 
              variant="outline-secondary"
              onClick={handleEdit}
            >
              <i className="fas fa-pencil-alt me-1"></i> Edit
            </Button>
          </>
        )}
      </div>
      
      <h2 className="mb-4">{quiz.title}</h2>
      
      {quiz.description && !isFaculty && (
        <div className="mb-3 p-1 border rounded">
          <h5 className="text-danger">Instructions:</h5>
           <div>{quiz.description.replace(/<[^>]+>/g, '')}</div>
        </div>
      )}
      <div className="mb-4">
        <table className="w-50">
          <tbody>
            <tr>
              <td className="text-end text-secondary pe-3" style={{ width: "45%" }}>Quiz Type</td>
              <td>{quiz.quizType || "Graded Quiz"}</td>
            </tr>
            <tr>
              <td className="text-end text-secondary pe-3">Points</td>
              <td>{quiz.points || 0}</td>
            </tr>
            <tr>
              <td className="text-end text-secondary pe-3">Assignment Group</td>
              <td>{quiz.assignmentGroup || "QUIZZES"}</td>
            </tr>

            {isFaculty && (
              <tr>
                <td className="text-end text-secondary pe-3">Shuffle Answers</td>
                <td>{typeof quiz.shuffleAnswers === 'boolean' ? (quiz.shuffleAnswers ? "Yes" : "No") : quiz.shuffleAnswers || "No"}</td>
              </tr>
            )}
            <tr>
              <td className="text-end text-secondary pe-3">Time Limit</td>
              <td>{quiz.timeLimit ? `${quiz.timeLimit} Minutes` : "No Time Limit"}</td>
            </tr>
            <tr>
              <td className="text-end text-secondary pe-3">Multiple Attempts</td>
              <td>{typeof quiz.multipleAttempts === 'boolean' ? (quiz.multipleAttempts ? "Yes" : "No") : quiz.multipleAttempts || "No"}</td>
            </tr>
            {quiz.multipleAttempts && (
              <tr>
                <td className="text-end text-secondary pe-3">Number of Attempts</td>
                <td>{quiz.attempts || 1}</td>
              </tr>
            )}

            {isFaculty && (
              <tr>
                <td className="text-end text-secondary pe-3">View Responses</td>
                <td>{quiz.viewResponses || "Always"}</td>
              </tr>
            )}

            {isFaculty && (
              <tr>
                <td className="text-end text-secondary pe-3">Show Correct Answers</td>
                <td>{typeof quiz.showCorrectAnswers === 'boolean' ? 
                  (quiz.showCorrectAnswers ? formatCorrectAnswerOption(quiz.showCorrectAnswerOption) : "No") : 
                  quiz.showCorrectAnswers || "No"}
                </td>
              </tr>
            )}

            {isFaculty && (
              <tr>
                <td className="text-end text-secondary pe-3">One Question at a Time</td>
                <td>{quiz.oneQuestionAtTime || "Yes"}</td>
              </tr>
            )}
 
            {isFaculty && (
              <tr>
                <td className="text-end text-secondary pe-3">Require Respondus LockDown<br />Browser</td>
                <td>{quiz.requireRespondusLockDown || "No"}</td>
              </tr>
            )}

            {isFaculty && (
              <tr>
                <td className="text-end text-secondary pe-3">Required to View Quiz Results</td>
                <td>{quiz.requiredToViewResults || "No"}</td>
              </tr>
            )}
            <tr>
              <td className="text-end text-secondary pe-3">Webcam Required</td>
              <td>{typeof quiz.webcamRequired === 'boolean' ? 
              (quiz.webcamRequired ? "Yes" : "No") : 
              quiz.webcamRequired || "No"}
              </td>
            </tr>

            {isFaculty && (
              <tr>
                <td className="text-end text-secondary pe-3">Lock Questions After Answering</td>
                <td>{typeof quiz.lockQuestionsAfterAnswering === 'boolean' ? 
                (quiz.lockQuestionsAfterAnswering ? "Yes" : "No") : 
                quiz.lockQuestionsAfterAnswering || "No"}
                </td>
              </tr>
            )}

            <tr>
              <td className="text-end text-secondary pe-3">Access Code</td>
              <td>{isFaculty ? 
                (quiz.accessCode ? quiz.accessCode : "None") : 
                (quiz.accessCode ? "Required" : "None")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mb-4">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Due</th>
              <th>For</th>
              <th>Available from</th>
              <th>Until</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{formatDate(quiz.dueDate)}</td>
              <td>{quiz.assignTo || "Everyone"}</td>
              <td>{formatDate(quiz.availableFromDate || quiz.dueDate)}</td>
              <td>{formatDate(quiz.availableUntilDate || quiz.dueDate)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {!isFaculty && quiz.published && (
        <div className="mt-4">
          <Button 
            variant="danger"
            size="lg"
            onClick={handleStartQuiz}
          >
            Start Quiz
          </Button>
        </div>
      )}
    </div>
  );
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return "Not set";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};