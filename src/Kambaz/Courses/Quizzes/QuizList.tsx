// src/Kambaz/Courses/Quizzes/QuizList.tsx
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, ListGroup, Dropdown, Row, Col } from "react-bootstrap";
import { FaEllipsisV, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { deleteQuiz, updateQuiz, addQuiz } from "./reducer";

type QuizQuestion = {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect?: boolean;
  }[];
  type?: "multiple-choice" | "true-false" | "essay";
  points?: number;
};

type Quiz = {
  _id: string;
  courseId: string;
  title: string;
  status: string;
  published: boolean;
  availableDate: string;
  dueDate: string;
  points: number;
  questions?: QuizQuestion[];
  score?: number;
};

export default function QuizList() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const quizzes = useSelector((state: any) => state.quizzesReducer.quizzes);
  const isFaculty = currentUser?.role === "FACULTY";

  const courseQuizzes = quizzes.filter((q: Quiz) => q.courseId === cid);
  const now = new Date();

  const getAvailability = (quiz: Quiz): string => {
    const available = new Date(quiz.availableDate);
    const until = new Date(quiz.dueDate);
    if (now < available) return `Not available until ${available.toLocaleString()}`;
    if (now > until) return "Closed";
    return "Available";
  };

  const handleAddQuiz = () => {
    const newQuiz: Quiz = {
      _id: uuidv4(),
      courseId: cid!,
      title: "Untitled Quiz",
      status: "draft",
      published: false,
      availableDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      points: 10,
      questions: [],
    };
    dispatch(addQuiz(newQuiz));
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${newQuiz._id}`);
  };

  const handleTogglePublish = (quiz: Quiz) => {
    dispatch(updateQuiz({ ...quiz, published: !quiz.published }));
  };

  const handleDelete = (quizId: string) => {
    dispatch(deleteQuiz(quizId));
  };

  return (
    <div className="p-3">
      <Row className="align-items-center mb-3">
        <Col><h4 className="fw-bold">Assignment Quizzes</h4></Col>
        {isFaculty && (
          <Col className="text-end">
            <Button variant="danger" onClick={handleAddQuiz}>+ Quiz</Button>
          </Col>
        )}
      </Row>

      {courseQuizzes.length === 0 ? (
        <div className="text-muted">No quizzes found. Click + Quiz to add one.</div>
      ) : (
        <ListGroup>
          {courseQuizzes.map((quiz: Quiz) => (
            <ListGroup.Item key={quiz._id} className="d-flex justify-content-between align-items-start">
              <div className="flex-fill">
                <div
                  className="fw-bold text-primary mb-1"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`)}
                >
                  {quiz.title}
                </div>
                <div className="text-muted small">
                  {getAvailability(quiz)} | Due {new Date(quiz.dueDate).toLocaleString()} |{" "}
                  {quiz.points} pts | {quiz.questions?.length ?? 0} Questions
                  {currentUser.role === "STUDENT" && quiz.score !== undefined && (
                    <> | Score: {quiz.score}%</>
                  )}
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => isFaculty && handleTogglePublish(quiz)}
                >
                  {quiz.published ? (
                    <FaCheckCircle className="text-success fs-4" title="Published" />
                  ) : (
                    <FaTimesCircle className="text-secondary fs-4" title="Unpublished" />
                  )}
                </span>
                {isFaculty && (
                  <Dropdown align="end">
                    <Dropdown.Toggle as="div" style={{ cursor: "pointer" }}>
                      <FaEllipsisV className="text-dark" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`)}>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDelete(quiz._id)}>Delete</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleTogglePublish(quiz)}>
                        {quiz.published ? "Unpublish" : "Publish"}
                      </Dropdown.Item>
                      <Dropdown.Item disabled>Copy</Dropdown.Item>
                      <Dropdown.Item disabled>Sort</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
