import { useDispatch } from "react-redux";
import { Button, ListGroup } from "react-bootstrap";
import { deleteTodo, setTodo } from "./todosReducer";

export default function TodoItem({ todo }: { todo: { id: string; title: string } }) {
  const dispatch = useDispatch();
  
  return (
    <ListGroup.Item key={todo.id} className="d-flex justify-content-between align-items-center">
      <div>{todo.title}</div>
      <div>
        <Button 
          variant="primary" 
          className="me-2"
          onClick={() => dispatch(setTodo(todo))}
          id="wd-set-todo-click"
        >
          Edit
        </Button>
        <Button 
          variant="danger"
          onClick={() => dispatch(deleteTodo(todo.id))}
          id="wd-delete-todo-click"
        >
          Delete
        </Button>
      </div>
    </ListGroup.Item>
  );
}