import { useContext } from "react";
import {
  FaHome,
  FaUsers,
  FaGamepad,
  FaChartBar,
  FaTrophy,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

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
  const { user, logout, isCoach } = useContext(AuthContext);

  return (
    <div
      style={{
        width: "250px",
        background: "#111827",
        color: "white",
        height: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
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

      {isCoach && (
        <NavLink
          to="/matches"
          style={({ isActive }) => ({
            ...linkStyle,
            background: isActive ? "#374151" : "transparent",
          })}
        >
          <FaGamepad /> Add Match
        </NavLink>
      )}

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

      {/* Bottom Section */}
      <div style={{ marginTop: "auto" }}>
        <hr style={{ borderColor: "#374151", marginBottom: "15px" }} />

        <p
          style={{
            fontSize: "13px",
            color: "#9CA3AF",
            marginBottom: "12px",
            wordBreak: "break-word",
          }}
        >
          {user?.email}
        </p>

        <button
          onClick={logout}
          style={{
            width: "100%",
            background: "#DC2626",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;