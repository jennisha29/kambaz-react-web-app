import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import * as db from "../Database";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signin = () => {
     const user = db.users.find(
       (u: any) => u.username === credentials.username && u.password === credentials.password);
     if (!user) return;
     dispatch(setCurrentUser(user));
     navigate("/Kambaz/Dashboard");
   };
  
  return (
    <div id="wd-signin-screen">
      <h2>Sign in</h2>
      <Form.Control id="wd-username"
        placeholder="username"
        className="mb-2"
        defaultValue={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      />
      <Form.Control id="wd-password"
        placeholder="password" type="password"
        className="mb-2"
        defaultValue={credentials.password}
        onChange={(e) => setCredentials({
          ...credentials,
          password: e.target.value })}
      />
      <Button 
        onClick={signin} 
        id="wd-signin-btn" 
        className="btn btn-primary w-100 mb-2"
      >
        Sign in
      </Button>
      <Link id="wd-signup-link" to="/Kambaz/Account/Signup">Sign up</Link>
    </div>
  );
}