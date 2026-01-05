import { Link } from "react-router-dom";
import logo from "../assets/project-f8-logo.png"; // or .png

export default function Header() {
  return (
    <header>
      <div className="brand">
        <img className="brand-logo" src={logo} alt="Project F8 logo" />
        <div className="brand-text">
          <h1>Project <span>F8</span> Tracker</h1>
          <p>Track your laps</p>
        </div>
      </div>

      <nav>
        <Link to="/" className="primary">View Laps</Link>
        <Link to="/create-lap">Create Lap</Link>
      </nav>
    </header>
  );
}
