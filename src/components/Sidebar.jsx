import { useContext } from "react";
import {
  FaHome,
  FaUsers,
  FaGamepad,
  FaChartBar,
  FaTrophy,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout, isCoach } = useContext(AuthContext);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
      isActive
        ? "bg-yellow-500 text-black font-semibold shadow-lg"
        : "text-gray-300 hover:bg-slate-700 hover:text-white"
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-700 bg-slate-900 p-5 transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Close Button */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <h1 className="text-xl font-bold text-yellow-400">
            🦅 4 Baaj
          </h1>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl text-white"
          >
            <FaTimes />
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="mb-8 hidden lg:block">
          <h1 className="text-2xl font-extrabold text-yellow-400">
            🦅 4 Baaj
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Esports Manager
          </p>
        </div>

        <nav className="space-y-2">

          <NavLink
            to="/"
            className={navClass}
            onClick={() => setSidebarOpen(false)}
          >
            <FaHome />
            Dashboard
          </NavLink>

          <NavLink
            to="/players"
            className={navClass}
            onClick={() => setSidebarOpen(false)}
          >
            <FaUsers />
            Players
          </NavLink>

          {isCoach && (
            <NavLink
              to="/matches"
              className={navClass}
              onClick={() => setSidebarOpen(false)}
            >
              <FaGamepad />
              Add Match
            </NavLink>
          )}

          <NavLink
            to="/history"
            className={navClass}
            onClick={() => setSidebarOpen(false)}
          >
            <FaGamepad />
            Match History
          </NavLink>

          <NavLink
            to="/leaderboard"
            className={navClass}
            onClick={() => setSidebarOpen(false)}
          >
            <FaTrophy />
            Leaderboard
          </NavLink>

          <NavLink
            to="/analytics"
            className={navClass}
            onClick={() => setSidebarOpen(false)}
          >
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
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold transition-all duration-300 hover:bg-red-500"
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;