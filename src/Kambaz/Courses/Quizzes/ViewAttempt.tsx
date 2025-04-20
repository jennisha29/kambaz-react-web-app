import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Container, Row, Col, Card } from "react-bootstrap";
import { findQuizAttemptsByUserId } from "./client";

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
}

interface Answer {
  questionId: string;
  answer: string | boolean | string[] | number;
  correct: boolean;
}

export default function ViewAttempt() {
  const { currentUser } = useSelector(
    (state: any) => state.accountReducer || {}
  );
  const selectedQuiz = useSelector(
    (state: any) => state.quizzesReducer?.selectedQuiz as Quiz
  );

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchPreviousAttempt = async () => {
      if (!selectedQuiz?._id || !currentUser?._id) return;
      try {
        const allAttempts = await findQuizAttemptsByUserId(currentUser._id);
        const matchingQuizAttempts = allAttempts.filter(
          (attempt: any) => attempt.quiz === selectedQuiz._id
        );

        if (matchingQuizAttempts.length > 0) {
          const latestAttempt = matchingQuizAttempts.sort(
            (a: any, b: any) =>
              new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
          )[0];
          setScore(latestAttempt.score);
          const convertedAnswers: Record<string, any> = {};
          latestAttempt.answers.forEach((ans: Answer) => {
            convertedAnswers[ans.questionId] = ans.answer;
          });
          setAnswers(convertedAnswers);
        }
      } catch (err) {
        console.error("Failed to fetch previous quiz attempts:", err);
      }
    };

    fetchPreviousAttempt();
  }, [selectedQuiz?._id, currentUser?._id]);

  if (!selectedQuiz) return <Container>Loading Quiz...</Container>;
  if (score === null) return <Container>No attempt found.</Container>;

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
                  const isCorrect = option.isCorrect;
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
                  const isCorrect = question.correctAnswer === val;
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
                  <p>
                    <strong>Correct answer(s):</strong>{" "}
                    {(question.correctAnswer as string[]).join(", ")}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );
}
