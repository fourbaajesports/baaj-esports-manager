import { useContext } from "react";
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
import MatchEntry from "./pages/MatchEntry";
import Matches from "./pages/Matches";
import Leaderboard from "./pages/Leaderboard";
import Analytics from "./pages/Analytics";

function App() {
  const { user, isCoach } = useContext(AuthContext);

  // Login nahi hua
  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 bg-slate-900 text-white">
          <Navbar />

          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/players" element={<Players />} />

            <Route
              path="/matches"
              element={
                isCoach ? (
                  <MatchEntry />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route path="/history" element={<Matches />} />

            <Route path="/leaderboard" element={<Leaderboard />} />

            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;