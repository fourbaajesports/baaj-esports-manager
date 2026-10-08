import {
  FaHome,
  FaUsers,
  FaGamepad,
  FaChartBar,
  FaTrophy,
  FaTimes,
  FaLock,
  FaCog,
  FaPlus,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, isCoach, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeSidebar();
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    `group relative flex items-center gap-3 overflow-hidden border px-4 py-3.5 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-300 ${
      isActive
        ? "border-[#19c77a]/30 bg-[#19c77a]/10 text-[#19c77a]"
        : "border-transparent text-gray-500 hover:border-white/10 hover:bg-white/[0.03] hover:text-white"
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col border-r border-white/10 bg-[#050505] transition-transform duration-500 ease-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#19c77a]/5 blur-[100px]" />

          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex h-full flex-col">

          {/* Header */}
          <div className="border-b border-white/10 px-6 py-6">
            <div className="flex items-center justify-between">

              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center">
                  <img
                    src={logo}
                    alt="SOUL Esports"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="leading-none">
                  <div className="flex items-baseline gap-2">
                    <h1 className="text-xl font-black tracking-[0.16em] text-white">
                      SOUL
                    </h1>

                    <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#19c77a]">
                      Esports
                    </span>
                  </div>

                  <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-gray-700">
                    Competitive Hub
                  </p>
                </div>
              </div>

              {/* Mobile Close */}
              <button
                onClick={closeSidebar}
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition-all duration-300 hover:border-[#19c77a]/40 hover:bg-[#19c77a]/10 hover:text-[#19c77a] lg:hidden"
                aria-label="Close menu"
              >
                <FaTimes size={15} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          {/* IMPORTANT: No overflow-y-auto here */}
          <div className="flex-1 px-4 py-7">

            {/* Main Navigation */}
            <div>
              <div className="mb-3 flex items-center gap-3 px-2">
                <span className="h-px w-6 bg-[#19c77a]" />

                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">
                  Main
                </p>
              </div>

              <nav className="space-y-1">

                <SidebarLink
                  to="/"
                  icon={<FaHome />}
                  label="Dashboard"
                  navClass={navClass}
                  onClick={closeSidebar}
                />

                <SidebarLink
                  to="/players"
                  icon={<FaUsers />}
                  label="Players"
                  navClass={navClass}
                  onClick={closeSidebar}
                />

                <SidebarLink
                  to="/history"
                  icon={<FaGamepad />}
                  label="Match History"
                  navClass={navClass}
                  onClick={closeSidebar}
                />

                <SidebarLink
                  to="/tournaments"
                  icon={<FaTrophy />}
                  label="Tournaments"
                  navClass={navClass}
                  onClick={closeSidebar}
                />

                <SidebarLink
                  to="/leaderboard"
                  icon={<FaTrophy />}
                  label="Leaderboard"
                  navClass={navClass}
                  onClick={closeSidebar}
                />

                <SidebarLink
                  to="/analytics"
                  icon={<FaChartBar />}
                  label="Analytics"
                  navClass={navClass}
                  onClick={closeSidebar}
                />

                <SidebarLink
                  to="/tournament-comparison"
                  icon={<FaChartBar />}
                  label="Tournament Comparison"
                  navClass={navClass}
                  onClick={closeSidebar}
                />

              </nav>
            </div>

            {/* Management / Admin */}
            <div className="mt-9">

              <div className="mb-3 flex items-center gap-3 px-2">
                <span className="h-px w-6 bg-[#d4af37]" />

                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">
                  Management
                </p>
              </div>

              {isCoach && user ? (
                <nav className="space-y-1">

                  <SidebarLink
                    to="/admin"
                    icon={<FaCog />}
                    label="Admin Panel"
                    navClass={navClass}
                    onClick={closeSidebar}
                  />

                  <SidebarLink
                    to="/admin/matches"
                    icon={<FaPlus />}
                    label="Add Match"
                    navClass={navClass}
                    onClick={closeSidebar}
                  />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-3 border border-transparent px-4 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-gray-500 transition-all duration-300 hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-400"
                  >
                    <span className="flex w-5 justify-center text-sm transition-transform duration-300 group-hover:-translate-x-0.5">
                      <FaSignOutAlt />
                    </span>

                    <span>Logout</span>
                  </button>

                </nav>
              ) : (
                <NavLink
                  to="/login"
                  onClick={closeSidebar}
                  className="group flex items-center justify-center gap-3 border border-white/10 bg-white/[0.02] px-4 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-gray-500 transition-all duration-300 hover:border-[#d4af37]/40 hover:bg-[#d4af37]/5 hover:text-[#d4af37]"
                >
                  <FaLock className="transition-transform duration-300 group-hover:scale-110" />

                  <span>Admin Login</span>
                </NavLink>
              )}

            </div>
          </div>

          {/* Bottom Status */}
          <div className="border-t border-white/10 p-5">

            <div className="relative overflow-hidden border border-white/10 bg-[#080808] px-4 py-4">

              <div className="absolute left-0 top-0 h-full w-[2px] bg-[#19c77a]" />

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.25em] text-gray-700">
                    System Status
                  </p>

                  <div className="mt-2 flex items-center gap-2">

                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#19c77a] opacity-50" />

                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#19c77a]" />
                    </span>

                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#19c77a]">
                      Online
                    </span>

                  </div>
                </div>

                <span className="text-[9px] font-black text-gray-700">
                  SOUL
                </span>

              </div>
            </div>

            <p className="mt-4 text-center text-[8px] font-semibold uppercase tracking-[0.25em] text-gray-800">
              Competitive Performance System
            </p>

          </div>

        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  to,
  icon,
  label,
  navClass,
  onClick,
}) {
  return (
    <NavLink
      to={to}
      className={navClass}
      onClick={onClick}
    >
      {({ isActive }) => (
        <>
          {/* Active Indicator */}
          <span
            className={`absolute left-0 top-0 h-full w-[2px] bg-[#19c77a] transition-opacity duration-300 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Icon */}
          <span
            className={`flex w-5 justify-center text-sm transition-all duration-300 ${
              isActive
                ? "text-[#19c77a]"
                : "text-gray-600 group-hover:text-[#19c77a]"
            }`}
          >
            {icon}
          </span>

          {/* Label */}
          <span className="truncate">
            {label}
          </span>

          {/* Active Dot */}
          <span
            className={`ml-auto h-1.5 w-1.5 rounded-full bg-[#19c77a] shadow-[0_0_10px_#19c77a] transition-all duration-300 ${
              isActive
                ? "scale-100 opacity-100"
                : "scale-0 opacity-0"
            }`}
          />
        </>
      )}
    </NavLink>
  );
}

export default Sidebar;