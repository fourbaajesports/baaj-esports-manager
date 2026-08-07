import { FaBars } from "react-icons/fa";

function Navbar({ setSidebarOpen }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-700 bg-slate-900 px-4 md:px-6">

      {/* Left Side */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-white transition hover:bg-slate-700 lg:hidden"
        >
          <FaBars size={20} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-white md:text-2xl">
            Coach Dashboard 👑
          </h1>

          <p className="hidden text-sm text-gray-400 md:block">
            Welcome back to 4 Baaj Esports Manager
          </p>
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