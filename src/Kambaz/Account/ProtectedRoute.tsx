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

  // if user is not logged in this will redirect to login page
  if (!currentUser) {
    return <Navigate to="/Kambaz/Account/Login" />;
  }

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