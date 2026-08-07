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

function Sidebar() {
  const { user, logout, isCoach } = useContext(AuthContext);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
      isActive
        ? "bg-yellow-500 text-black font-semibold shadow-lg"
        : "text-gray-300 hover:bg-slate-700 hover:text-white"
    }`;

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-700 bg-slate-900 p-5">

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-yellow-400">
          🦅 4 Baaj
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Esports Manager
        </p>
      </div>

      <nav className="space-y-2">

        <NavLink to="/" className={navClass}>
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink to="/players" className={navClass}>
          <FaUsers />
          Players
        </NavLink>

        {isCoach && (
          <NavLink to="/matches" className={navClass}>
            <FaGamepad />
            Add Match
          </NavLink>
        )}

        <NavLink to="/history" className={navClass}>
          <FaGamepad />
          Match History
        </NavLink>

        <NavLink to="/leaderboard" className={navClass}>
          <FaTrophy />
          Leaderboard
        </NavLink>

        <NavLink to="/analytics" className={navClass}>
          <FaChartBar />
          Analytics
        </NavLink>

      </nav>

      <div className="mt-auto rounded-xl border border-slate-700 bg-slate-800 p-4">

        <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
          Logged in as
        </p>

        <p className="truncate text-sm text-gray-300">
          {user?.email}
        </p>

        <button
          onClick={logout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold transition-all duration-300 hover:scale-105 hover:bg-red-500"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;