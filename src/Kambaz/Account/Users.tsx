import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { FormControl } from "react-bootstrap";
import PeopleTable from "../Courses/People/Table";
import { FaPlus } from "react-icons/fa";
import * as client from "./client";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const { uid } = useParams();

  useEffect(() => {
    console.log("Current search:", name);
  }, [name]);
  
  
  const filterUsersByRole = async (role: string) => {
    setRole(role);
    if (role) {
      const users = await client.findUsersByRole(role);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };
  
  const filterUsersByName = async (name: string) => {
    setName(name);
    if (name) {
      const users = await client.findUsersByPartialName(name);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };
  
  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    setUsers(users);
  };
  
  useEffect(() => {
    fetchUsers();
  }, [uid]);
  
  const createUser = async () => {
    try {
      console.log("Creating new user...");
      const user = await client.createUser({
        firstName: "New",
        lastName: `User${users.length + 1}`,
        username: `newuser${Date.now()}`,
        password: "password123",
        email: `email${users.length + 1}@neu.edu`,
        section: "S101",
        role: "STUDENT",
      });
      console.log("User created:", user);
      setUsers([...users, user]);
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Check console for details.");
    }
  };

  return (
    <div>
      <button onClick={createUser} className="float-end btn btn-danger wd-add-people">
        <FaPlus className="me-2" />
        People
        </button>
      <h3>Users</h3>
      <div className="mb-4"> 
        <FormControl 
          onChange={(e) => filterUsersByName(e.target.value)} 
          placeholder="Search people"
          className="float-start w-25 me-2 wd-filter-by-name" 
        />
        <select 
          value={role} 
          onChange={(e) => filterUsersByRole(e.target.value)}
          className="form-select float-start w-25 wd-select-role"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="TA">Assistants</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Administrators</option>
        </select>
        <div className="clearfix"></div>
      </div>
      <PeopleTable users={users} />
    </div>
  );
}