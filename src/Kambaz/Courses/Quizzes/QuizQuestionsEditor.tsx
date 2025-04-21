import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Nav } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addQuestion, updateQuestion, deleteQuestion, updateQuiz } from "./reducer";
import { QuestionType, QuizQuestion } from "./client";
import * as client from "./client";
import { v4 as uuidv4 } from "uuid";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuizQuestionsEditor: React.FC = () => {
  const { qid, cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const selectedQuiz = useSelector((state: any) => state.quizzesReducer?.selectedQuiz);
  
  const { currentUser } = useSelector((state: any) => state.accountReducer || {});
  const isFaculty = currentUser && currentUser.role === "FACULTY";
  
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [saveInProgress, setSaveInProgress] = useState(false);
  
  const createEmptyQuestion = (): QuizQuestion => {
    const questionNumber = questions.length + 1;
    return {
      _id: uuidv4(),
      title: `Question ${questionNumber}`,
      questionType: QuestionType.MULTIPLE_CHOICE,
      points: 10,
      questionText: "",
      choices: ["", "", "", ""],
      correctAnswer: 0
    };
  };
  
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!qid || qid === "new") {
        setQuestions([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        if (!selectedQuiz || selectedQuiz._id !== qid) {
          console.log("Fetching quiz from server...");
          const fetchedQuiz = await client.findQuizById(qid);
          if (fetchedQuiz) {
            console.log("Fetched quiz:", fetchedQuiz);
            setQuestions(fetchedQuiz.questions || []);
            calculateTotalPoints(fetchedQuiz.questions || []);
          }
        } else {
          console.log("Using quiz from Redux store:", selectedQuiz);
          setQuestions(selectedQuiz.questions || []);
          calculateTotalPoints(selectedQuiz.questions || []);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [qid, selectedQuiz, dispatch]);
  
  const calculateTotalPoints = (questionsList: QuizQuestion[]) => {
    const total = questionsList.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
    setTotalPoints(total);
  };
  
  const handleAddQuestion = () => {
    if (editingQuestion) {
      setEditingQuestion(null);
    }
    
    const newQuestion = createEmptyQuestion();
    setQuestions(prev => [...prev, newQuestion]);
    setEditingQuestion(newQuestion);
    setShowNewQuestion(true);
    
    setTotalPoints(prev => prev + Number(newQuestion.points));
  };
  
  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion({...question});
    setShowNewQuestion(false);
  };
  
  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        setSaveInProgress(true);
        
        if (qid && qid !== "new") {
          console.log("Deleting question from server:", questionId);
          await client.deleteQuizQuestion(qid, questionId);
        }
        
        const questionToDelete = questions.find(q => q._id === questionId);
      
        const updatedQuestions = questions.filter(q => q._id !== questionId);
      
        const renumberedQuestions = updatedQuestions.map((q, index) => ({
          ...q,
          title: `Question ${index + 1}`
        }));
        
        setQuestions(renumberedQuestions);
      
        if (questionToDelete) {
          setTotalPoints(prev => prev - Number(questionToDelete.points || 0));
        }
        
        dispatch(deleteQuestion(questionId));
        
        if (editingQuestion && editingQuestion._id === questionId) {
          setEditingQuestion(null);
          setShowNewQuestion(false);
        }
        
        if (selectedQuiz) {
          const updatedQuiz = {
            ...selectedQuiz,
            questions: renumberedQuestions,
            points: renumberedQuestions.reduce((sum, q) => sum + (Number(q.points) || 0), 0)
          };
          
          dispatch(updateQuiz(updatedQuiz));
        }
        
        setSaveInProgress(false);
        alert("Question deleted successfully!");
      } catch (error) {
        console.error("Error deleting question:", error);
        alert("Error deleting question. Please try again.");
        setSaveInProgress(false);
      }
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;
    
    try {
      setSaveInProgress(true);
      console.log("Saving question:", editingQuestion);
      
      let updatedQuestions = [...questions];
      const index = updatedQuestions.findIndex(q => q._id === editingQuestion._id);
      
      if (qid && qid !== "new") {
        if (index !== -1) {
          console.log("Updating existing question on server");
          await client.updateQuizQuestion(qid, editingQuestion._id as string, editingQuestion);
          dispatch(updateQuestion(editingQuestion));
        } else {
          console.log("Adding new question to server");
          await client.addQuestionToQuiz(qid, editingQuestion);
          dispatch(addQuestion(editingQuestion));
        }
        
        console.log("Fetching updated quiz from server");
        const updatedQuiz = await client.findQuizById(qid);
        
        if (updatedQuiz) {
          setQuestions(updatedQuiz.questions || []);
          calculateTotalPoints(updatedQuiz.questions || []);
          dispatch(updateQuiz(updatedQuiz));
          
          setEditingQuestion(null);
          setShowNewQuestion(false);
          setSaveInProgress(false);
          
          alert("Question saved successfully!");
          return;
        }
      }
      
      if (index !== -1) {
        updatedQuestions[index] = {...editingQuestion};
      } else {
        updatedQuestions.push({...editingQuestion});
      }
      
      updatedQuestions = updatedQuestions.map((q, idx) => ({
        ...q,
        title: q.title.startsWith("Question") ? `Question ${idx + 1}` : q.title
      }));
      
      setQuestions(updatedQuestions);
      calculateTotalPoints(updatedQuestions);
      
      setEditingQuestion(null);
      setShowNewQuestion(false);
      setSaveInProgress(false);
      
      alert("Question saved successfully!");
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Error updating question. Please try again.");
      setSaveInProgress(false);
    }
  };

  const handleCancelEdit = () => {
    if (editingQuestion && showNewQuestion) {
      setQuestions(prev => prev.filter(q => q._id !== editingQuestion._id));
      setTotalPoints(prev => prev - Number(editingQuestion.points || 0));
    }
    
    setEditingQuestion(null);
    setShowNewQuestion(false);
  };
  
  
  const handleQuestionChange = (field: string, value: any) => {
    if (!editingQuestion) return;
    
    setEditingQuestion(prev => {
      if (!prev) return prev;
      
      if (field === "questionType") {
        let correctAnswer: any;
        
        switch (value) {
          case QuestionType.MULTIPLE_CHOICE:
            correctAnswer = 0;
            return {
              ...prev,
              [field]: value,
              choices: ["", "", "", ""],
              correctAnswer
            };
          case QuestionType.TRUE_FALSE:
            correctAnswer = true;
            return {
              ...prev,
              [field]: value,
              choices: undefined,
              correctAnswer
            };
          case QuestionType.FILL_IN_BLANK:
            correctAnswer = [""];
            return {
              ...prev,
              [field]: value,
              choices: undefined,
              correctAnswer
            };
          default:
            return {
              ...prev,
              [field]: value
            };
        }
      }

      if (field === "points") {
        const existingQuestionIndex = questions.findIndex(q => q._id === prev._id);
        
        if (existingQuestionIndex !== -1) {
          const oldPoints = Number(questions[existingQuestionIndex].points || 0);
          const newPoints = Number(value || 0);
          setTotalPoints(currentTotal => currentTotal - oldPoints + newPoints);
        } else {
          setTotalPoints(currentTotal => currentTotal + Number(value || 0));
        }
        
        const updatedQuestions = [...questions];
        const index = updatedQuestions.findIndex(q => q._id === prev._id);
        if (index !== -1) {
          updatedQuestions[index] = { ...updatedQuestions[index], points: value };
          setQuestions(updatedQuestions);
        }
      }
      
      return {
        ...prev,
        [field]: value
      };
    });
  };
  
  const handleChoiceChange = (index: number, value: string) => {
    if (!editingQuestion || !editingQuestion.choices) return;
    
    const updatedChoices = [...editingQuestion.choices];
    updatedChoices[index] = value;
    
    setEditingQuestion({
      ...editingQuestion,
      choices: updatedChoices
    });
  };
  
  const handleAddChoice = () => {
    if (!editingQuestion || !editingQuestion.choices) return;
    
    setEditingQuestion({
      ...editingQuestion,
      choices: [...editingQuestion.choices, ""]
    });
  };

  const handleRemoveChoice = (index: number) => {
    if (!editingQuestion || !editingQuestion.choices) return;
    
    if (editingQuestion.choices.length <= 2) {
      alert("Multiple choice questions must have at least 2 choices.");
      return;
    }
    
    const updatedChoices = editingQuestion.choices.filter((_, i) => i !== index);
    
    let correctAnswer = editingQuestion.correctAnswer;
    if (typeof correctAnswer === 'number') {
      if (correctAnswer === index) {
        correctAnswer = 0;
      } else if (correctAnswer > index) {
        correctAnswer--;
      }
    }
    
    setEditingQuestion({
      ...editingQuestion,
      choices: updatedChoices,
      correctAnswer
    });
  };
  
  const handleEditAnswer = (index: number) => {
    console.log(`Editing answer at index ${index}`);
    if (document.querySelectorAll('.answer-field')[index]) {
      (document.querySelectorAll('.answer-field')[index] as HTMLElement).focus();
    }
  };
  
  const handleAddBlankAnswer = () => {
    if (!editingQuestion) return;
    
    const currentAnswers = Array.isArray(editingQuestion.correctAnswer) 
      ? editingQuestion.correctAnswer 
      : [];
    
    setEditingQuestion({
      ...editingQuestion,
      correctAnswer: [...currentAnswers, ""]
    });
  };

  const handleRemoveBlankAnswer = (index: number) => {
    if (!editingQuestion || !Array.isArray(editingQuestion.correctAnswer)) return;
    
    if (editingQuestion.correctAnswer.length <= 1) {
      alert("Fill in the blank questions must have at least one possible answer.");
      return;
    }
    
    setEditingQuestion({
      ...editingQuestion,
      correctAnswer: editingQuestion.correctAnswer.filter((_, i) => i !== index)
    });
  };
  
  const handleBlankAnswerChange = (index: number, value: string) => {
    if (!editingQuestion || !Array.isArray(editingQuestion.correctAnswer)) return;
    
    const updatedAnswers = [...editingQuestion.correctAnswer];
    updatedAnswers[index] = value;
    
    setEditingQuestion({
      ...editingQuestion,
      correctAnswer: updatedAnswers
    });
  };
  
  const renderMultipleChoiceEditor = () => {
    if (!editingQuestion || !editingQuestion.choices) return null;
    
    return (
      <div className="border rounded mb-4">
        <div className="d-flex p-3 border-bottom align-items-center">
          <div className="flex-grow-1">
            <Form.Control
              type="text"
              value={editingQuestion.title}
              onChange={(e) => handleQuestionChange("title", e.target.value)}
              className="border"
              placeholder="Question Name"
            />
          </div>
          <div className="ms-3 me-3" style={{ width: "200px" }}>
            <Form.Select
              value={editingQuestion.questionType}
              onChange={(e) => handleQuestionChange("questionType", e.target.value)}
            >
              <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
              <option value={QuestionType.TRUE_FALSE}>True/False</option>
              <option value={QuestionType.FILL_IN_BLANK}>Fill in the Blank</option>
            </Form.Select>
          </div>
          <div className="d-flex align-items-center">
            <span className="me-2">pts:</span>
            <Form.Control
              type="number"
              min="0"
              value={editingQuestion.points}
              onChange={(e) => handleQuestionChange("points", parseInt(e.target.value) || 0)}
              style={{ width: "60px" }}
              className="text-center"
            />
          </div>
        </div>
        
        <div className="p-3">
          <p className="text-muted mb-3">Enter your question and multiple answers, then select the one correct answer.</p>
          
          <Form.Group className="mb-3">
            <Form.Label><strong>Question:</strong></Form.Label>
            <ReactQuill
            value={editingQuestion.questionText}
            onChange={(value) => handleQuestionChange("questionText", value)}
            style={{ height: "120px", borderRadius: "5px", marginBottom: "2rem" }}
            />
          </Form.Group>
          <br></br>
          <Form.Group className="mt-4">
            <Form.Label>Answers:</Form.Label>
            
            <div className="mb-3">
              {editingQuestion.choices?.map((choice, index) => (
                <div key={index} className="d-flex mb-2 align-items-center">
                  <div className="d-flex align-items-center" style={{ width: "auto", marginRight: "10px" }}>
                    <div>Possible Answer</div>
                  </div>
                  
                  <Form.Control
                    type="text"
                    value={choice}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                    onClick={() => handleQuestionChange("correctAnswer", index)}
                    className="flex-grow-1 answer-field"
                    style={{ maxWidth: "400px" }}
                    placeholder={`Answer ${index + 1}`}
                  />
                  
                  <div className="ms-2">
                    <button 
                      className="btn btn-link p-0 me-2" 
                      onClick={() => handleEditAnswer(index)}
                      style={{ color: "#6c757d" }}
                    >
                      <FaPencilAlt />
                    </button>
                    <button 
                      className="btn btn-link p-0" 
                      onClick={() => handleRemoveChoice(index)}
                      style={{ color: "#6c757d" }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-end mt-3">
              <Button 
                variant="link" 
                className="text-danger"
                onClick={handleAddChoice}
              >
                + Add Another Answer
              </Button>
            </div>
          
            <div className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label><strong>Correct Answer:</strong></Form.Label>
                <Form.Select
                  value={
                    typeof editingQuestion.correctAnswer === "number" 
                      ? editingQuestion.correctAnswer
                      : "" 
                  }
                  onChange={(e) => {
                    const selectedIndex = parseInt(e.target.value);
                    handleQuestionChange("correctAnswer", selectedIndex);
                  }}
                  style={{ maxWidth: "400px" }}
                >
                  <option value="" disabled hidden>
                    Select Answer
                  </option>
                  {editingQuestion.choices.map((choice, index) => (
                    <option key={index} value={index}>
                      {choice ? choice : `Answer ${index + 1}`}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          </Form.Group>
          <div className="d-flex justify-content-left mt-4">
            <Button 
              variant="light" 
              className="me-2 border"
              onClick={handleCancelEdit}
              disabled={saveInProgress}
            >
              Cancel
            </Button>
            <Button 
              variant="danger"
              onClick={handleUpdateQuestion}
              disabled={saveInProgress}
            >
              {saveInProgress ? "Saving..." : "Save Question"}
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderTrueFalseEditor = () => {
    if (!editingQuestion) return null;
    
    return (
      <div className="border rounded mb-4">
        <div className="d-flex p-3 border-bottom align-items-center">
          <div className="flex-grow-1">
            <Form.Control
              type="text"
              value={editingQuestion.title}
              onChange={(e) => handleQuestionChange("title", e.target.value)}
              className="border"
              placeholder="Question Name"
            />
          </div>
          <div className="ms-3 me-3" style={{ width: "200px" }}>
            <Form.Select
              value={editingQuestion.questionType}
              onChange={(e) => handleQuestionChange("questionType", e.target.value)}
            >
              <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
              <option value={QuestionType.TRUE_FALSE}>True/False</option>
              <option value={QuestionType.FILL_IN_BLANK}>Fill in the Blank</option>
            </Form.Select>
          </div>
          <div className="d-flex align-items-center">
            <span className="me-2">pts:</span>
            <Form.Control
              type="number"
              min="0"
              value={editingQuestion.points}
              onChange={(e) => handleQuestionChange("points", parseInt(e.target.value) || 0)}
              style={{ width: "60px" }}
              className="text-center"
            />
          </div>
        </div>
        
        <div className="p-3">
          <p className="text-muted mb-3">Enter your question text, then select if True or False is the correct answer.</p>
          
          <Form.Group className="mb-3">
            <Form.Label><strong>Question:</strong></Form.Label>
            <ReactQuill
              value={editingQuestion.questionText}
              onChange={(value) => handleQuestionChange("questionText", value)}
              style={{ height: "120px", borderRadius: "5px", marginBottom: "2rem" }}
              />
          </Form.Group>
          <br></br>
          <Form.Group className="mt-4">
            <Form.Label>Answer:</Form.Label>
            <div className="d-flex mb-2 align-items-center">
              <div className="d-flex align-items-center">
                {editingQuestion.correctAnswer === true ? (
                  <div className="me-2" style={{ color: "green" }}>➜</div>
                ) : (
                  <div className="me-2 opacity-0">➜</div>
                )}
                <Form.Check
                  type="radio"
                  label="True"
                  id="true-answer"
                  name="trueFalseAnswer"
                  checked={editingQuestion.correctAnswer === true}
                  onChange={() => handleQuestionChange("correctAnswer", true)}
                  className="me-4"
                />
              </div>
              <div className="d-flex align-items-center">
                {editingQuestion.correctAnswer === false ? (
                  <div className="me-2" style={{ color: "green" }}>➜</div>
                ) : (
                  <div className="me-2 opacity-0">➜</div>
                )}
                <Form.Check
                  type="radio"
                  label="False"
                  id="false-answer"
                  name="trueFalseAnswer"
                  checked={editingQuestion.correctAnswer === false}
                  onChange={() => handleQuestionChange("correctAnswer", false)}
                />
              </div>
            </div>
          </Form.Group>
          <br></br>
          
          <div className="d-flex justify-content-left mt-4">
            <Button 
              variant="light" 
              className="me-2 border"
              onClick={handleCancelEdit}
              disabled={saveInProgress}
            >
              Cancel
            </Button>
            <Button 
              variant="danger"
              onClick={handleUpdateQuestion}
              disabled={saveInProgress}
            >
              {saveInProgress ? "Saving..." : "Save Question"}
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderFillInBlankEditor = () => {
    if (!editingQuestion) return null;
    
    const blankAnswers = Array.isArray(editingQuestion.correctAnswer) 
      ? editingQuestion.correctAnswer 
      : [""];
    
    return (
      <div className="border rounded mb-4">
        <div className="d-flex p-3 border-bottom align-items-center">
          <div className="flex-grow-1">
            <Form.Control
              type="text"
              value={editingQuestion.title}
              onChange={(e) => handleQuestionChange("title", e.target.value)}
              className="border"
              placeholder="Question Name"
            />
          </div>
          <div className="ms-3 me-3" style={{ width: "200px" }}>
            <Form.Select
              value={editingQuestion.questionType}
              onChange={(e) => handleQuestionChange("questionType", e.target.value)}
            >
              <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
              <option value={QuestionType.TRUE_FALSE}>True/False</option>
              <option value={QuestionType.FILL_IN_BLANK}>Fill in the Blank</option>
            </Form.Select>
          </div>
          <div className="d-flex align-items-center">
            <span className="me-2">pts:</span>
            <Form.Control
              type="number"
              min="0"
              value={editingQuestion.points}
              onChange={(e) => handleQuestionChange("points", parseInt(e.target.value) || 0)}
              style={{ width: "60px" }}
              className="text-center"
            />
          </div>
        </div>
        
        <div className="p-3">
          <p className="text-muted mb-3">Enter your question text, then define all possible correct answers for the blank. Students will see the question followed by a small text box to type their answer.</p>
          
          <Form.Group className="mb-3">
            <Form.Label><strong>Question:</strong></Form.Label>
            <ReactQuill
            value={editingQuestion.questionText}
            onChange={(value) => handleQuestionChange("questionText", value)}
            style={{ height: "120px", borderRadius: "5px", marginBottom: "2rem" }}
            />
          </Form.Group>
          <br></br>
          <Form.Group className="mt-4">
            <Form.Label>Answers:</Form.Label>
            {blankAnswers.map((answer, index) => (
              <div key={index} className="d-flex align-items-center mb-2" style={{ gap: "10px" }}>
                <span className="me-2" style={{ whiteSpace: "nowrap" }}>Possible Answer:</span>
                <Form.Control
                  type="text"
                  value={answer}
                  onChange={(e) => handleBlankAnswerChange(index, e.target.value)}
                  style={{ width: "200px" }}
                  placeholder={`Answer ${index + 1}`}
                />
                {index > 0 && (
                  <button 
                    className="btn btn-link p-0" 
                    onClick={() => handleRemoveBlankAnswer(index)}
                    style={{ color: "#6c757d" }}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <div className="text-end mt-3">
              <Button 
                variant="link" 
                className="text-danger"
                onClick={handleAddBlankAnswer}
              >
                + Add Another Answer
              </Button>
            </div>
          </Form.Group>
          
          <div className="d-flex justify-content-left mt-4">
            <Button 
              variant="light" 
              className="me-2 border"
              onClick={handleCancelEdit}
              disabled={saveInProgress}
            >
              Cancel
            </Button>
            <Button 
              variant="danger"
              onClick={handleUpdateQuestion}
              disabled={saveInProgress}
            >
              {saveInProgress ? "Saving..." : "Save Question"}
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderQuestionEditor = () => {
    if (!editingQuestion) return null;
    
    switch (editingQuestion.questionType) {
      case QuestionType.MULTIPLE_CHOICE:
        return renderMultipleChoiceEditor();
      case QuestionType.TRUE_FALSE:
        return renderTrueFalseEditor();
      case QuestionType.FILL_IN_BLANK:
        return renderFillInBlankEditor();
      default:
        return renderMultipleChoiceEditor();
    }
  };
  
  useEffect(() => {
    if (!isFaculty) {
      alert("Only faculty members can edit quiz questions. Students cannot create or edit quizzes.");
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    }
  }, [isFaculty, navigate, cid]);
  
  if (!isFaculty) {
    return null;
  }
  
  if (loading) {
    return <div>Loading questions editor...</div>;
  }
  
  return (
    <div className="container-fluid px-0">

      <div className="d-flex justify-content-between align-items-center mb-3 px-3">
        <h1 className="h5 mb-0">{selectedQuiz?.title || "Quiz"}</h1>
        <div className="d-flex align-items-center">
          <span className="text-secondary me-3">Points {totalPoints}</span>
        </div>
      </div>

      <div className="mb-3">
        <Nav variant="tabs" className="border-bottom">
          <Nav.Item>
            <Nav.Link 
              onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`)}
              className="text-secondary"
            >
              Details
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active
              className="text-danger border-top border-start border-end"
            >
              Questions
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      <div className="text-center mb-4">
        <Button 
          variant="danger"
          className="rounded"
          onClick={handleAddQuestion}
          disabled={saveInProgress}
        >
          + Add Question
        </Button>
      </div>

      <div className="px-4">
        {questions.length === 0 ? (
          <div className="text-center text-muted my-5">
            No questions yet. Click the "+ Add Question" button to create your first question.
          </div>
        ) : (
          <div>
            {questions.map((question) => {
              if (editingQuestion && editingQuestion._id === question._id) {
                return (
                  <div key={question._id} className="mb-4">
                    <div>
                      {renderQuestionEditor()}
                    </div>
                  </div>
                );
              }
              
              return (
                <div key={question._id} className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">{question.title}</h5>
                    <div>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleEditQuestion(question)}
                        className="me-2"
                        disabled={saveInProgress}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question._id as string)}
                        disabled={saveInProgress}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded p-3">
                    <p><strong>Type:</strong> {question.questionType}</p>
                    <p><strong>Points:</strong> {question.points}</p>
                    {/* <p><strong>Question:</strong> {question.questionText || "No question text provided."}</p> */}
                    <p>
                      <strong>Question:</strong>{" "}
                      {question.questionText
                      ? question.questionText.replace(/<[^>]+>/g, '') // Removes all HTML tags
                      : "No question text provided."}
                      </p>
                    {question.questionType === QuestionType.MULTIPLE_CHOICE && (
                      <div>
                        <p><strong>Choices:</strong></p>
                        <ul>
                          {question.choices?.map((choice, choiceIndex) => (
                            <li key={choiceIndex}>
                              {choiceIndex === question.correctAnswer ? (
                                <strong>{choice || `Answer ${choiceIndex + 1}`} (Correct)</strong>
                              ) : (
                                <span>{choice || `Answer ${choiceIndex + 1}`}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {question.questionType === QuestionType.TRUE_FALSE && (
                      <p><strong>Correct Answer:</strong> {question.correctAnswer ? "True" : "False"}</p>
                    )}
                    {question.questionType === QuestionType.FILL_IN_BLANK && (
                      <div>
                        <p><strong>Acceptable Answers:</strong></p>
                        <ul>
                          {Array.isArray(question.correctAnswer) && question.correctAnswer.map((answer, answerIndex) => (
                            <li key={answerIndex}>{answer || "Empty answer"}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {showNewQuestion && editingQuestion && !questions.some(q => q._id === editingQuestion._id) && (
              <div className="mb-4">
                {renderQuestionEditor()}
              </div>
            )}
          </div>
        )}
      </div> 
    </div>
  );
};

export default QuizQuestionsEditor;