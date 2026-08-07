import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, isCoach } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-700 bg-slate-900/90 px-8 py-5 backdrop-blur">

      <div>
        <h1 className="text-2xl font-bold text-white">
          {isCoach ? "👑 Coach Dashboard" : "🎮 Player Dashboard"}
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Welcome back to 4 Baaj Esports Manager
        </p>
      </div>

      <div className="hidden rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 md:block">
        <p className="text-xs uppercase tracking-wider text-gray-500">
          Logged In
        </p>

        <p className="max-w-[250px] truncate text-sm text-white">
          {user?.email}
        </p>
      </div>

    </header>
  );
}

export default Navbar;