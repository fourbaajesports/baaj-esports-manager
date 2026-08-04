import { useContext } from "react";
import { MatchContext } from "../context/MatchContext";

function Leaderboard() {
  const { players } = useContext(MatchContext);

  const sortedPlayers = [...players].sort(
    (a, b) => b.totalKills - a.totalKills
  );

  return (
    <div className="p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold text-yellow-400">
        🏆 Kill Leaderboard
      </h1>

      <div className="space-y-4">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className="flex items-center justify-between rounded-xl bg-slate-800 p-5"
          >
            <div className="flex items-center gap-5">
              <h2 className="text-2xl font-bold text-yellow-400">
                #{index + 1}
              </h2>

              <div>
                <h2 className="text-xl font-bold">
                  {player.name}
                </h2>

                <p className="text-gray-400">
                  {player.role}
                </p>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-3xl font-bold text-yellow-400">
                {player.totalKills}
              </h2>

              <p>Total Kills</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;