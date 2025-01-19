import { Link } from "react-router-dom";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1234/Home"
                className="wd-dashboard-course-link" >
            <img src="/images/reactjs.jpg" width={200} />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer  </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
            <Link to="/Kambaz/Courses/5520/Home" 
                  className="wd-dashboard-course-link">
                <img src="/images/mobileappdev.jpg" width={200} />
                <div>
                    <h5>CS5520 Mobile Application Development </h5>
                    <p className="wd-dashboard-course-title">
                       iOS and Android App Development </p>
                    <button> Go </button>
                </div>
            </Link>
        </div>
        <div className="wd-dashboard-course">
            <Link to="/Kambaz/Courses/6140/Home" 
                  className="wd-dashboard-course-link">
                <img src="/images/machinelearning.jpg" width={200} />
                <div>
                    <h5>CS6140 Machine Learning </h5>
                    <p className="wd-dashboard-course-title">
                       Algorithms and Statistical Models </p>
                    <button> Go </button>
                </div>
            </Link>
        </div>
        <div className="wd-dashboard-course">
            <Link to="/Kambaz/Courses/6620/Home" 
                  className="wd-dashboard-course-link">
                <img src="/images/cloud.jpg" width={200} />
                <div>
                    <h5>CS6620 Fundamentals of Cloud Computing </h5>
                    <p className="wd-dashboard-course-title">
                       AWS, Azure, and Cloud Services </p>
                    <button> Go </button>
                </div>
            </Link>
        </div>
        <div className="wd-dashboard-course">
            <Link to="/Kambaz/Courses/5100/Home" 
                  className="wd-dashboard-course-link">
                <img src="/images/ai.jpg" width={200} />
                <div>
                    <h5>CS5100 Foundations of Artificial Intelligence </h5>
                    <p className="wd-dashboard-course-title">
                       Ai Principles and Applications</p>
                    <button> Go </button>
                </div>
            </Link>
        </div>
        <div className="wd-dashboard-course">
            <Link to="/Kambaz/Courses/5200/Home" 
                  className="wd-dashboard-course-link">
                <img src="/images/database.jpg" width={200} />
                <div>
                    <h5>CS5200 Database Management Systems </h5>
                    <p className="wd-dashboard-course-title">
                       Database Design and SQL</p>
                    <button> Go </button>
                </div>
            </Link>
        </div>
        <div className="wd-dashboard-course">
            <Link to="/Kambaz/Courses/6120/Home" 
                  className="wd-dashboard-course-link">
                <img src="/images/nlp.jpg" width={200} />
                <div>
                    <h5>CS6120 Natural Language Processing </h5>
                    <p className="wd-dashboard-course-title">
                       Text Analysis and Language Models</p>
                    <button> Go </button>
                </div>
            </Link>
        </div>
        <div className="wd-dashboard-course">
            <Link to="/Kambaz/Courses/6650/Home" 
                  className="wd-dashboard-course-link">
                <img src="/images/buildingscalable.jpg" width={200} />
                <div>
                    <h5>CS6650 Building Scalable Distributed Systems </h5>
                    <p className="wd-dashboard-course-title"> 
                        Distributed Computing and System Design
                    </p>
                    <button> Go </button>
                </div>
            </Link>
        </div>
      </div>
    </div>
);}

