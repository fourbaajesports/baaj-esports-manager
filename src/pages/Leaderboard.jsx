import { useContext, useState } from "react";
import { MatchContext } from "../context/MatchContext";

function Leaderboard() {
  const { players } = useContext(MatchContext);

  const [tab, setTab] = useState("kills");

  const sortedPlayers = [...players].sort((a, b) => {
    if (tab === "kills") {
      return b.totalKills - a.totalKills;
    }

    return b.performancePoints - a.performancePoints;
  });

  const medal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="p-8 text-white">

      <h1 className="mb-8 text-4xl font-bold text-yellow-400">
        🏆 Leaderboard
      </h1>

      <div className="mb-8 flex gap-4">

        <button
          onClick={() => setTab("kills")}
          className={`rounded-lg px-6 py-3 font-bold ${
            tab === "kills"
              ? "bg-yellow-500 text-black"
              : "bg-slate-700"
          }`}
        >
          🔥 Kill Leaderboard
        </button>

        <button
          onClick={() => setTab("performance")}
          className={`rounded-lg px-6 py-3 font-bold ${
            tab === "performance"
              ? "bg-yellow-500 text-black"
              : "bg-slate-700"
          }`}
        >
          ⭐ Performance
        </button>

      </div>

      <div className="space-y-4">

        {sortedPlayers.map((player, index) => (

          <div
            key={player.id}
            className="flex items-center justify-between rounded-xl bg-slate-800 p-5"
          >

            <div className="flex items-center gap-5">

              <div className="text-3xl">
                {medal(index)}
              </div>

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

              {tab === "kills" ? (
                <>
                  <p className="text-3xl font-bold text-yellow-400">
                    {player.totalKills}
                  </p>

                  <p>Total Kills</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-yellow-400">
                    {player.performancePoints}
                  </p>

                  <p>Performance</p>
                </>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Leaderboard;