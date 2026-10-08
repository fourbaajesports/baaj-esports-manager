import { useContext, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Admin from "./pages/Admin";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Players from "./pages/Players";
import PlayerDetails from "./pages/PlayerDetails";
import MatchEntry from "./pages/MatchEntry";
import Matches from "./pages/Matches";
import Leaderboard from "./pages/Leaderboard";
import Analytics from "./pages/Analytics";
import TournamentComparison from "./pages/TournamentComparison";
import Tournaments from "./pages/Tournaments";
import TournamentDetails from "./pages/TournamentDetails";

function App() {
  const { user, isCoach } = useContext(AuthContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#050505]">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="min-w-0 flex-1">
          <Navbar
            setSidebarOpen={setSidebarOpen}
          />

          <div className="p-4 md:p-6">
            <Routes>

              {/* =========================
                  PUBLIC WEBSITE ROUTES
              ========================= */}

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
                path="/history"
                element={<Matches />}
              />

              <Route
                path="/tournaments"
                element={<Tournaments />}
              />

              <Route
                path="/tournaments/:tournament"
                element={<TournamentDetails />}
              />

              <Route
                path="/tournament-comparison"
                element={<TournamentComparison />}
              />

              <Route
                path="/leaderboard"
                element={<Leaderboard />}
              />

              <Route
                path="/analytics"
                element={<Analytics />}
              />


              {/* =========================
                  ADMIN LOGIN
              ========================= */}

              <Route
                path="/login"
                element={
                  user && isCoach ? (
                    <Navigate
                      to="/admin"
                      replace
                    />
                  ) : (
                    <Login />
                  )
                }
              />


              {/* =========================
                  PROTECTED ADMIN ROUTES
              ========================= */}

              <Route
                path="/admin"
                element={
                  user && isCoach ? (
                    <Admin />
                  ) : (
                    <Navigate
                      to="/login"
                      replace
                    />
                  )
                }
              />

              <Route
                path="/admin/matches"
                element={
                  user && isCoach ? (
                    <MatchEntry />
                  ) : (
                    <Navigate
                      to="/login"
                      replace
                    />
                  )
                }
              />

              <Route
                path="/admin/edit-match/:id"
                element={
                  user && isCoach ? (
                    <MatchEntry />
                  ) : (
                    <Navigate
                      to="/login"
                      replace
                    />
                  )
                }
              />


              {/* =========================
                  UNKNOWN ROUTE
              ========================= */}

              <Route
                path="*"
                element={
                  <Navigate
                    to="/"
                    replace
                  />
                }
              />

            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;