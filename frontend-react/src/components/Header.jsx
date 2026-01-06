import { Link } from "react-router-dom";
import logo from "../assets/project-f8-logo.png";
import { useEffect, useMemo, useState } from "react";

/* ---------- Countdown helpers ---------- */
function getNextApril2() {
  const now = new Date();
  const year = now.getFullYear();
  const targetThisYear = new Date(year, 3, 2, 0, 0, 0); // April = 3

  return now <= targetThisYear
    ? targetThisYear
    : new Date(year + 1, 3, 2, 0, 0, 0);
}

function daysUntil(target) {
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function formatTargetDate(date) {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ---------- Header ---------- */
export default function Header() {
  const targetDate = useMemo(() => getNextApril2(), []);
  const [daysLeft, setDaysLeft] = useState(daysUntil(targetDate));

  useEffect(() => {
    const id = setInterval(() => {
      setDaysLeft(daysUntil(targetDate));
    }, 1000 * 60 * 60); // hourly is plenty
    return () => clearInterval(id);
  }, [targetDate]);

  const isRaceWeek = daysLeft > 0 && daysLeft < 7;

  return (
    <header>
      <div className="brand">
        <img className="brand-logo" src={logo} alt="Project F8 logo" />

        <div className="brand-text">
          <h1>
            Project <span>F8</span> Tracker
          </h1>
          <p>Track your laps</p>
        </div>
      </div>

      <nav>
        <Link to="/" className="primary">
          View Laps
        </Link>
        <Link to="/create-lap">Create Lap</Link>
      </nav>

      {/* Countdown */}
      <div className={`countdown ${isRaceWeek ? "race-week" : ""}`}>
        <div className="countdown-left">
          <div className="countdown-label">Countdown</div>
          <div className="countdown-date">Next race: {formatTargetDate(targetDate)}</div>
        </div>

        <div className="countdown-value">
          <span className="countdown-num">{daysLeft}</span>
          <span className="countdown-unit">days</span>
        </div>
      </div>
    </header>
  );
}
