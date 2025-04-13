// src/Kambaz/Courses/Quizzes/QuizContextMenu.tsx
import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizContextMenu.css";

interface QuizContextMenuProps {
  quiz: any;
  courseId: string;
  onClose: () => void;
  onDelete: (quizId: string) => void;
  onTogglePublish: (quizId: string, currentStatus: boolean) => void;
  onCopy?: (quizId: string) => void;
  onSort?: () => void;
}

const QuizContextMenu: React.FC<QuizContextMenuProps> = ({
  quiz,
  courseId,
  onClose,
  onDelete,
  onTogglePublish,
  onCopy = () => console.log("Copy functionality not implemented"),
  onSort = () => console.log("Sort functionality not implemented")
}) => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Handle edit option
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/Kambaz/Courses/${courseId}/Quizzes/${quiz._id || quiz.id}/Edit`);
    onClose();
  };
  
  // Handle delete option
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(quiz._id || quiz.id);
    onClose();
  };
  
  // Handle publish/unpublish option
  const handleTogglePublish = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePublish(quiz._id || quiz.id, quiz.published);
    onClose();
  };
  
  // Handle copy option
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy(quiz._id || quiz.id);
    onClose();
  };
  
  // Handle sort option
  const handleSort = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSort();
    onClose();
  };
  
  return (
    <div className="quiz-context-menu" ref={menuRef}>
      <div className="context-menu-item" onClick={handleEdit}>
        Edit
      </div>
      <div className="context-menu-item" onClick={handleDelete}>
        Delete
      </div>
      <div className="context-menu-item" onClick={handleTogglePublish}>
        {quiz.published ? 'Unpublish' : 'Publish'}
      </div>
      <div className="context-menu-item" onClick={handleCopy}>
        Copy
      </div>
      <div className="context-menu-item" onClick={handleSort}>
        Sort
      </div>
    </div>
  );
};

export default QuizContextMenu;