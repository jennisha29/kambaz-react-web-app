import React from "react";
import { Navigate, useParams } from "react-router";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresEnrollment?: boolean;
  requiredRole?: "FACULTY" | "STUDENT" | "TA" | "ADMIN" | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresEnrollment = false,
  requiredRole = null
}) => {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentReducer);
  const { cid } = useParams<{ cid: string }>();

  if (!currentUser) {
    return <Navigate to="/Kambaz/Account/Signin" />;
  }


  if (requiredRole && currentUser.role !== requiredRole) {
  
    if (!(requiredRole === "FACULTY" && currentUser.role === "ADMIN")) {
      return <Navigate to="/Kambaz/Dashboard" />;
    }
  }

  if (requiresEnrollment && cid) {
    const isEnrolled = enrollments.some(
      (enrollment: any) => 
        enrollment.user === currentUser._id && 
        enrollment.course === cid
    );

    
    const isFacultyOrAdmin = currentUser.role === "FACULTY" || currentUser.role === "ADMIN";

    if (!isEnrolled && !isFacultyOrAdmin) {
      return <Navigate to="/Kambaz/Dashboard" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;