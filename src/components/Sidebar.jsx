import {
  FaHome,
  FaUsers,
  FaGamepad,
  FaChartBar,
  FaTrophy,
  FaCog,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const linkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "white",
  textDecoration: "none",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "10px",
};

function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        background: "#111827",
        color: "white",
        height: "100vh",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>🦅 4 Baaj</h2>

      <NavLink
        to="/"
        style={({ isActive }) => ({
          ...linkStyle,
          background: isActive ? "#374151" : "transparent",
        })}
      >
        <FaHome /> Dashboard
      </NavLink>

      <NavLink
        to="/players"
        style={({ isActive }) => ({
          ...linkStyle,
          background: isActive ? "#374151" : "transparent",
        })}
      >
        <FaUsers /> Players
      </NavLink>

      <NavLink
        to="/matches"
        style={({ isActive }) => ({
          ...linkStyle,
          background: isActive ? "#374151" : "transparent",
        })}
      >
        <FaGamepad /> Add Match
      </NavLink>

      <NavLink
        to="/history"
        style={({ isActive }) => ({
          ...linkStyle,
          background: isActive ? "#374151" : "transparent",
        })}
      >
        <FaGamepad /> Match History
      </NavLink>

      <NavLink
        to="/leaderboard"
        style={({ isActive }) => ({
          ...linkStyle,
          background: isActive ? "#374151" : "transparent",
        })}
      >
        <FaTrophy /> Leaderboard
      </NavLink>

      <NavLink
        to="/analytics"
        style={({ isActive }) => ({
          ...linkStyle,
          background: isActive ? "#374151" : "transparent",
        })}
      >
        <FaChartBar /> Analytics
      </NavLink>

      <div
        style={{
          ...linkStyle,
          opacity: 0.5,
          marginTop: "30px",
        }}
      >
        <FaCog /> Settings
      </div>
    </div>
  );
}

export default Sidebar;