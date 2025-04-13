import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Container } from "react-bootstrap";
import * as client from "./client";
import { setCurrentUser } from "./reducer";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
    } else {
      navigate("/Kambaz/Account/Signin");
    }
  }, [currentUser]);
  
  const updateProfile = async () => {
    try {
      const updatedProfile = await client.updateUser(profile);
      dispatch(setCurrentUser(updatedProfile));
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
      console.error(error);
    }
  };
  
  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/Kambaz/Account/Signin");
  };
  
  return (
    <div id="wd-profile-screen">
      <Container className="px-4" style={{ maxWidth: "500px" }}>
        <h3>Profile</h3>
        {profile && (
          <div>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={profile.username || ""}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                value={profile.firstName || ""}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                value={profile.lastName || ""}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={profile.role || "STUDENT"}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="TA">Teaching Assistant</option>
                {profile.role === "ADMIN" && <option value="ADMIN">Admin</option>}
              </Form.Select>
            </Form.Group>
            
            <div>
              <button
                onClick={updateProfile}
                className="btn btn-primary w-100 mb-2"
              >
                Update
              </button>
              <button
                onClick={signout}
                className="wd-signout-btn btn btn-danger w-100"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}