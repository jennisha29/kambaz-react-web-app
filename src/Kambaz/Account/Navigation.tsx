import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { pathname } = useLocation();

  return (
    <div
      id="wd-account-navigation"
      className="wd list-group fs-5 rounded-0">
    
      {!currentUser && (
        <Link
          to="/Kambaz/Account/Signin"
          id="wd-signin-link"
          className={`list-group-item ${pathname.includes("Signin") ? "active" : "text-danger"} border border-0`}
        >
          Signin
        </Link>
      )}
      {!currentUser && (
        <Link
          to="/Kambaz/Account/Signup"
          id="wd-signup-link"
          className={`list-group-item ${pathname.includes("Signup") ? "active" : "text-danger"} border border-0`}
        >
          Signup
        </Link>
      )}
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