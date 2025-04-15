import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  Table,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Badge
} from 'react-bootstrap';
import * as quizClient from './client';


const QuizResults: React.FC = () => {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<any>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      if (!qid) return;
      
      try {
        setLoading(true);
        setError('');
        
   
        const quizData = await quizClient.fetchQuiz(qid);
        setQuiz(quizData);
        
        
        const attemptsData = await quizClient.fetchQuizAttempts(qid);
        setAttempts(attemptsData);
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching quiz results:', err);
        setError(err.message || 'Failed to load quiz results');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [qid]);
  

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  

  const calculateStats = () => {
    if (!attempts || attempts.length === 0) {
      return {
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        medianScore: 0,
        passRate: 0
      };
    }
    
    const scores = attempts.map(a => a.score);
    
    const sortedScores = [...scores].sort((a, b) => a - b);
    
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    
 
    const mid = Math.floor(sortedScores.length / 2);
    const median = sortedScores.length % 2 === 0
      ? (sortedScores[mid - 1] + sortedScores[mid]) / 2
      : sortedScores[mid];
    
    const passCount = scores.filter(score => score >= 70).length;
    const passRate = (passCount / scores.length) * 100;
    
    return {
      averageScore: Math.round(avg),
      highestScore: highest,
      lowestScore: lowest,
      medianScore: Math.round(median),
      passRate: Math.round(passRate)
    };
  };
  
  const stats = calculateStats();
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading quiz results...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Container>
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
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
  
  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Quiz Results: {quiz.title}</h2>
          <p className="text-muted">
            {quiz.published ? 
              <Badge bg="success" className="me-2">Published</Badge> : 
              <Badge bg="secondary" className="me-2">Unpublished</Badge>
            }
            {quiz.questions?.length || 0} Questions | {quiz.points} Points
          </p>
        </div>
        
        <Button
          variant="outline-primary"
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
        >
          Back to Quizzes
        </Button>
      </div>
      
      <Row className="mb-4">
        <Col md>
          <Card className="mb-3 text-center h-100">
            <Card.Body>
              <h1 className="display-4">{attempts.length}</h1>
              <Card.Text>Total Attempts</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md>
          <Card className="mb-3 text-center h-100">
            <Card.Body>
              <h1 className="display-4">{stats.averageScore}%</h1>
              <Card.Text>Average Score</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md>
          <Card className="mb-3 text-center h-100">
            <Card.Body>
              <h1 className="display-4">{stats.passRate}%</h1>
              <Card.Text>Pass Rate</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md>
          <Card className="mb-3 text-center h-100">
            <Card.Body>
              <h1 className="display-4">{stats.highestScore}%</h1>
              <Card.Text>Highest Score</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md>
          <Card className="mb-3 text-center h-100">
            <Card.Body>
              <h1 className="display-4">{stats.lowestScore}%</h1>
              <Card.Text>Lowest Score</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md>
          <Card className="mb-3 text-center h-100">
            <Card.Body>
              <h1 className="display-4">{stats.medianScore}%</h1>
              <Card.Text>Median Score</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      

      <Card className="mb-4">
        <Card.Header>
          <h4 className="mb-0">Student Attempts</h4>
        </Card.Header>
        <Card.Body>
          {attempts.length === 0 ? (
            <Alert variant="info">
              No attempts have been recorded for this quiz yet.
            </Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Score</th>
                  <th>Date/Time</th>
                  <th>Time Spent</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt, index) => (
                  <tr key={attempt._id}>
                    <td>{index + 1}</td>
                    <td>
                      {attempt.user?.firstName} {attempt.user?.lastName}
                      <div className="text-muted small">{attempt.user?.username}</div>
                    </td>
                    <td>
                      <span 
                        className={attempt.score >= 70 ? 'text-success' : 'text-danger'}
                      >
                        {attempt.score}%
                      </span>
                    </td>
                    <td>{formatDate(attempt.completedAt)}</td>
                    <td>{attempt.timeSpent || 'N/A'}</td>
                    <td>
                      {attempt.score >= 70 ? (
                        <Badge bg="success">Passed</Badge>
                      ) : (
                        <Badge bg="danger">Failed</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header>
          <h4 className="mb-0">Question Analysis</h4>
        </Card.Header>
        <Card.Body>
          {quiz.questions?.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Type</th>
                  <th>Points</th>
                  <th>Correct Answers</th>
                  <th>Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {quiz.questions.map((question: any, index: number) => {
                 
                  const questionSuccessCount = attempts.filter(attempt => {
                    const userAnswer = attempt.answers?.[index];
                    if (!userAnswer) return false;
                    
                    if (question.type === 'essay') return true;
                    
                    const correctOption = question.options.find((opt: any) => opt.isCorrect);
                    return userAnswer === correctOption?.id;
                  }).length;
                  
                  const successRate = attempts.length > 0
                    ? Math.round((questionSuccessCount / attempts.length) * 100)
                    : 0;
                  
                  return (
                    <tr key={question.id || index}>
                      <td>{index + 1}</td>
                      <td>{question.text}</td>
                      <td>{question.type}</td>
                      <td>{question.points}</td>
                      <td>
                        {question.type === 'essay' ? (
                          'Manual grading'
                        ) : (
                          question.options.find((opt: any) => opt.isCorrect)?.text || 'N/A'
                        )}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div style={{ width: '3rem' }} className="me-2">
                            {successRate}%
                          </div>
                          <div className="flex-grow-1" style={{ height: '0.5rem' }}>
                            <div 
                              className={`bg-${successRate >= 70 ? 'success' : 'danger'}`}
                              style={{ width: `${successRate}%`, height: '100%', borderRadius: '0.25rem' }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">
              No questions available for analysis.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuizResults;