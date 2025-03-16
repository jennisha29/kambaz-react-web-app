import React from "react";
import { Navigate, useParams } from "react-router";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresEnrollment?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresEnrollment = false 
}) => {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentReducer);
  const { cid } = useParams<{ cid: string }>();

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/Kambaz/Account/Login" />;
  }

  // If enrollment is required, check if user is enrolled in the course
  if (requiresEnrollment && cid) {
    const isEnrolled = enrollments.some(
      (enrollment: any) => 
        enrollment.user === currentUser._id && 
        enrollment.course === cid
    );

    if (!isEnrolled) {
      return <Navigate to="/Kambaz/Dashboard" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;