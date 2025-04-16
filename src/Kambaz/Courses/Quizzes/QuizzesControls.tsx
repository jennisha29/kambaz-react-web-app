import { BsSearch } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function QuizzesControls() {
  const navigate = useNavigate();
  const { cid } = useParams();
  
  const { currentUser } = useSelector((state: any) => state.accountReducer || {});
  const isFaculty = currentUser && currentUser.role === "FACULTY";
  
  const handleAddQuiz = () => {
    if (cid) {
      console.log("Navigating to new quiz page for course:", cid);
      navigate(`/Kambaz/Courses/${cid}/Quizzes/new`);
    } else {
      navigate("/Quizzes/new");
    }
  };
  
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div className="position-relative">
        <input
          type="text"
          className="form-control ps-5 py-2"
          placeholder="Search for Quiz"
          style={{ width: "225px" }}
        />
        <BsSearch 
          className="position-absolute text-secondary" 
          style={{ left: "15px", top: "50%", transform: "translateY(-50%)" }}
        />
      </div>
      {isFaculty && (
        <div>
          <Button 
            variant="danger" 
            onClick={handleAddQuiz}
          >
            <span className="me-1">+</span> Quiz
          </Button>
        </div>
      )}
    </div>
  );
}