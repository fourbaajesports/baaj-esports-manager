import { useContext } from "react";
import { useParams } from "react-router-dom";
import { MatchContext } from "../context/MatchContext";

function PlayerDetails() {
  const { id } = useParams();

  const { players, matches } = useContext(MatchContext);

  const player = players.find(
    (p) => p.id === Number(id)
  );

  if (!player) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-3xl font-bold text-red-500">
          Player Not Found
        </h1>
      </div>
    );
  }

  const playerMatches = matches.filter(
    (match) =>
      match.playerKills &&
      match.playerKills[player.id] !== undefined
  );

  const totalMatches = playerMatches.length;

  const totalKills = playerMatches.reduce(
    (sum, match) =>
      sum + Number(match.playerKills[player.id] || 0),
    0
  );

  const averageKills =
    totalMatches > 0
      ? (totalKills / totalMatches).toFixed(2)
      : "0.00";

  const top8 = playerMatches.filter(
    (match) => Number(match.placement) <= 8
  ).length;

  const chicken = playerMatches.filter(
    (match) => Number(match.placement) === 1
  ).length;

  return (
    <div className="p-8 text-white">

      <h1 className="mb-8 text-4xl font-bold text-yellow-400">
        👤 {player.name}
      </h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">

        <div className="rounded-xl bg-slate-800 p-6">

          <h2 className="mb-4 text-2xl font-bold text-yellow-400">
            Player Information
          </h2>

          <div className="space-y-3 text-lg">

            <p>
              <span className="font-semibold text-gray-400">
                IGN :
              </span>{" "}
              {player.ign}
            </p>

            <p>
              <span className="font-semibold text-gray-400">
                Role :
              </span>{" "}
              {player.role}
            </p>

            <p>
              <span className="font-semibold text-gray-400">
                Status :
              </span>{" "}
              {player.active ? "🟢 Playing" : "🟡 Rotation"}
            </p>

          </div>

        </div>

        <div className="rounded-xl bg-slate-800 p-6">

          <h2 className="mb-4 text-2xl font-bold text-yellow-400">
            Performance
          </h2>

          <div className="space-y-3 text-lg">

            <p>
              <span className="font-semibold text-gray-400">
                Matches Played :
              </span>{" "}
              {totalMatches}
            </p>

            <p>
              <span className="font-semibold text-gray-400">
                Total Kills :
              </span>{" "}
              {totalKills}
            </p>

            <p>
              <span className="font-semibold text-gray-400">
                Average Kills :
              </span>{" "}
              {averageKills}
            </p>

            <p>
              <span className="font-semibold text-gray-400">
                Top 8 Finishes :
              </span>{" "}
              {top8}
            </p>

            <p>
              <span className="font-semibold text-gray-400">
                Chicken Dinners :
              </span>{" "}
              {chicken}
            </p>

            <p>
              <span className="font-semibold text-gray-400">
                Performance Points :
              </span>{" "}
              {player.performancePoints}
            </p>

          </div>

        </div>

      </div>

      <div className="rounded-xl bg-slate-800 p-6">

        <h2 className="mb-5 text-2xl font-bold text-yellow-400">
          📜 Recent Matches
        </h2>
                {playerMatches.length === 0 ? (
          <p className="text-gray-400">
            No matches played yet.
          </p>
        ) : (
          <div className="space-y-4">
            {playerMatches
              .slice()
              .reverse()
              .slice(0, 5)
              .map((match) => (
                <div
                  key={match.id}
                  className="rounded-lg bg-slate-700 p-4"
                >
                  <div className="flex items-center justify-between">

                    <div>
                      <h3 className="text-lg font-bold text-yellow-400">
                        {match.tournament || "Scrim"}
                      </h3>

                      <p className="text-gray-300">
                        🗺️ {match.map}
                      </p>

                      <p className="text-gray-300">
                        📅 {match.date}
                      </p>
                    </div>

                    <div className="text-right">

                      <p>
                        🏆 #{match.placement}
                      </p>

                      <p>
                        🔥 {match.playerKills[player.id] ?? 0} Kills
                      </p>

                      <p>
                        👥 Team {match.teamKills} Kills
                      </p>

                    </div>

                  </div>
                </div>
              ))}
          </div>
        )}

      </div>

    </div>
  );
}

export default PlayerDetails;