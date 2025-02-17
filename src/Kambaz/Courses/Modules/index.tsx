import { useParams } from "react-router";
import { ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import * as db from "../../Database";

export default function Modules() {
    const { cid } = useParams();
    const modules = db.modules;

    return (
        <div>
            <ModulesControls /><br /><br /><br />
            <ListGroup className="rounded-0" id="wd-modules">
                {modules
                    .filter((module) => module.course === cid)
                    .map((module) => (
                        <ListGroup.Item 
                            key={module._id} 
                            className="wd-module p-0 mb-4 fs-5 border-gray"
                        >
                            <div className="wd-title p-2 bg-light d-flex justify-content-between align-items-center">
                                <div>
                                    <BsGripVertical className="me-2 fs-3" /> {module.name}
                                </div>
                                <ModuleControlButtons />
                            </div>
                            {module.lessons && (
                                <ListGroup className="wd-lessons rounded-0">
                                    <ListGroup.Item 
                                        className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between"
                                    >
                                        <div>
                                            <BsGripVertical className="me-2 fs-3" /> LEARNING OBJECTIVES
                                        </div>
                                        <LessonControlButtons />
                                    </ListGroup.Item>
                                    {module.lessons.map((lesson) => (
                                        <ListGroup.Item 
                                            key={lesson._id}
                                            className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between border-bottom"
                                        >
                                            <div>
                                                <BsGripVertical className="me-2 fs-3" /> {lesson.name}
                                            </div>
                                            <LessonControlButtons />
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    ))}
            </ListGroup>
        </div>
    );
}