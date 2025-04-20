import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  _id: string;
  title?: string;
  text?: string;
  questionText?: string;
  questionType: string;
  points: number;
  options?: Option[];
  correctAnswer?: boolean | string[];
}

interface Quiz {
  title: string;
  description: string;
  questions: Question[];
}

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();

  const selectedQuiz = useSelector(
    (state: any) => state.quizzesReducer?.selectedQuiz as Quiz
  );

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState<number | null>(null);

  const handleOptionChange = (questionId: string, value: any) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    let totalScore = 0;
    selectedQuiz.questions.forEach((question) => {
      const answer = answers[question._id];
      if (question.questionType === "Multiple Choice") {
        const correctOption = question.options?.find((opt) => opt.isCorrect);
        if (answer === correctOption?.id) totalScore += question.points;
      } else if (question.questionType === "True/False") {
        if (answer === question.correctAnswer) totalScore += question.points;
      } else if (question.questionType === "Fill in the Blank") {
        const correctAnswers = (question.correctAnswer as string[]).map((a) =>
          a.toLowerCase()
        );
        if (correctAnswers.includes(answer?.toLowerCase?.()))
          totalScore += question.points;
      }
    });
    setScore(totalScore);
  };

  const handleEditQuiz = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);
  };

  if (!selectedQuiz) return <Container>Loading Quiz...</Container>;

  if (score !== null) {
    return (
      <Container className="py-4">
        <h2 className="mb-4">Quiz Submitted!</h2>
        <p className="mb-4">
          Your score:{" "}
          <strong>
            {score} /{" "}
            {selectedQuiz.questions.reduce((sum, q) => sum + q.points, 0)}
          </strong>
        </p>

        {selectedQuiz.questions.map((question, idx) => {
          const userAnswer = answers[question._id];
          const questionText =
            question.text || question.questionText || "Untitled Question";

          return (
            <Card key={question._id} className="mb-4">
              <Card.Body>
                <Row className="mb-2">
                  <Col>
                    <h5>Question {idx + 1}</h5>
                  </Col>
                  <Col className="text-end">{question.points} pts</Col>
                </Row>
                <p>{questionText}</p>

                {question.questionType === "Multiple Choice" &&
                  question.options?.map((option) => {
                    const isCorrect = option.isCorrect;
                    const isSelected = userAnswer === option.id;
                    return (
                      <div
                        key={option.id}
                        className={`p-2 mb-2 rounded border ${
                          isCorrect
                            ? "border-success bg-light"
                            : isSelected
                            ? "border-danger bg-light"
                            : ""
                        }`}
                      >
                        <Form.Check
                          type="radio"
                          label={
                            <span>
                              {option.text}{" "}
                              {isCorrect && <strong>(Correct)</strong>}
                            </span>
                          }
                          checked={isSelected}
                          readOnly
                        />
                      </div>
                    );
                  })}

                {question.questionType === "True/False" && (
                  <>
                    {[true, false].map((boolVal) => {
                      const isCorrect = question.correctAnswer === boolVal;
                      const isSelected = userAnswer === boolVal;
                      return (
                        <div
                          key={String(boolVal)}
                          className={`p-2 mb-2 rounded border ${
                            isCorrect
                              ? "border-success bg-light"
                              : isSelected
                              ? "border-danger bg-light"
                              : ""
                          }`}
                        >
                          <Form.Check
                            type="radio"
                            label={
                              <span>
                                {String(boolVal).charAt(0).toUpperCase() +
                                  String(boolVal).slice(1)}{" "}
                                {isCorrect && <strong>(Correct)</strong>}
                              </span>
                            }
                            checked={isSelected}
                            readOnly
                          />
                        </div>
                      );
                    })}
                  </>
                )}

                {question.questionType === "Fill in the Blank" && (
                  <>
                    <p>
                      Your answer: <strong>{userAnswer}</strong>
                    </p>
                    <p>
                      Correct answer(s):{" "}
                      <strong>
                        {(question.correctAnswer as string[]).join(", ")}
                      </strong>
                    </p>
                  </>
                )}
              </Card.Body>
            </Card>
          );
        })}
      </Container>
    );
  }

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
  const questionText =
    currentQuestion.text || currentQuestion.questionText || "Untitled Question";

  return (
    <Container className="py-4">
      <h2 className="mb-3">{selectedQuiz.title}</h2>
      <p className="mb-4">{selectedQuiz.description}</p>

      <Card className="mb-4">
        <Card.Body>
          <Row className="mb-2">
            <Col>
              <h5>
                Question {currentQuestionIndex + 1} of{" "}
                {selectedQuiz.questions.length}
              </h5>
            </Col>
            <Col className="text-end">{currentQuestion.points} pts</Col>
          </Row>

          <p>{questionText}</p>

          {currentQuestion.questionType === "Multiple Choice" &&
            currentQuestion.options?.map((option) => (
              <Form.Check
                key={option.id}
                type="radio"
                name={currentQuestion._id}
                label={option.text}
                value={option.id}
                checked={answers[currentQuestion._id] === option.id}
                onChange={() =>
                  handleOptionChange(currentQuestion._id, option.id)
                }
                className="mb-2"
              />
            ))}

          {currentQuestion.questionType === "True/False" && (
            <>
              {[true, false].map((boolVal) => (
                <Form.Check
                  key={String(boolVal)}
                  type="radio"
                  name={currentQuestion._id}
                  label={
                    String(boolVal).charAt(0).toUpperCase() +
                    String(boolVal).slice(1)
                  }
                  value={String(boolVal)}
                  checked={answers[currentQuestion._id] === boolVal}
                  onChange={() =>
                    handleOptionChange(currentQuestion._id, boolVal)
                  }
                  className="mb-2"
                />
              ))}
            </>
          )}

          {currentQuestion.questionType === "Fill in the Blank" && (
            <Form.Control
              type="text"
              value={answers[currentQuestion._id] || ""}
              onChange={(e) =>
                handleOptionChange(currentQuestion._id, e.target.value)
              }
              placeholder="Type your answer here"
            />
          )}
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-between">
        <Button
          variant="secondary"
          onClick={handleNext}
          disabled={currentQuestionIndex >= selectedQuiz.questions.length - 1}
        >
          Next
        </Button>

        <div className="d-flex gap-2 ms-auto">
          {currentQuestionIndex === selectedQuiz.questions.length - 1 && (
            <Button variant="danger" onClick={handleSubmit}>
              Submit Quiz
            </Button>
          )}
          <Button variant="secondary" onClick={handleEditQuiz}>
            Edit Quiz
          </Button>
        </div>
      </div>
    </Container>
  );
}
