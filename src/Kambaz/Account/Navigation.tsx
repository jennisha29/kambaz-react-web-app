import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { pathname } = useLocation();
  
  // Debug: Log current user state
  console.log("Current user in AccountNavigation:", currentUser);
  
  // Only show Profile link if user is signed in
  // Only show Signin and Signup links if user is not signed in
  return (
    <div
      id="wd-account-navigation"
      className="wd list-group fs-5 rounded-0">
      
      {/* Signin link - only visible when not signed in */}
      {!currentUser && (
        <Link
          to="/Kambaz/Account/Signin"
          id="wd-signin-link"
          className={`list-group-item ${pathname.includes("Signin") ? "active" : "text-danger"} border border-0`}
        >
          Signin
        </Link>
      )}
      
      {/* Signup link - only visible when not signed in */}
      {!currentUser && (
        <Link
          to="/Kambaz/Account/Signup"
          id="wd-signup-link"
          className={`list-group-item ${pathname.includes("Signup") ? "active" : "text-danger"} border border-0`}
        >
          Signup
        </Link>
      )}
      
      {/* Profile link - only visible when signed in */}
      {currentUser && (
        <Link
          to="/Kambaz/Account/Profile"
          id="wd-profile-link"
          className={`list-group-item ${pathname.includes("Profile") ? "active" : "text-danger"} border border-0`}
        >
          Profile
        </Link>
      )}
    </div>
  );
}