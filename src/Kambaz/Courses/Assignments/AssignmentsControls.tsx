import { BsSearch } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function AssignmentsControls() {
  const navigate = useNavigate();
  const { cid } = useParams();
  
  // checking if faculty
  const { currentUser } = useSelector((state: any) => state.accountReducer || {});
  const isFaculty = currentUser && currentUser.role === "FACULTY";
  console.log(currentUser)
  const handleAddAssignment = () => {
    if (cid) {
      console.log("Navigating to new assignment page for course:", cid);
      navigate(`/Kambaz/Courses/${cid}/Assignments/new`);
    } else {
      navigate("/Assignments/new");
    }
  };
  
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      
      <div className="position-relative" style={{ width: "240px" }}>
        <input
          type="text"
          className="form-control ps-5 py-2"
          placeholder="Search..."
        />
        <BsSearch 
          className="position-absolute text-secondary" 
          style={{ left: "15px", top: "50%", transform: "translateY(-50%)" }}
        />
      </div>
      {isFaculty && (
        <div>
          <Button variant="light" className="me-2">+ Group</Button>
          <Button 
            variant="danger" 
            onClick={handleAddAssignment}
          >
            + Assignment
          </Button>
        </div>
      )}
    </div>
  );
}