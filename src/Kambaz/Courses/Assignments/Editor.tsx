export default function AssignmentEditor() {
    return (
      <div id="wd-assignments-editor">
        <strong><label htmlFor="wd-name">Assignment Name</label></strong>
        <br /> <br />
        <input id="wd-name" value="A1 - React Fundamentals" size={30} /><br /><br />
        <textarea id="wd-description"
                  rows={8} 
                  cols={55}
        >
            The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kanbaz application Links to all relevant source code repositories The Kanbaz application should include a Link to navigate back to the landing page.
        </textarea>
        <br /><br />
        <table>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" value={100} />
            </td>
          </tr>
          <tr>
            <td align="right">
              <label htmlFor="wd-group">Assignment Group</label>
            </td>
            <td>
              <select id="wd-group">
                <option>ASSIGNMENTS</option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right">
              <label htmlFor="wd-display-grade-as">Display Grade as</label>
            </td>
            <td>
              <select id="wd-display-grade-as">
                <option>Percentage</option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right">
              <label htmlFor="wd-submission-type">Submission Type</label>
            </td>
            <td>
              <select id="wd-submission-type">
                <option>Online</option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right">Online Entry Options</td>
            <td>
              <div>
                <input type="checkbox" id="wd-text-entry" />
                <label htmlFor="wd-text-entry">Text Entry</label>
              </div>
              <div>
                <input type="checkbox" id="wd-website-url" defaultChecked />
                <label htmlFor="wd-website-url">Website URL</label>
              </div>
              <div>
                <input type="checkbox" id="wd-media-recordings" />
                <label htmlFor="wd-media-recordings">Media Recordings</label>
              </div>
              <div>
                <input type="checkbox" id="wd-student-annotation" />
                <label htmlFor="wd-student-annotation">Student Annotation</label>
              </div>
              <div>
                <input type="checkbox" id="wd-file-upload" />
                <label htmlFor="wd-file-upload">File Uploads</label>
              </div>
            </td>
          </tr>
          <tr>
            <td align="right">
              <label htmlFor="wd-assign-to">Assign</label>
            </td>
            <td>
              <input id="wd-assign-to" value="Everyone" />
            </td>
          </tr>
          <tr>
            <td align="right">
              <label htmlFor="wd-due-date">Due</label>
            </td>
            <td>
              <input type="date" id="wd-due-date" value="2024-05-13" />
            </td>
          </tr>
          <tr>
            <td align="right">Available from</td>
            <td>
              <input type="date" id="wd-available-from" value="2024-05-06" />
              Until
              <input type="date" id="wd-available-until" value="2024-05-20" />
            </td>
          </tr>
        </table>
        <br /> <br />
        <button>Cancel</button>
        <button>Save</button>
      </div>
  );}
  