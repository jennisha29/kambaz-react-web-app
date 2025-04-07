import { BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { useSelector } from "react-redux";

export default function ModuleControlButtons(
  { moduleId, deleteModule, editModule }: { 
    moduleId: string; 
    deleteModule: (moduleId: string) => void;
    editModule: (moduleId: string) => void 
  }
) {
  
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  
  return (
    <div className="float-end">
      {isFaculty && (
        <>
          <FaPencil 
            onClick={() => editModule(moduleId)} 
            className="text-primary me-3" 
            style={{ cursor: 'pointer' }}
          />
          <FaTrash 
            className="text-danger me-3" 
            onClick={() => deleteModule(moduleId)}
            style={{ cursor: 'pointer' }}
          />
        </>
      )}
      <GreenCheckmark />
      {isFaculty && <BsPlus className="fs-4 mx-2" />}
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}