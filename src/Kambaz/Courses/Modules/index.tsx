export default function Modules() {
    return (
      <div>
        <div className="wd-module-buttons">
            <button>Collapse All</button>
            <button>View Progress</button>
            <button>Publish All</button>
            <button>+ Module</button>
        </div>
        <ul id="wd-modules">
          <li className="wd-module">
            <div className="wd-title">Week 1, Lecture 1 - Introduction to React</div>
            <ul className="wd-lessons">
              <li className="wd-lesson">
                <span className="wd-title">LEARNING OBJECTIVES</span>
                <ul className="wd-content">
                  <li className="wd-content-item">Introduction to the course</li>
                  <li className="wd-content-item">Learn what is React Development</li>
                </ul>
              </li>
              <li className="wd-lesson">
                <span className="wd-title">READING</span>
                <ul className="wd-content">
                    <li className="wd-content-item">Full Stack Developer - Chapter 1 - React Fundamentals</li>
                    <li className="wd-content-item">Full Stack Developer - Chapter 2 - Creating Components</li>
                </ul>
              </li>
              <li className="wd-lesson">
                <span className="wd-title">SLIDES</span>
                <ul className="wd-content">
                    <li className="wd-content-item">Introduction to React Development</li>
                    <li className="wd-content-item">Creating a React Application with Create-React-App</li>
                    <li className="wd-content-item">Understanding JSX and Components</li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="wd-module">
            <div className="wd-title">Week 1, Lecture 2 - Building React Components</div>
            <ul className="wd-lessons">
                <li className="wd-lesson">
                    <span className="wd-title">LEARNING OBJECTIVES</span>
                    <ul className="wd-content">
                        <li className="wd-content-item">Learn how to create React components</li>
                        <li className="wd-content-item">Deploy React application to Netlify</li>
                    </ul>
                </li>
                <li className="wd-lesson">
                    <span className="wd-title">SLIDES</span>
                    <ul className="wd-content">
                        <li className="wd-content-item">Props and State in React</li>
                        <li className="wd-content-item">Working with React Events</li>
                        <li className="wd-content-item">Component Lifecycle and Hooks</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li className="wd-module">
            <div className="wd-title">Week 2</div>
        </li>
        <li className="wd-module">
            <div className="wd-title">Week 3</div>
        </li>
     </ul>
   </div>
  );}
  