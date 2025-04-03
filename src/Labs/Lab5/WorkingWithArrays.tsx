import { useState } from "react";
import { FormControl, Form } from "react-bootstrap";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export default function WorkingWithArrays() {
  const [todo, setTodo] = useState({
    id: "1",
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    completed: false
  });
 
  const API = `${REMOTE_SERVER}/lab5/todos`;

  return (
    <div id="wd-working-with-arrays">
      <h3>Working with Arrays</h3>
     
      <h4>Retrieving Arrays</h4>
      <a
        id="wd-retrieve-todos"
        className="btn btn-primary"
        href={API}
      >
        Get Todos
      </a>
      <hr/>
     
      <h4>Retrieving an Item from an Array by ID</h4>
      <div className="d-flex align-items-center mb-3">
        <FormControl
          id="wd-todo-id"
          className="me-2"
          style={{ maxWidth: "300px" }}
          defaultValue={todo.id}
          onChange={(e) => setTodo({ ...todo, id: e.target.value })}
        />
        <a
          id="wd-retrieve-todo-by-id"
          className="btn btn-primary"
          href={`${API}/${todo.id}`}
        >
          Get Todo by ID
        </a>
      </div>
      <hr />
     
      <h4>Filtering Array Items</h4>
      <a
        id="wd-retrieve-completed-todos"
        className="btn btn-primary"
        href={`${API}?completed=true`}
      >
        Get Completed Todos
      </a>
      <hr/>
     
      <h4>Creating new Items in an Array</h4>
      <a
        id="wd-create-todo"
        className="btn btn-primary"
        href={`${API}/create`}
      >
        Create Todo
      </a>
      <hr/>
     
      <h4>Deleting from an Array</h4>
      <div className="d-flex align-items-center mb-3">
        <FormControl
          className="me-2"
          style={{ maxWidth: "300px" }}
          defaultValue={todo.id}
          onChange={(e) => setTodo({ ...todo, id: e.target.value })}
        />
        <a
          id="wd-delete-todo"
          className="btn btn-primary"
          style={{ whiteSpace: 'nowrap', minWidth: '200px' }}
          href={`${API}/${todo.id}/delete`}
        >
          Delete Todo with ID = {todo.id}
        </a>
      </div>
      <hr/>
     
      <h4>Updating an Item in an Array</h4>
      <div className="mb-3">
        <div className="d-flex align-items-center mb-2">
          <FormControl
            className="me-2"
            style={{ maxWidth: "100px" }}
            placeholder="ID"
            defaultValue={todo.id}
            onChange={(e) => setTodo({ ...todo, id: e.target.value })}
          />
          <FormControl
            className="me-2 flex-grow-1"
            placeholder="Title"
            defaultValue={todo.title}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
          />
          <a
            id="wd-update-todo-title"
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap', minWidth: '150px' }}
            href={`${API}/${todo.id}/title/${todo.title}`}
          >
            Update Todo
          </a>
        </div>
       
        <div className="d-flex align-items-center mb-2">
          <FormControl
            className="me-2"
            style={{ maxWidth: "100px" }}
            readOnly
            value={todo.id}
          />
          <FormControl
            className="me-2 flex-grow-1"
            placeholder="Description"
            defaultValue={todo.description}
            onChange={(e) => setTodo({ ...todo, description: e.target.value })}
          />
          <a
            id="wd-update-todo-description"
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap', minWidth: '150px' }}
            href={`${API}/${todo.id}/description/${todo.description}`}
          >
            Update Description
          </a>
        </div>
       
        <div className="d-flex align-items-center">
          <FormControl
            className="me-2"
            style={{ maxWidth: "100px" }}
            readOnly
            value={todo.id}
          />
          <div className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              className="me-2"
              checked={todo.completed}
              onChange={(e) => setTodo({ ...todo, completed: e.target.checked })}
            />
            <span className="me-3">Completed</span>
            <a
              id="wd-update-todo-completed"
              className="btn btn-primary"
              style={{ whiteSpace: 'nowrap' }}
              href={`${API}/${todo.id}/completed/${todo.completed}`}
            >
              Complete Todo ID = {todo.id}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}