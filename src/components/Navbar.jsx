import { FaBars } from "react-icons/fa";
import logo from "../assets/logo.png";

function Navbar({ setSidebarOpen }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#050505]/90 backdrop-blur-xl">
      <div className="relative flex h-20 items-center justify-between px-4 md:px-8">

        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#19c77a]/70 to-transparent" />

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* Mobile menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="group flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.03] text-gray-300 transition-all duration-300 hover:border-[#19c77a]/40 hover:bg-[#19c77a]/10 hover:text-[#19c77a] lg:hidden"
            aria-label="Open menu"
          >
            <FaBars
              size={18}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </button>

          {/* SOUL BRAND */}
          <div className="flex items-center gap-4">

            {/* Actual SOUL Logo */}
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden">
              <img
                src={logo}
                alt="SOUL Esports"
                className="h-full w-full object-contain"
              />
            </div>

            {/* Brand text */}
            <div className="leading-none">
              <div className="flex items-baseline gap-2">
                <h1 className="text-xl font-black tracking-[0.18em] text-white md:text-2xl">
                  SOUL
                </h1>

                <span className="hidden text-[9px] font-bold uppercase tracking-[0.3em] text-[#19c77a] sm:inline">
                  Esports
                </span>
              </div>

              <p className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.28em] text-gray-600 md:block">
                Bharat Ki Sarvasresht Team
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* Online status */}
          <div className="flex items-center gap-3 border border-white/5 bg-white/[0.025] px-4 py-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#19c77a] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#19c77a]" />
            </span>

            <div className="leading-none">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                System
              </p>

              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#19c77a]">
                Online
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;