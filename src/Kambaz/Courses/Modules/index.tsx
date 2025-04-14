import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { ListGroup, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import { setModules, addModule, editModule, updateModule, deleteModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import * as coursesClient from "../client";
import * as modulesClient from "./client";
import * as courseClient from "../client";


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

    const saveModule = async (module: any) => {
        await modulesClient.updateModule(module);
        dispatch(updateModule(module));
      };
    

    const removeModule = async (moduleId: string) => {
        await modulesClient.deleteModule(moduleId);
        dispatch(deleteModule(moduleId));
      };
    

    const createModuleForCourse = async () => {
        if (!cid) return;
        const newModule = { name: moduleName, course: cid };
        const module = await coursesClient.createModuleForCourse(cid, newModule);
        dispatch(addModule(module));
      };
    
    
    // const fetchModules = async () => {
    //     const modules = await coursesClient.findModulesForCourse(cid as string);
    //     dispatch(setModules(modules));
    // };
    
    // useEffect(() => {
    //     fetchModules();
    // }, []);
    

    const fetchModulesForCourse = async () => {
        const modules = await courseClient.findModulesForCourse(cid!);
        dispatch(setModules(modules));
      };
      useEffect(() => {
        fetchModulesForCourse();
      }, [cid]);
     
    
    return (
        <div>
            <ModulesControls 
                setModuleName={setModuleName} 
                moduleName={moduleName} 
                addModule= {createModuleForCourse}
            />
            <br /><br /><br />
            <ListGroup className="rounded-0" id="wd-modules">
                {modules.map((module: Module) => (
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
                                                saveModule({ ...module, editing: false });
                                            }
                                        }}
                                        defaultValue={module.name}
                                        autoFocus
                                    />
                                )}
                            </div>
                            <ModuleControlButtons 
                                moduleId={module._id}
                                deleteModule={(moduleId) => removeModule(moduleId)}
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