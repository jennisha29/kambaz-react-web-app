import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Container,
  Card,
  Button,
  Form,
  ProgressBar,
  Alert,
  Spinner,
  Modal
} from 'react-bootstrap';
import * as quizClient from './client';

// Quiz Taker component for students to take quizzes or for faculty to preview
const QuizTaker: React.FC = () => {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const navigate = useNavigate();
  
  // States
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Determine if this is preview mode
  const isPreview = window.location.pathname.includes('/Preview');
  
  // Fetch quiz on component mount
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!qid) return;
      
      try {
        setLoading(true);
        setError('');
        
        const data = await quizClient.fetchQuiz(qid);
        
        // Check if quiz is available (unless in preview mode)
        if (!isPreview) {
          const now = new Date();
          const availableDate = data.availableDate ? new Date(data.availableDate) : null;
          const availableUntil = data.availableUntil ? new Date(data.availableUntil) : null;
          
          if (availableDate && now < availableDate) {
            setError(`This quiz is not available until ${availableDate.toLocaleString()}`);
            setLoading(false);
            return;
          }
          
          if (availableUntil && now > availableUntil) {
            setError('This quiz is no longer available.');
            setLoading(false);
            return;
          }
        }
        
        setQuiz(data);
        
        // Initialize answers array
        if (data.questions && data.questions.length > 0) {
          setAnswers(new Array(data.questions.length).fill(null));
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching quiz:', err);
        setError(err.message || 'Failed to load quiz');
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [qid, isPreview]);
  
  // Timer for quiz
  useEffect(() => {
    if (!quizStarted || !quiz || isPreview || !quiz.timeLimit) return;
    
    // Set initial time
    setTimeLeft(quiz.timeLimit * 60);
    
    // Start timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          // Auto-submit quiz when time runs out
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Clean up timer
    return () => clearInterval(timer);
  }, [quizStarted, quiz]);
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };
  
  const handleAnswer = (optionId: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionId;
    setAnswers(newAnswers);
  };
  
  const handleEssayAnswer = (text: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = text;
    setAnswers(newAnswers);
  };
  
  const goToNextQuestion = () => {
    if (currentQuestion < (quiz.questions?.length - 1)) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleFinishClick = () => {
    // Check if all questions are answered
    const unansweredQuestions = answers.filter(a => a === null).length;
    
    if (unansweredQuestions > 0) {
      if (!window.confirm(`You have ${unansweredQuestions} unanswered question(s). Are you sure you want to submit?`)) {
        return;
      }
    } else {
      setShowSubmitModal(true);
    }
  };
  
  const handleSubmitQuiz = async () => {
    // In preview mode, just return to quiz list
    if (isPreview) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      return;
    }
    
    try {
      setSubmitting(true);
      setShowSubmitModal(false);
      
      // Calculate score
      let correctCount = 0;
      let totalPoints = 0;
      
      quiz.questions.forEach((question: any, index: number) => {
        const userAnswer = answers[index];
        
        // Skip essay questions for auto-grading
        if (question.type === 'essay') return;
        
        const questionPoints = parseInt(question.points) || 0;
        totalPoints += questionPoints;
        
        // Find the correct option
        const correctOption = question.options.find((opt: any) => opt.isCorrect);
        
        if (userAnswer === correctOption?.id) {
          correctCount += questionPoints;
        }
      });
      
      const calculatedScore = totalPoints > 0 ? Math.round((correctCount / totalPoints) * 100) : 0;
      setScore(calculatedScore);
      
      // Submit the attempt to the server
      await quizClient.submitQuizAttempt(qid as string, {
        answers,
        score: calculatedScore,
        completedAt: new Date().toISOString()
      });
      
      setQuizCompleted(true);
    } catch (err: any) {
      console.error('Error submitting quiz:', err);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading quiz...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Container>
        <Alert variant="danger">
          <Alert.Heading>Unable to Load Quiz</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button 
              variant="outline-danger" 
              onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
            >
              Return to Quizzes
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }
  
  if (!quiz) {
    return (
      <Container>
        <Alert variant="warning">Quiz not found.</Alert>
      </Container>
    );
  }
  
  // Quiz completion screen
  if (quizCompleted) {
    return (
      <Container className="mt-4">
        <Card className="text-center shadow">
          <Card.Header as="h4" className={`bg-${(score || 0) >= 70 ? "success" : "warning"} text-white`}>Quiz Completed!</Card.Header>
          <Card.Body className="py-5">
            <div className="mb-4">
              <h1 className="display-1 mb-0">{score || 0}%</h1>
              <p className="text-muted">Your Score</p>
            </div>
            
            <ProgressBar 
              variant={(score ?? 0) >= 70 ? "success" : "warning"}
              now={score || 0} 
              label={`${score}%`}
              className="mb-4"
              style={{ height: '2rem' }}
            />
            
            <div className="d-grid">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
              >
                Return to Quizzes
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }
  
  // Quiz intro screen
  if (!quizStarted) {
    return (
      <Container className="mt-4">
        <Card className="shadow">
          <Card.Header as="h4">{quiz.title}</Card.Header>
          <Card.Body>
            <div className="mb-4">
              {quiz.description && (
                <Card.Text>{quiz.description}</Card.Text>
              )}
              
              <hr />
              
              <div className="d-flex flex-wrap">
                <div className="me-4 mb-3">
                  <strong>Time Limit:</strong> {quiz.timeLimit} minutes
                </div>
                <div className="me-4 mb-3">
                  <strong>Points:</strong> {quiz.points}
                </div>
                <div className="me-4 mb-3">
                  <strong>Questions:</strong> {quiz.questions.length}
                </div>
                {quiz.accessCode && (
                  <div className="me-4 mb-3">
                    <strong>Access Code Required</strong>
                  </div>
                )}
                {quiz.multipleAttempts && (
                  <div className="me-4 mb-3">
                    <strong>Attempts Allowed:</strong> {quiz.attemptCount}
                  </div>
                )}
              </div>
            </div>
            
            {isPreview && (
              <Alert variant="info">
                <strong>Preview Mode:</strong> You are previewing this quiz as an instructor. Your answers won't be recorded.
              </Alert>
            )}
            
            {quiz.accessCode && !isPreview && (
              <Form.Group className="mb-3">
                <Form.Label>Enter Access Code to begin:</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Access Code" 
                  className="mb-3"
                />
              </Form.Group>
            )}
            
            <div className="d-flex justify-content-between">
              <Button
                variant="outline-secondary"
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
              >
                Cancel
              </Button>
              
              <Button
                variant="primary"
                onClick={handleStartQuiz}
              >
                {isPreview ? 'Start Preview' : 'Start Quiz'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }
  
  // Get current question
  const question = quiz.questions[currentQuestion];
  
  // Quiz taking screen
  return (
    <Container className="mt-4">
      {/* Quiz header info */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3>{quiz.title}</h3>
          <p className="text-muted mb-0">
            {isPreview ? 'Preview Mode' : 'Quiz in Progress'}
          </p>
        </div>
        
        {/* Timer */}
        {timeLeft !== null && (
          <div className="text-center">
            <div className={`rounded-circle border border-2 d-flex align-items-center justify-content-center ${timeLeft < 60 ? 'border-danger text-danger' : 'border-primary'}`} style={{ width: '60px', height: '60px' }}>
              <span className="fw-bold">{formatTime(timeLeft)}</span>
            </div>
            <small className="text-muted">Time Left</small>
          </div>
        )}
      </div>
      
      {/* Progress bar */}
      <ProgressBar 
        now={(currentQuestion + 1) / quiz.questions.length * 100} 
        label={`Question ${currentQuestion + 1} of ${quiz.questions.length}`}
        className="mb-3"
      />
      
      {/* Question card */}
      <Card className="shadow mb-4">
        <Card.Header className="d-flex justify-content-between">
          <span>Question {currentQuestion + 1}</span>
          <span>Points: {question.points || 1}</span>
        </Card.Header>
        
        <Card.Body>
          <Card.Title className="mb-4">{question.text}</Card.Title>
          
          {/* Multiple choice / True-False questions */}
          {(question.type === 'multiple-choice' || question.type === 'true-false') && (
            <Form>
              {question.options.map((option: any) => (
                <Form.Check
                  key={option.id}
                  type="radio"
                  id={`option-${option.id}`}
                  name={`question-${question.id}`}
                  label={option.text}
                  checked={answers[currentQuestion] === option.id}
                  onChange={() => handleAnswer(option.id)}
                  className="mb-3"
                />
              ))}
            </Form>
          )}
          
          {/* Essay questions */}
          {question.type === 'essay' && (
            <Form.Group>
              <Form.Label>Your Answer:</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleEssayAnswer(e.target.value)}
                placeholder="Enter your answer here..."
              />
            </Form.Group>
          )}
        </Card.Body>
      </Card>
      
      {/* Navigation buttons */}
      <div className="d-flex justify-content-between">
        <Button
          variant="outline-secondary"
          onClick={goToPreviousQuestion}
          disabled={currentQuestion === 0}
        >
          Previous Question
        </Button>
        
        {currentQuestion < quiz.questions.length - 1 ? (
          <Button
            variant="primary"
            onClick={goToNextQuestion}
            disabled={answers[currentQuestion] === null}
          >
            Next Question
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={handleFinishClick}
          >
            Finish Quiz
          </Button>
        )}
      </div>
      
      {/* Submit confirmation modal */}
      <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to submit your quiz?</p>
          <p className="mb-0 text-muted">You cannot make changes after submission.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmitQuiz}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default QuizTaker;