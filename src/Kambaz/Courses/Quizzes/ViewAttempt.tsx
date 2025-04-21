import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Container, Row, Col, Card } from "react-bootstrap";
import { findQuizAttemptsByUserId } from "./client";
import { QuestionType, Quiz } from "./client";

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
  const [userAttemptsCount, setUserAttemptsCount] = useState<number>(0);

  useEffect(() => {
    const fetchPreviousAttempt = async () => {
      if (!selectedQuiz?._id || !currentUser?._id) return;
      try {
        const allAttempts = await findQuizAttemptsByUserId(currentUser._id);
        const matchingQuizAttempts = allAttempts.filter(
          (attempt: any) => attempt.quiz === selectedQuiz._id
        );

        setUserAttemptsCount(matchingQuizAttempts.length);

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

  const canShowCorrectAnswers =
    selectedQuiz.showCorrectAnswers &&
    (selectedQuiz.attempts === undefined ||
      userAttemptsCount >= selectedQuiz.attempts);

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
        const questionText = question.questionText || "Untitled Question";

        return (
          <Card key={question._id} className="mb-4">
            <Card.Body>
              <Row className="mb-2">
                <Col>
                  <h5>Question {index + 1}</h5>
                </Col>
                <Col className="text-end">{question.points} pts</Col>
              </Row>
              <div dangerouslySetInnerHTML={{ __html: questionText }} />

              {question.questionType === QuestionType.MULTIPLE_CHOICE &&
                question.choices?.map((choice, i) => {
                  const correctChoice =
                    question.choices?.[question.correctAnswer as number];
                  const isCorrect =
                    canShowCorrectAnswers && choice === correctChoice;
                  const isSelected = userAnswer === choice;

                  return (
                    <div
                      key={`${question._id}-choice-${i}`}
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
                    canShowCorrectAnswers && question.correctAnswer === val;
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
                  {canShowCorrectAnswers && (
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
