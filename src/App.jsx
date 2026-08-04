import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Players from "./pages/Players";
import MatchEntry from "./pages/MatchEntry";
import Matches from "./pages/Matches";
import Leaderboard from "./pages/Leaderboard";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">

        <Sidebar />

        <div className="flex-1 bg-slate-900 text-white">

          <Navbar />

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/players"
              element={<Players />}
            />

            <Route
              path="/matches"
              element={<MatchEntry />}
            />

            <Route
              path="/history"
              element={<Matches />}
            />

            <Route
              path="/leaderboard"
              element={<Leaderboard />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

          </Routes>

        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;