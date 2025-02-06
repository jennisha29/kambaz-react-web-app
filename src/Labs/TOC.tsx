import Nav from "react-bootstrap/Nav";

export default function TOC() {
    return (
      <Nav variant="pills">
        <Nav.Item>
          <Nav.Link href="#/Labs">Labs</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#/Labs/Lab1">Lab 1</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#/Labs/Lab2">Lab 2</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#/Labs/Lab3">Lab 3</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#/Kambaz">Kambaz</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link id="wd-github"
          href="https://github.com/jennisha29/kambaz-react-web-app/tree/a2"
          target="_blank"
          rel="noopener noreferrer">My GitHub</Nav.Link>
        </Nav.Item>
      </Nav>
   );}