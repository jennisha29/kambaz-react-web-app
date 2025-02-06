import { Link } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid} from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";

export default function KambazNavigation() {
  return (
    <div id="wd-kambaz-navigation" style={{ width: 110 }}
        className="list-group rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">
      <a id="wd-neu-link" target="_blank"
         href="https://www.northeastern.edu/"
         className="list-group-item bg-black border-0 text-center">
         <img src="/images/NEU.jpeg" width="75px" alt="NEU Logo" /></a>
         
      <Link to="/Kambaz/Account" id="wd-account-link"
        className="list-group-item text-center border-0 bg-black text-white">
        <FaRegCircleUser className="fs-1 text-white" /><br />
        Account </Link>

      <Link to="/Kambaz/Dashboard" id="wd-dashboard-link"
        className="list-group-item text-center border-0 bg-white text-danger">
        <AiOutlineDashboard className="fs-1 text-danger" /><br />
        Dashboard </Link>

      <Link to="/Kambaz/Dashboard" id="wd-course-link"
       className="list-group-item text-white bg-black text-center border-0">
        <LiaBookSolid className="fs-1 text-danger" /><br />
        Courses </Link>

      <Link to="/Kambaz/Calendar" id="wd-calendar-link"
        className="list-group-item text-white 
                   bg-black text-center border-0">
        <IoCalendarOutline className="fs-1 text-danger" />
        <br />Calendar
      </Link>

      <Link to="/Kambaz/Inbox" id="wd-inbox-link"
        className="list-group-item text-white 
                   bg-black text-center border-0">
        <FaInbox className="fs-1 text-danger" />
        <br />Inbox
      </Link>

      <Link to="/Labs" id="wd-labs-link"
        className="list-group-item text-white 
                   bg-black text-center border-0">
        <IoSettingsOutline className="fs-1 text-danger" />
        <br />Labs
      </Link>
    </div>
  );
}