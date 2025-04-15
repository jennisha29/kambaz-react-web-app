import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PeopleTable from "./Table";
import * as courseClient from "../client";

export default function People() {
  const { cid } = useParams();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!cid) return;
      
      try {
        setLoading(true);
        const enrolledUsers = await courseClient.findUsersForCourse(cid);
        const validUsers = enrolledUsers.filter((user: any) => user !== null);
        setUsers(validUsers);
      } catch (error) {
        console.error("Error fetching enrolled users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [cid]);

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div>
      <h2>People in Course</h2>
      <PeopleTable users={users.filter((user: any) => user !== null)} />
    </div>
  );
}