import { useState, useEffect } from "react";
import { ListGroup, FormControl } from "react-bootstrap";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import * as client from "./client";

export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fetchTodos = async () => {
    const todos = await client.fetchTodos();
    setTodos(todos);
  };
  
  const createTodo = async () => {
    const todos = await client.createTodo();
    setTodos(todos);
  };
  
  const postTodo = async () => {
    try {
      const newTodo = await client.postTodo({ 
        title: "New Posted Todo", 
        completed: false 
      });
      setTodos([...todos, newTodo]);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Error posting todo");
    }
  };
  
  const removeTodo = async (todo: any) => {
    try {
      const updatedTodos = await client.removeTodo(todo);
      setTodos(updatedTodos);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Error removing todo");
    }
  };
  
  const deleteTodo = async (todo: any) => {
    try {
      await client.deleteTodo(todo);
      const newTodos = todos.filter(t => t.id !== todo.id);
      setTodos(newTodos);
      setErrorMessage(null);
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error.response?.data?.message || "Error deleting todo");
    }
  };
  
  const editTodo = (todo: any) => {
    const updatedTodos = todos.map(t => 
      t.id === todo.id ? { ...todo, editing: true } : t
    );
    setTodos(updatedTodos);
  };
  
  const updateTodo = async (todo: any) => {
    try {
      await client.updateTodo(todo);
      setTodos(todos.map(t => t.id === todo.id ? { ...todo, editing: false } : t));
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Error updating todo");
    }
  };
  
  const toggleTodoCompleted = async (todo: any) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      await client.updateTodo(updatedTodo);
      setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t));
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Error toggling todo completion");
    }
  };
  
  useEffect(() => {
    fetchTodos();
  }, []);
  
  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>
      
      {errorMessage && (
        <div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2">
          {errorMessage}
        </div>
      )}
      
      <h4>
        Todos
        <span className="float-end">
            <FaPlusCircle 
              onClick={createTodo} 
              className="text-success fs-3" 
              id="wd-create-todo"
              style={{ cursor: 'pointer'}} 
            />
            <FaPlusCircle 
              onClick={postTodo} 
              className="text-primary fs-3" 
              id="wd-post-todo"
              style={{ cursor: 'pointer' }} 
            />
        </span>
      </h4>
      
      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item key={todo.id} className="d-flex align-items-center">
            <input 
              type="checkbox" 
              className="form-check-input me-2"
              checked={todo.completed}
              onChange={() => toggleTodoCompleted(todo)}
            />
            
            {!todo.editing ? (
              <span 
                style={{ 
                  textDecoration: todo.completed ? "line-through" : "none",
                  flex: 1
                }}
              >
                {todo.title}
              </span>
            ) : (
              <FormControl 
                className="me-2"
                style={{ flex: 1 }}
                defaultValue={todo.title}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTodo({ ...todo, editing: false });
                  }
                }}
                onChange={(e) => setTodos(todos.map(t => 
                  t.id === todo.id ? { ...todo, title: e.target.value } : t
                ))}
                onBlur={() => updateTodo({ ...todo, editing: false })}
              />
            )}
            
            <div className="d-flex ms-auto">
              <FaPencil 
                onClick={() => editTodo(todo)} 
                className="text-primary me-2"
                style={{ cursor: 'pointer' }}
              />
              <TiDelete 
                onClick={() => deleteTodo(todo)} 
                className="text-danger me-2 fs-5"
                id="wd-delete-todo"
                style={{ cursor: 'pointer' }}
              />
              <FaTrash 
                onClick={() => removeTodo(todo)}
                className="text-danger"
                id="wd-remove-todo"
                style={{ cursor: 'pointer' }}
              />
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}