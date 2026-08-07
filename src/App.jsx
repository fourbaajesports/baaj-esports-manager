import { useContext, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Players from "./pages/Players";
import PlayerDetails from "./pages/PlayerDetails";
import MatchEntry from "./pages/MatchEntry";
import Matches from "./pages/Matches";
import Leaderboard from "./pages/Leaderboard";
import Analytics from "./pages/Analytics";

function App() {
  const { user, isCoach } = useContext(AuthContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-900">

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="min-w-0 flex-1">

          <Navbar
            setSidebarOpen={setSidebarOpen}
          />

          <div className="overflow-y-auto p-4 md:p-6">

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
                path="/players/:id"
                element={<PlayerDetails />}
              />

              <Route
                path="/matches"
                element={
                  isCoach ? (
                    <MatchEntry />
                  ) : (
                    <Navigate
                      to="/"
                      replace
                    />
                  )
                }
              />

              <Route
                path="/edit-match/:id"
                element={
                  isCoach ? (
                    <MatchEntry />
                  ) : (
                    <Navigate
                      to="/"
                      replace
                    />
                  )
                }
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

        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;