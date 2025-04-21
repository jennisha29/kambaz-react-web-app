import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { QuestionType, Quiz } from "./client";

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
      const answer = answers[question._id!];

      if (question.questionType === QuestionType.MULTIPLE_CHOICE) {
        const correctChoice =
          question.choices?.[question.correctAnswer as number];
        if (answer === correctChoice) totalScore += question.points;
      } else if (question.questionType === QuestionType.TRUE_FALSE) {
        if (answer === question.correctAnswer) totalScore += question.points;
      } else if (question.questionType === QuestionType.FILL_IN_BLANK) {
        const correctAnswers = (question.correctAnswer as string[]).map((a) =>
          a.toLowerCase()
        );
        if (correctAnswers.includes(answer?.toLowerCase?.())) {
          totalScore += question.points;
        }
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
          const userAnswer = answers[question._id!];

          return (
            <Card key={question._id} className="mb-4">
              <Card.Body>
                <Row className="mb-2">
                  <Col>
                    <h5>Question {idx + 1}</h5>
                  </Col>
                  <Col className="text-end">{question.points} pts</Col>
                </Row>
                <div
                  dangerouslySetInnerHTML={{
                    __html: question.questionText,
                  }}
                />

                {question.questionType === QuestionType.MULTIPLE_CHOICE &&
                  question.choices?.map((choice, i) => {
                    const correctChoice =
                      question.choices?.[question.correctAnswer as number];
                    const isCorrect = choice === correctChoice;
                    const isSelected = userAnswer === choice;

                    return (
                      <div
                        key={`${question._id}-choice-${i}`}
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
                              {choice} {isCorrect && <strong>(Correct)</strong>}
                            </span>
                          }
                          checked={isSelected}
                          readOnly
                        />
                      </div>
                    );
                  })}

                {question.questionType === QuestionType.TRUE_FALSE && (
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

                {question.questionType === QuestionType.FILL_IN_BLANK && (
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

  return (
    <Container className="py-4">
      <h2 className="mb-3">{selectedQuiz.title}</h2>
      <div
        dangerouslySetInnerHTML={{ __html: selectedQuiz.description || "" }}
      />

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

          <div
            dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }}
          />

          {currentQuestion.questionType === QuestionType.MULTIPLE_CHOICE &&
            currentQuestion.choices?.map((choice, i) => (
              <Form.Check
                key={`${currentQuestion._id}-choice-${i}`}
                type="radio"
                name={currentQuestion._id}
                label={choice}
                value={choice}
                checked={answers[currentQuestion._id!] === choice}
                onChange={() =>
                  handleOptionChange(currentQuestion._id!, choice)
                }
                className="mb-2"
              />
            ))}

          {currentQuestion.questionType === QuestionType.TRUE_FALSE &&
            [true, false].map((boolVal) => (
              <Form.Check
                key={String(boolVal)}
                type="radio"
                name={currentQuestion._id}
                label={
                  String(boolVal).charAt(0).toUpperCase() +
                  String(boolVal).slice(1)
                }
                value={String(boolVal)}
                checked={answers[currentQuestion._id!] === boolVal}
                onChange={() =>
                  handleOptionChange(currentQuestion._id!, boolVal)
                }
                className="mb-2"
              />
            ))}

          {currentQuestion.questionType === QuestionType.FILL_IN_BLANK && (
            <Form.Control
              type="text"
              value={answers[currentQuestion._id!] || ""}
              onChange={(e) =>
                handleOptionChange(currentQuestion._id!, e.target.value)
              }
              placeholder="Type your answer here"
            />
          )}
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-between">
        <Button
          variant="secondary"
          onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="d-flex gap-2">
          {currentQuestionIndex < selectedQuiz.questions.length - 1 && (
            <Button variant="secondary" onClick={handleNext}>
              Next
            </Button>
          )}

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
