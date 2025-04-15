import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Button,
  Container,
  Card,
  Row,
  Col,
  ListGroup,
  Alert,
  Spinner,
  Tab,
  Nav
} from 'react-bootstrap';
import * as quizClient from './client';


const QuizEditor: React.FC = () => {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const navigate = useNavigate();
  const isNewQuiz = !qid || qid === 'Create';
  
  const [quiz, setQuiz] = useState<any>({
    title: 'New Quiz',
    description: '',
    courseId: cid,
    published: false,
    quizType: 'Graded Quiz',
    points: 0,
    assignmentGroup: 'Quizzes',
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    attemptCount: 1,
    showCorrectAnswers: true,
    accessCode: '',
    oneQuestionAtTime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: '',
    availableDate: '',
    availableUntil: '',
    questions: []
  });
  
  const [loading, setLoading] = useState(!isNewQuiz);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  
  useEffect(() => {
    const fetchQuiz = async () => {
      if (isNewQuiz) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError('');
        
        const data = await quizClient.fetchQuiz(qid as string);
        setQuiz(data);
      } catch (err: any) {
        console.error('Error fetching quiz:', err);
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [qid, isNewQuiz]);
  
  useEffect(() => {
    if (quiz.questions?.length > 0) {
      const totalPoints = quiz.questions.reduce(
        (sum: number, q: any) => sum + (parseInt(q.points) || 0), 
        0
      );
      setQuiz((prev: any) => ({ ...prev, points: totalPoints }));
    }
  }, [quiz.questions]);
  
  const handleSaveQuiz = async () => {
    try {
      setSaving(true);
      setError('');
      
      if (isNewQuiz) {
        await quizClient.createQuiz(quiz);
      } else {
        await quizClient.updateQuiz(qid as string, quiz);
      }
      
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    } catch (err: any) {
      console.error('Error saving quiz:', err);
      setError(err.message || 'Failed to save quiz');
      setSaving(false);
    }
  };
  
  const handlePreviewQuiz = () => {
    if (isNewQuiz) {
      alert('Please save the quiz before previewing');
      return;
    }
    
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Preview`);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setQuiz({ ...quiz, [name]: target.checked });
    } else {
      setQuiz({ ...quiz, [name]: value });
    }
  };
  
  const addQuestion = () => {
    const newQuestion = {
      id: `q_${Date.now()}`,
      text: 'New Question',
      type: 'multiple-choice',
      points: 1,
      options: [
        { id: `opt_${Date.now()}_1`, text: 'Option 1', isCorrect: false },
        { id: `opt_${Date.now()}_2`, text: 'Option 2', isCorrect: false }
      ]
    };
    
    setQuiz({
      ...quiz,
      questions: [...(quiz.questions || []), newQuestion]
    });
  };
  
  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    
    setQuiz({
      ...quiz,
      questions: updatedQuestions
    });
  };
  
  const removeQuestion = (index: number) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions.splice(index, 1);
    
    setQuiz({
      ...quiz,
      questions: updatedQuestions
    });
  };
  
  const updateOption = (questionIndex: number, optionIndex: number, field: string, value: any) => {
    const updatedQuestions = [...quiz.questions];
    const options = [...updatedQuestions[questionIndex].options];
    
    options[optionIndex] = {
      ...options[optionIndex],
      [field]: value
    };
    
    updatedQuestions[questionIndex].options = options;
    
    setQuiz({
      ...quiz,
      questions: updatedQuestions
    });
  };
  
  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...quiz.questions];
    const options = [...updatedQuestions[questionIndex].options];
    
    options.forEach((opt, idx) => {
      options[idx] = { ...opt, isCorrect: idx === optionIndex };
    });
    
    updatedQuestions[questionIndex].options = options;
    
    setQuiz({
      ...quiz,
      questions: updatedQuestions
    });
  };
  
  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...quiz.questions];
    const options = [...updatedQuestions[questionIndex].options];
    
    options.push({
      id: `opt_${Date.now()}_${options.length + 1}`,
      text: `Option ${options.length + 1}`,
      isCorrect: false
    });
    
    updatedQuestions[questionIndex].options = options;
    
    setQuiz({
      ...quiz,
      questions: updatedQuestions
    });
  };
  
  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...quiz.questions];
    const options = [...updatedQuestions[questionIndex].options];
    
    options.splice(optionIndex, 1);
    
    updatedQuestions[questionIndex].options = options;
    
    setQuiz({
      ...quiz,
      questions: updatedQuestions
    });
  };
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading quiz...</p>
      </div>
    );
  }
  
  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{isNewQuiz ? 'Create New Quiz' : 'Edit Quiz'}</h2>
          <p className="text-muted mb-0">
            {quiz.published ? '✅ Published' : '🚫 Unpublished'}
          </p>
        </div>
        <div>
          <Button
            variant="outline-secondary"
            className="me-2"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
          >
            Cancel
          </Button>
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={handlePreviewQuiz}
            disabled={isNewQuiz}
          >
            Preview
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveQuiz}
            disabled={saving || !quiz.title}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="mb-4">
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Quiz Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={quiz.title}
              onChange={handleInputChange}
              placeholder="Enter quiz title"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={quiz.description || ''}
              onChange={handleInputChange}
              placeholder="Enter quiz description"
            />
          </Form.Group>
        </Card.Body>
      </Card>
      
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'details')}>
        <Card>
          <Card.Header>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="details">Quiz Details</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="questions">Questions</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="details">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Quiz Type</Form.Label>
                      <Form.Select
                        name="quizType"
                        value={quiz.quizType}
                        onChange={handleInputChange}
                      >
                        <option>Graded Quiz</option>
                        <option>Practice Quiz</option>
                        <option>Graded Survey</option>
                        <option>Ungraded Survey</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Assignment Group</Form.Label>
                      <Form.Select
                        name="assignmentGroup"
                        value={quiz.assignmentGroup}
                        onChange={handleInputChange}
                      >
                        <option>Quizzes</option>
                        <option>Exams</option>
                        <option>Assignments</option>
                        <option>Project</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Shuffle Answers</Form.Label>
                      <Form.Select
                        name="shuffleAnswers"
                        value={quiz.shuffleAnswers.toString()}
                        onChange={handleInputChange}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Time Limit (Minutes)</Form.Label>
                      <Form.Control
                        type="number"
                        name="timeLimit"
                        value={quiz.timeLimit}
                        onChange={handleInputChange}
                        min="1"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Multiple Attempts</Form.Label>
                      <Form.Select
                        name="multipleAttempts"
                        value={quiz.multipleAttempts.toString()}
                        onChange={handleInputChange}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </Form.Select>
                    </Form.Group>
                    
                    {quiz.multipleAttempts && (
                      <Form.Group className="mb-3">
                        <Form.Label>Number of Attempts</Form.Label>
                        <Form.Control
                          type="number"
                          name="attemptCount"
                          value={quiz.attemptCount}
                          onChange={handleInputChange}
                          min="1"
                        />
                      </Form.Group>
                    )}
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Show Correct Answers</Form.Label>
                      <Form.Select
                        name="showCorrectAnswers"
                        value={quiz.showCorrectAnswers.toString()}
                        onChange={handleInputChange}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Access Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="accessCode"
                        value={quiz.accessCode || ''}
                        onChange={handleInputChange}
                        placeholder="Leave blank for no access code"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>One Question at a Time</Form.Label>
                      <Form.Select
                        name="oneQuestionAtTime"
                        value={quiz.oneQuestionAtTime.toString()}
                        onChange={handleInputChange}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Webcam Required</Form.Label>
                      <Form.Select
                        name="webcamRequired"
                        value={quiz.webcamRequired.toString()}
                        onChange={handleInputChange}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Lock Questions After Answering</Form.Label>
                      <Form.Select
                        name="lockQuestionsAfterAnswering"
                        value={quiz.lockQuestionsAfterAnswering.toString()}
                        onChange={handleInputChange}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <hr />
                
                <h5>Date Settings</h5>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Due Date</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="dueDate"
                        value={quiz.dueDate || ''}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Available From</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="availableDate"
                        value={quiz.availableDate || ''}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Available Until</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="availableUntil"
                        value={quiz.availableUntil || ''}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab.Pane>
              
              <Tab.Pane eventKey="questions">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Questions ({quiz.questions?.length || 0})</h5>
                  <Button variant="outline-primary" onClick={addQuestion}>
                    + Add Question
                  </Button>
                </div>
                
                {(!quiz.questions || quiz.questions.length === 0) ? (
                  <Alert variant="info">
                    No questions yet. Click the "Add Question" button to create your first question.
                  </Alert>
                ) : (
                  <ListGroup>
                    {quiz.questions.map((question: any, qIndex: number) => (
                      <ListGroup.Item key={question.id || qIndex} className="mb-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6>Question {qIndex + 1}</h6>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeQuestion(qIndex)}
                          >
                            Remove
                          </Button>
                        </div>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Question Text</Form.Label>
                          <Form.Control
                            type="text"
                            value={question.text || ''}
                            onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                            placeholder="Enter question text"
                          />
                        </Form.Group>
                        
                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Question Type</Form.Label>
                              <Form.Select
                                value={question.type || 'multiple-choice'}
                                onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                              >
                                <option value="multiple-choice">Multiple Choice</option>
                                <option value="true-false">True/False</option>
                                <option value="essay">Essay</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Points</Form.Label>
                              <Form.Control
                                type="number"
                                value={question.points || 1}
                                onChange={(e) => updateQuestion(qIndex, 'points', e.target.value)}
                                min="0"
                                step="0.5"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        
                        {(question.type === 'multiple-choice' || question.type === 'true-false') && (
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <Form.Label>Answer Options</Form.Label>
                              {question.type === 'multiple-choice' && (
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => addOption(qIndex)}
                                  disabled={question.options?.length >= 10}
                                >
                                  + Add Option
                                </Button>
                              )}
                            </div>
                            
                            {question.options?.map((option: any, oIndex: number) => (
                              <div key={option.id || oIndex} className="d-flex align-items-center mb-2">
                                <Form.Check
                                  type="radio"
                                  checked={option.isCorrect}
                                  onChange={() => setCorrectOption(qIndex, oIndex)}
                                  label=""
                                  className="me-2"
                                />
                                
                                <Form.Control
                                  type="text"
                                  value={option.text || ''}
                                  onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                                  placeholder={`Option ${oIndex + 1}`}
                                  className="me-2"
                                />
                                
                                {question.type === 'multiple-choice' && question.options.length > 2 && (
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeOption(qIndex, oIndex)}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>
                            ))}
                            
                            <Form.Text muted>
                              Select the radio button next to the correct answer.
                            </Form.Text>
                          </div>
                        )}
                        
                        {question.type === 'essay' && (
                          <Alert variant="info">
                            Essay questions will be manually graded after submission.
                          </Alert>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </Container>
  );
};

export default QuizEditor;