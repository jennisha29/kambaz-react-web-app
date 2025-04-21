import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { createQuizAttempt } from "./client";
import { QuestionType, Quiz } from "./client";

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
      setTimeLeft(selectedQuiz.timeLimit * 60);
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
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
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
      const answer = answers[question._id!];
      let isCorrect = false;

      if (question.questionType === QuestionType.MULTIPLE_CHOICE) {
        isCorrect =
          answer === question.choices?.[question.correctAnswer as number];
      } else if (question.questionType === QuestionType.TRUE_FALSE) {
        isCorrect = answer === question.correctAnswer;
      } else if (question.questionType === QuestionType.FILL_IN_BLANK) {
        const correctAnswers = (question.correctAnswer as string[]).map((a) =>
          a.toLowerCase()
        );
        isCorrect = correctAnswers.includes(answer?.toLowerCase?.());
      }

      if (isCorrect) {
        totalScore += question.points;
      }

      answerArray.push({
        questionId: question._id!,
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
          const userAnswer = answers[question._id!];
          return (
            <Card key={question._id} className="mb-4">
              <Card.Body>
                <Row className="mb-2">
                  <Col>
                    <h5>Question {index + 1}</h5>
                  </Col>
                  <Col className="text-end">{question.points} pts</Col>
                </Row>
                <div
                  dangerouslySetInnerHTML={{ __html: question.questionText }}
                />

                {question.questionType === QuestionType.MULTIPLE_CHOICE &&
                  question.choices?.map((choice, idx) => {
                    const correctChoice =
                      question.choices?.[question.correctAnswer as number];
                    const isCorrect =
                      selectedQuiz.showCorrectAnswers &&
                      choice === correctChoice;
                    const isSelected = userAnswer === choice;

                    return (
                      <div
                        key={`${question._id}-choice-${idx}`}
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
                              {choice} {isCorrect && <strong>(Correct)</strong>}
                            </span>
                          }
                          checked={isSelected}
                          readOnly
                        />
                      </div>
                    );
                  })}

                {question.questionType === QuestionType.TRUE_FALSE &&
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

                {question.questionType === QuestionType.FILL_IN_BLANK && (
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
            currentQuestion.choices?.map((choice, idx) => (
              <Form.Check
                key={`${currentQuestion._id}-choice-${idx}`}
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
        </div>
      </div>
    </Container>
  );
}
