import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { Button, Dropdown } from "react-bootstrap";
import ModuleEditor from "./ModuleEditor";
import { useSelector } from "react-redux";

export default function ModulesControls(
  { moduleName, setModuleName, addModule }:
  { moduleName: string; setModuleName: (title: string) => void; addModule: () => void; }
) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  // Get the current user from Redux store
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  // Check if the current user has the FACULTY role
  const isFaculty = currentUser?.role === "FACULTY";
  
  return (
    <div id="wd-modules-controls" className="text-nowrap">
      {/* Only show Add Module button for FACULTY */}
      {isFaculty && (
        <Button variant="danger" onClick={handleShow} size="lg" className="me-1 float-end" id="wd-add-module-btn">
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Module
        </Button>
      )}

      <Dropdown className="float-end me-2">
        <Dropdown.Toggle variant="secondary" size="lg" id="wd-publish-all-btn">
          <GreenCheckmark /> Publish All
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item id="wd-publish-all">
            <GreenCheckmark /> Publish All
          </Dropdown.Item>
          <Dropdown.Item id="wd-publish-all-modules-and-items">
            <GreenCheckmark /> Publish all modules and items
          </Dropdown.Item>
          <Dropdown.Item id="wd-publish-modules-only">
            <GreenCheckmark /> Publish modules only
          </Dropdown.Item>
          {/* Only show unpublish options for FACULTY */}
          {isFaculty && (
            <>
              <Dropdown.Item id="wd-unpublish-all-modules-and-items">
                ⊘ Unpublish all modules and items
              </Dropdown.Item>
              <Dropdown.Item id="wd-unpublish-modules-only">
                ⊘ Unpublish modules only
              </Dropdown.Item>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>
      
      <Button variant="secondary" size="lg" className="float-end me-2" id="wd-view-progress">
        View Progress
      </Button>

      <Button variant="secondary" size="lg" className="float-end me-2" id="wd-collapse-all">
        Collapse All
      </Button>
      
      {/* The ModuleEditor modal is already protected in its own component */}
      <ModuleEditor
        show={show}
        handleClose={handleClose}
        dialogTitle="Add Module"
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={addModule}
      />
    </div>
  );
}