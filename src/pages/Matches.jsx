import { useContext } from "react";
import { MatchContext } from "../context/MatchContext";
import { AuthContext } from "../context/AuthContext";
import { FaTrash, FaEdit } from "react-icons/fa";

function Matches() {
  const { matches, players, deleteMatch } =
    useContext(MatchContext);

  const { isCoach } = useContext(AuthContext);

  return (
    <div className="p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold text-yellow-400">
        🎮 Match History
      </h1>

      {matches.length === 0 ? (
        <div className="rounded-xl bg-slate-800 p-8 text-center text-gray-400">
          No Matches Played Yet
        </div>
      ) : (
        <div className="space-y-6">
          {matches
            .slice()
            .reverse()
            .map((match) => (
              <div
                key={match.id}
                className="rounded-xl bg-slate-800 p-6"
              >
                <div className="flex items-center justify-between">

                  <h2 className="text-2xl font-bold text-yellow-400">
                    {match.tournament}
                  </h2>

                  {isCoach && (
                    <div className="flex gap-3">

                      <button
                        className="rounded-lg bg-blue-600 p-2 hover:bg-blue-500"
                        onClick={() =>
                          alert("Edit Match feature coming soon 🚀")
                        }
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="rounded-lg bg-red-600 p-2 hover:bg-red-500"
                        onClick={() => deleteMatch(match.id)}
                      >
                        <FaTrash />
                      </button>

                    </div>
                  )}

                </div>

                <div className="mt-4 space-y-2">
                  <p>🗺️ Map : {match.map}</p>
                  <p>🏆 Placement : #{match.placement}</p>
                  <p>🔥 Team Kills : {match.teamKills}</p>
                  <p>📅 {match.date}</p>
                </div>

                <hr className="my-5 border-slate-700" />

                <h3 className="mb-3 text-xl font-semibold">
                  👥 Player Performance
                </h3>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {players.map((player) => {
                    const stats =
                      match.playerStats?.[player.id] || {};

                    return (
                      <div
                        key={player.id}
                        className="rounded-lg bg-slate-700 p-3"
                      >
                        <div className="flex justify-between">
                          <span>{player.name}</span>

                          <span className="font-bold text-yellow-400">
                            {stats.kills || 0} Kills
                          </span>
                        </div>

                        <div className="mt-2 space-y-1 text-sm text-gray-300">

                          <p>
                            Room Join :{" "}
                            {stats.roomJoin ? "✅" : "❌"}
                          </p>

                          <p>
                            Chicken :{" "}
                            {stats.chicken ? "🏆" : "—"}
                          </p>

                          <p>
                            Penalty :{" "}
                            {stats.penalty ? "❌ Yes" : "No"}
                          </p>

                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Matches;