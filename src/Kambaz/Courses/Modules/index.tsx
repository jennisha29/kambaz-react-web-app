import { useState } from "react";
import { useParams } from "react-router";
import { ListGroup, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import { addModule, editModule, updateModule, deleteModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";


interface Lesson {
  _id: string;
  name: string;
}

interface Module {
  _id: string;
  name: string;
  course: string;
  lessons?: Lesson[];
  editing?: boolean;
}

export default function Modules() {
    const { cid } = useParams();
    const [moduleName, setModuleName] = useState("");
    const { modules } = useSelector((state: any) => state.modulesReducer);
    const dispatch = useDispatch();

    const courseModules = modules.filter((module: Module) => module.course === cid);
    
    return (
        <div>
            <ModulesControls 
                setModuleName={setModuleName} 
                moduleName={moduleName} 
                addModule={() => {
                    dispatch(addModule({ name: moduleName, course: cid }));
                    setModuleName("");
                }}
            />
            <br /><br /><br />
            <ListGroup className="rounded-0" id="wd-modules">
                {courseModules.map((module: Module) => (
                    <ListGroup.Item 
                        key={module._id}
                        className="wd-module p-0 mb-4 fs-5 border-gray"
                    >
                        <div className="wd-title p-2 bg-light d-flex justify-content-between align-items-center">
                            <div>
                                <BsGripVertical className="me-2 fs-3" />
                                {!module.editing && module.name}
                                {module.editing && (
                                    <FormControl 
                                        className="w-50 d-inline-block"
                                        onChange={(e) => 
                                            dispatch(
                                                updateModule({ ...module, name: e.target.value })
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                dispatch(updateModule({ ...module, editing: false }));
                                            }
                                        }}
                                        defaultValue={module.name}
                                        autoFocus
                                    />
                                )}
                            </div>
                            <ModuleControlButtons 
                                moduleId={module._id}
                                deleteModule={(moduleId) => {
                                    dispatch(deleteModule(moduleId));
                                }}
                                editModule={(moduleId) => dispatch(editModule(moduleId))}
                            />
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
                                {module.lessons.map((lesson: Lesson) => (
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