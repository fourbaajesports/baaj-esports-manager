import { useContext } from "react";
import StatCard from "../components/StatCard";
import { MatchContext } from "../context/MatchContext";

function Dashboard() {
  const { matches, players } = useContext(MatchContext);

  // --------------------------
  // Basic Stats
  // --------------------------

  const totalMatches = matches.length;

  const totalKills = matches.reduce(
    (sum, match) => sum + Number(match.teamKills || 0),
    0
  );

  const totalPerformance = players.reduce(
    (sum, player) => sum + Number(player.performancePoints || 0),
    0
  );

  const totalChicken = matches.filter(
    (match) => Number(match.placement) === 1
  ).length;

  const averagePlacement =
    totalMatches === 0
      ? "-"
      : (
          matches.reduce(
            (sum, match) => sum + Number(match.placement),
            0
          ) / totalMatches
        ).toFixed(2);

  // --------------------------
  // MVP
  // --------------------------

  const currentMVP =
    [...players].sort(
      (a, b) => b.performancePoints - a.performancePoints
    )[0];

  // --------------------------
  // Leaderboards
  // --------------------------

  const killLeaderboard = [...players]
    .sort((a, b) => b.totalKills - a.totalKills)
    .slice(0, 5);

  const performanceLeaderboard = [...players]
    .sort(
      (a, b) => b.performancePoints - a.performancePoints
    )
    .slice(0, 5);

  // --------------------------
  // Recent Matches
  // --------------------------

  const recentMatches = [...matches]
    .reverse()
    .slice(0, 5);

  return (    <div className="p-8 text-white">

      <h1 className="mb-8 text-4xl font-bold text-yellow-400">
        🦅 4 Baaj Dashboard
      </h1>

      {/* Top Cards */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        <StatCard
          title="📅 Total Matches"
          value={totalMatches}
        />

        <StatCard
          title="🔥 Team Kills"
          value={totalKills}
        />

        <StatCard
          title="⭐ Team Performance"
          value={totalPerformance}
        />

        <StatCard
          title="🏆 Chicken Dinners"
          value={totalChicken}
        />

        <StatCard
          title="🎯 Avg Placement"
          value={averagePlacement}
        />

        <StatCard
          title="👑 Current MVP"
          value={
            currentMVP
              ? currentMVP.name
              : "-"
          }
        />

      </div>

      {/* Bottom Grid */}

      <div className="mt-10 grid gap-6 lg:grid-cols-3">

        {/* Kill Leaderboard */}

        <div className="rounded-xl bg-slate-800 p-6">

          <h2 className="mb-5 text-2xl font-bold text-yellow-400">
            🔥 Kill Leaderboard
          </h2>

          <div className="space-y-3">

            {killLeaderboard.map((player, index) => (

              <div
                key={player.id}
                className="flex justify-between rounded-lg bg-slate-700 p-3"
              >

                <span>

                  {index === 0 && "🥇 "}
                  {index === 1 && "🥈 "}
                  {index === 2 && "🥉 "}
                  {index > 2 && `#${index + 1} `}

                  {player.name}

                </span>

                <span className="font-bold text-yellow-400">
                  {player.totalKills}
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* Performance Leaderboard */}

        <div className="rounded-xl bg-slate-800 p-6">

          <h2 className="mb-5 text-2xl font-bold text-yellow-400">
            ⭐ Performance
          </h2>

          <div className="space-y-3">

            {performanceLeaderboard.map((player, index) => (

              <div
                key={player.id}
                className="flex justify-between rounded-lg bg-slate-700 p-3"
              >

                <span>

                  {index === 0 && "🥇 "}
                  {index === 1 && "🥈 "}
                  {index === 2 && "🥉 "}
                  {index > 2 && `#${index + 1} `}

                  {player.name}

                </span>

                <span className="font-bold text-yellow-400">
                  {player.performancePoints}
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* Recent Matches */}

        <div className="rounded-xl bg-slate-800 p-6">

          <h2 className="mb-5 text-2xl font-bold text-yellow-400">
            🕒 Recent Matches
          </h2>

          {recentMatches.length === 0 ? (

            <p className="text-gray-400">
              No Matches Yet
            </p>

          ) : (

            <div className="space-y-3">

              {recentMatches.map((match) => (

                <div
                  key={match.id}
                  className="rounded-lg bg-slate-700 p-3"
                >

                  <h3 className="font-bold">
                    {match.tournament}
                  </h3>

                  <p className="text-sm text-gray-300">
                    🗺 {match.map}
                  </p>

                  <p className="text-sm">
                    🏆 #{match.placement}
                  </p>

                  <p className="text-sm">
                    🔥 {match.teamKills} Kills
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;