import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer"; 
import { Form, Button } from "react-bootstrap";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const fetchProfile = () => {
    if (!currentUser) {
      return navigate("/Kambaz/Account/Signin");
    }
    setProfile(currentUser);
  };

  const signout = () => {
    dispatch(setCurrentUser(null));
    navigate("/Kambaz/Account/Signin");
  };

  useEffect(() => { 
    fetchProfile(); 
  }, []);

  if (!currentUser) {
    return null; 
  }

  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      {profile && (
        <div>
          <Form.Control
            defaultValue={profile.username}
            id="wd-username"
            className="mb-2"
            placeholder="username"
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          />

          <Form.Control
            defaultValue={profile.password}
            id="wd-password"
            className="mb-2"
            type="password"
            placeholder="password"
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
          />

          <Form.Control
            defaultValue={profile.firstName}
            id="wd-firstname"
            className="mb-2"
            placeholder="First Name"
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
          />

          <Form.Control
            defaultValue={profile.lastName}
            id="wd-lastname"
            className="mb-2"
            placeholder="Last Name"
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
          />

          <Form.Control
            defaultValue={profile.dob}
            id="wd-dob"
            className="mb-2"
            type="date"
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
          />

          <Form.Control
            defaultValue={profile.email}
            id="wd-email"
            className="mb-2"
            type="email"
            placeholder="Email"
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />

          <Form.Select
            value={profile.role || "USER"}
            id="wd-role"
            className="mb-2"
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </Form.Select>

          <Button 
            onClick={signout} 
            className="w-100 mb-2 btn-danger" 
            id="wd-signout-btn"
          >
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}