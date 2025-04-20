import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { createQuizAttempt } from "./client";

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
  _id?: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number;
  showCorrectAnswers?: boolean;
}

interface Answer {
  questionId: string;
  answer: string | boolean | string[] | number;
  correct: boolean;
}

export default function QuizAttempt() {
  const { currentUser } = useSelector(
    (state: any) => state.accountReducer || {}
  );
  const selectedQuiz = useSelector(
    (state: any) => state.quizzesReducer?.selectedQuiz as Quiz
  );

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<Answer[] | null>(
    null
  );
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (selectedQuiz?.timeLimit) {
      const totalSeconds = selectedQuiz.timeLimit * 60;
      setTimeLeft(totalSeconds);
    }
  }, [selectedQuiz?.timeLimit]);

  useEffect(() => {
    if (timeLeft === null || score !== null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(
      () => setTimeLeft((prev) => (prev ? prev - 1 : 0)),
      1000
    );
    return () => clearInterval(timer);
  }, [timeLeft, score]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleOptionChange = (questionId: string, value: any) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    let totalScore = 0;
    const answerArray: Answer[] = [];

    selectedQuiz.questions.forEach((question) => {
      const answer = answers[question._id];
      let isCorrect = false;

      if (question.questionType === "Multiple Choice") {
        const correctOption = question.options?.find((opt) => opt.isCorrect);
        isCorrect = answer === correctOption?.id;
      } else if (question.questionType === "True/False") {
        isCorrect = answer === question.correctAnswer;
      } else if (question.questionType === "Fill in the Blank") {
        const correctAnswers = (question.correctAnswer as string[]).map((a) =>
          a.toLowerCase()
        );
        isCorrect = correctAnswers.includes(answer?.toLowerCase?.());
      }

      if (isCorrect) {
        totalScore += question.points;
      }

      answerArray.push({
        questionId: question._id,
        answer,
        correct: isCorrect,
      });
    });

    setScore(totalScore);
    setSubmittedAnswers(answerArray);

    try {
      await createQuizAttempt({
        quiz: selectedQuiz._id!,
        user: currentUser._id,
        startTime: new Date().toISOString(),
        score: totalScore,
        answers: answerArray,
      });
    } catch (err) {
      console.error("Failed to submit quiz attempt:", err);
    }
  };

  if (!selectedQuiz) return <Container>Loading Quiz...</Container>;

  if (score !== null && submittedAnswers) {
    return (
      <Container className="py-4">
        <Row className="mb-3">
          <Col>
            <h2>{selectedQuiz.title}</h2>
          </Col>
          <Col className="text-end text-success">
            <h5>
              Score: {score} /{" "}
              {selectedQuiz.questions.reduce((sum, q) => sum + q.points, 0)}
            </h5>
          </Col>
        </Row>

        {selectedQuiz.questions.map((question, index) => {
          const userAnswer = answers[question._id];
          const questionText =
            question.text || question.questionText || "Untitled Question";

          return (
            <Card key={question._id} className="mb-4">
              <Card.Body>
                <Row className="mb-2">
                  <Col>
                    <h5>Question {index + 1}</h5>
                  </Col>
                  <Col className="text-end">{question.points} pts</Col>
                </Row>
                <p>{questionText}</p>

                {question.questionType === "Multiple Choice" &&
                  question.options?.map((option) => {
                    const isCorrect =
                      selectedQuiz.showCorrectAnswers && option.isCorrect;
                    const isSelected = userAnswer === option.id;
                    return (
                      <div
                        key={option.id}
                        className={`p-2 mb-2 rounded border ${
                          isCorrect
                            ? "border-success"
                            : isSelected
                            ? "border-danger"
                            : "border"
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

                {question.questionType === "True/False" &&
                  [true, false].map((val) => {
                    const isCorrect =
                      selectedQuiz.showCorrectAnswers &&
                      question.correctAnswer === val;
                    const isSelected = userAnswer === val;
                    return (
                      <div
                        key={String(val)}
                        className={`p-2 mb-2 rounded border ${
                          isCorrect
                            ? "border-success"
                            : isSelected
                            ? "border-danger"
                            : "border"
                        }`}
                      >
                        <Form.Check
                          type="radio"
                          label={
                            <span>
                              {String(val)}{" "}
                              {isCorrect && <strong>(Correct)</strong>}
                            </span>
                          }
                          checked={isSelected}
                          readOnly
                        />
                      </div>
                    );
                  })}

                {question.questionType === "Fill in the Blank" && (
                  <div>
                    <p>
                      <strong>Your answer:</strong> {userAnswer}
                    </p>
                    {selectedQuiz.showCorrectAnswers && (
                      <p>
                        <strong>Correct answer(s):</strong>{" "}
                        {(question.correctAnswer as string[]).join(", ")}
                      </p>
                    )}
                  </div>
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
      <Row className="mb-3">
        <Col>
          <h2>{selectedQuiz.title}</h2>
        </Col>
        {timeLeft !== null && score === null && (
          <Col className="text-end">
            <h5 className="text-danger">Time Left: {formatTime(timeLeft)}</h5>
          </Col>
        )}
      </Row>
      <p>{selectedQuiz.description}</p>

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

        {currentQuestionIndex === selectedQuiz.questions.length - 1 && (
          <Button variant="danger" onClick={handleSubmit}>
            Submit Quiz
          </Button>
        )}
      </div>
    </Container>
  );
}
