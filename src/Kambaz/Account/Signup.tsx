import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const signup = async () => {
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      navigate("/Kambaz/Account/Profile");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };
  
  return (
    <div id="wd-signup-screen">
      <h2>Sign up</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <Form.Control
        placeholder="username"
        className="mb-2 wd-username"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      
      <Form.Control
        placeholder="password"
        type="password"
        className="mb-2 wd-password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      
      <Button
        onClick={signup}
        className="btn btn-primary w-100 mb-2 wd-signup-btn"
      >
        Sign up
      </Button>
      
      <Link to="/Kambaz/Account/Signin" className="wd-signin-link">
        Sign in
      </Link>
    </div>
  );
}