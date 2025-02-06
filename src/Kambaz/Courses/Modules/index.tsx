import { ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";

export default function Modules() {
    return (
      <div>
        <ModulesControls /><br /><br /><br />
        <ListGroup className="rounded-0" id="wd-modules">
          <ListGroup.Item className="wd-module p-0 mb-2 fs-5 border-gray">
            <div className="wd-title p-2 bg-light d-flex justify-content-between align-items-center">
              <div>
                <BsGripVertical className="me-2 fs-3" /> Week 1
              </div>
              <ModuleControlButtons />
            </div>
            <ListGroup className="wd-lessons rounded-0">
              <ListGroup.Item className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
                <div>
                  <BsGripVertical className="me-2 fs-3" /> LEARNING OBJECTIVES
                </div>
                <LessonControlButtons />
              </ListGroup.Item>
              <ListGroup.Item className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
                <div>
                  <BsGripVertical className="me-2 fs-3" /> Lecture 1 - Introduction to React
                </div>
                <LessonControlButtons />
              </ListGroup.Item>
              <ListGroup.Item className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
                <div>
                  <BsGripVertical className="me-2 fs-3" /> Lecture 2 - Understanding JSX
                </div>
                <LessonControlButtons />
              </ListGroup.Item>
              <ListGroup.Item className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
                <div>
                  <BsGripVertical className="me-2 fs-3" /> Lecture 3 - Components & Props
                </div>
                <LessonControlButtons />
              </ListGroup.Item>
              <ListGroup.Item className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
                <div>
                  <BsGripVertical className="me-2 fs-3" /> Lecture 4 - State and Events
                </div>
                <LessonControlButtons />
              </ListGroup.Item>
            </ListGroup>
          </ListGroup.Item>

          <ListGroup.Item className="wd-module p-0 mb-2 fs-5 bg-dark border border-gray">
            <div className="wd-title p-2 bg-light d-flex justify-content-between align-items-center">
              <div>
                <BsGripVertical className="me-2 fs-3" /> Week 2
              </div>
              <ModuleControlButtons />
            </div>
            <ListGroup className="wd-lessons rounded-0">
              <ListGroup.Item className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
                <div>
                  <BsGripVertical className="me-2 fs-3" /> LEARNING OBJECTIVES
                </div>
                <LessonControlButtons />
              </ListGroup.Item>
              <ListGroup.Item className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
                <div>
                  <BsGripVertical className="me-2 fs-3" /> Lecture 1 - React Lifecycle Methods
                </div>
                <LessonControlButtons />
              </ListGroup.Item>
              <ListGroup.Item className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
                <div>
                  <BsGripVertical className="me-2 fs-3" /> Lecture 2 - React Hooks (State & Effect)
                </div>
                <LessonControlButtons />
              </ListGroup.Item>
            </ListGroup>
          </ListGroup.Item>
          <ListGroup.Item className="wd-module p-0 mb-2 fs-5 border-gray">
            <div className="wd-title p-2 bg-light d-flex justify-content-between align-items-center">
              <div>
                <BsGripVertical className="me-2 fs-3" /> Week 3
              </div>
              <ModuleControlButtons />
            </div>
            <ListGroup className="wd-lessons rounded-0">
              <ListGroup.Item className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
                <div>
                  <BsGripVertical className="me-2 fs-3" /> LEARNING OBJECTIVES
                </div>
                <LessonControlButtons />
              </ListGroup.Item>
              <ListGroup.Item className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
                <div>
                  <BsGripVertical className="me-2 fs-3" /> Lecture 1 - React Router
                </div>
                <LessonControlButtons />
              </ListGroup.Item>
              <ListGroup.Item className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
                <div>
                  <BsGripVertical className="me-2 fs-3" /> Lecture 2 - Testing React Apps
                </div>
                <LessonControlButtons />
              </ListGroup.Item>
            </ListGroup>
          </ListGroup.Item>

        </ListGroup>
      </div>
    );
}