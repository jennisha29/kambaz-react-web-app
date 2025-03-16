import { useSelector, useDispatch } from "react-redux";
import { Button, FormControl, ListGroup } from "react-bootstrap";
import { addTodo, updateTodo, setTodo } from "./todosReducer";

export default function TodoForm() {
  const { todo } = useSelector((state: any) => state.todosReducer);
  const dispatch = useDispatch();
  
  return (
    <ListGroup.Item className="d-flex align-items-center">
      <FormControl 
        value={todo.title}
        className="flex-grow-1 me-2"
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
      />
      <div className="d-flex">
        <Button 
          variant="warning" 
          className="me-2"
          onClick={() => dispatch(updateTodo(todo))}
          id="wd-update-todo-click"
        >
          Update
        </Button>
        <Button 
          variant="success"
          onClick={() => dispatch(addTodo(todo))}
          id="wd-add-todo-click"
        >
          Add
        </Button>
      </div>
    </ListGroup.Item>
  );
}