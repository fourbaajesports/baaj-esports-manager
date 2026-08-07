import { useContext } from "react";
import { MatchContext } from "../context/MatchContext";
import { AuthContext } from "../context/AuthContext";
import { FaTrash, FaEdit } from "react-icons/fa";

function Matches() {
  const { matches, players, deleteMatch } =
    useContext(MatchContext);

  const { isCoach } = useContext(AuthContext);

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold text-yellow-400">
          🎮 Match History
        </h1>

        <p className="mt-2 text-gray-400">
          All played tournament matches.
        </p>

      </div>

      {matches.length === 0 ? (

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-10 text-center text-gray-400">
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
                className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg"
              >

                {/* Header */}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div>

                    <h2 className="text-2xl font-bold text-yellow-400">
                      {match.tournament}
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      📅 {match.date}
                    </p>

                  </div>

                  {isCoach && (

                    <div className="flex gap-3">

                      <button
                        className="rounded-lg bg-blue-600 p-3 transition hover:bg-blue-500"
                        onClick={() =>
                          alert("Edit Match coming soon 🚀")
                        }
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="rounded-lg bg-red-600 p-3 transition hover:bg-red-500"
                        onClick={() =>
                          deleteMatch(match.id)
                        }
                      >
                        <FaTrash />
                      </button>

                    </div>

                  )}

                </div>

                {/* Match Info */}

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  <div className="rounded-xl bg-slate-700 p-4">

                    <p className="text-sm text-gray-400">
                      Map
                    </p>

                    <p className="mt-1 font-bold">
                      🗺️ {match.map}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-700 p-4">

                    <p className="text-sm text-gray-400">
                      Placement
                    </p>

                    <p className="mt-1 font-bold text-yellow-400">
                      #{match.placement}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-700 p-4">

                    <p className="text-sm text-gray-400">
                      Team Kills
                    </p>

                    <p className="mt-1 font-bold text-yellow-400">
                      🔥 {match.teamKills}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-700 p-4">

                    <p className="text-sm text-gray-400">
                      Players
                    </p>

                    <p className="mt-1 font-bold">
                      {players.length}
                    </p>

                  </div>

                </div>

                {/* Players */}

                <h3 className="mt-8 mb-4 text-xl font-bold text-yellow-400">
                  👥 Player Performance
                </h3>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                  {players.map((player) => {

                    const stats =
                      match.playerStats?.[player.id] || {};

                    return (

                      <div
                        key={player.id}
                        className="rounded-xl border border-slate-600 bg-slate-700 p-4"
                      >

                        <div className="flex items-center justify-between">

                          <h4 className="font-bold">
                            {player.name}
                          </h4>

                          <span className="font-bold text-yellow-400">
                            {stats.kills || 0} 🔥
                          </span>

                        </div>

                        <div className="mt-4 space-y-2 text-sm">

                          <p>
                            Room Join :
                            {" "}
                            {stats.roomJoin ? "✅" : "❌"}
                          </p>

                          <p>
                            Chicken :
                            {" "}
                            {stats.chicken ? "🏆" : "—"}
                          </p>

                          <p>
                            Penalty :
                            {" "}
                            {stats.penalty
                              ? "❌ Yes"
                              : "No"}
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