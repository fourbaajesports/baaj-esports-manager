import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MatchContext } from "../context/MatchContext";

function Players() {
  const { players } = useContext(MatchContext);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-yellow-400">
          👥 Players
        </h1>

        <p className="mt-2 text-gray-400">
          Click on any player to view detailed statistics.
        </p>
      </div>

      {/* Desktop Table */}

      <div className="hidden overflow-x-auto rounded-2xl border border-slate-700 bg-slate-800 lg:block">

        <table className="w-full">

          <thead className="bg-slate-700">

            <tr className="text-left">

              <th className="p-4">Player</th>
              <th>Role</th>
              <th>IGN</th>
              <th>Matches</th>
              <th>Kills</th>
              <th>Performance</th>
              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            {players.map((player) => (

              <tr
                key={player.id}
                onClick={() =>
                  navigate(`/players/${player.id}`)
                }
                className="cursor-pointer border-t border-slate-700 transition hover:bg-slate-700"
              >

                <td className="p-4 font-semibold text-yellow-400">
                  {player.name}
                </td>

                <td>{player.role}</td>

                <td>{player.ign}</td>

                <td>{player.matchesPlayed}</td>

                <td>{player.totalKills}</td>

                <td>{player.performancePoints}</td>

                <td>
                  {player.active ? (
                    <span className="text-green-400">
                      🟢 Playing
                    </span>
                  ) : (
                    <span className="text-yellow-400">
                      🟡 Rotation
                    </span>
                  )}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Mobile Cards */}

      <div className="grid gap-4 lg:hidden">

        {players.map((player) => (

          <div
            key={player.id}
            onClick={() =>
              navigate(`/players/${player.id}`)
            }
            className="cursor-pointer rounded-2xl border border-slate-700 bg-slate-800 p-5 transition hover:border-yellow-400 hover:bg-slate-700"
          >

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-yellow-400">
                  {player.name}
                </h2>

                <p className="text-sm text-gray-400">
                  {player.ign}
                </p>

              </div>

              <div>

                {player.active ? (
                  <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold">
                    Playing
                  </span>
                ) : (
                  <span className="rounded-full bg-yellow-600 px-3 py-1 text-xs font-semibold">
                    Rotation
                  </span>
                )}

              </div>

            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">

              <div>
                <p className="text-gray-400">
                  Role
                </p>

                <p className="font-semibold">
                  {player.role}
                </p>
              </div>

              <div>
                <p className="text-gray-400">
                  Matches
                </p>

                <p className="font-semibold">
                  {player.matchesPlayed}
                </p>
              </div>

              <div>
                <p className="text-gray-400">
                  Kills
                </p>

                <p className="font-semibold text-yellow-400">
                  {player.totalKills}
                </p>
              </div>

              <div>
                <p className="text-gray-400">
                  Performance
                </p>

                <p className="font-semibold text-yellow-400">
                  {player.performancePoints}
                </p>
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Players;