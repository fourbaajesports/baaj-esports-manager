import { FaBars } from "react-icons/fa";
import logo from "../assets/logo.png";

function Navbar({ setSidebarOpen }) {
  return (
    <header className="flex items-center justify-between">

      {/* Left Side */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-white transition hover:bg-slate-700 lg:hidden"
        >
          <FaBars size={20} />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-3">

          {/* 4 Baaj Logo */}
          <img
            src={logo}
            alt="4 Baaj Esports"
            className="h-10 w-10 rounded-lg object-cover"
          />

          <div>
            <h1 className="text-lg font-bold text-white md:text-2xl">
              4 Baaj
            </h1>

            <p className="hidden text-sm text-gray-400 md:block">
              Esports Manager
            </p>
          </div>

        </div>

      </div>

      {/* Right Side */}
      <div className="hidden items-center gap-3 md:flex">

        <div className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-black">
          ONLINE
        </div>

      </div>

    </header>
  );
}

export default Navbar;