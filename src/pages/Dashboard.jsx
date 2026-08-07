import { useContext } from "react";
import StatCard from "../components/StatCard";
import { MatchContext } from "../context/MatchContext";

function Dashboard() {
  const { matches, players } = useContext(MatchContext);

  // ==========================
  // Basic Stats
  // ==========================

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

  // ==========================
  // MVP
  // ==========================

  const currentMVP = [...players].sort(
    (a, b) => b.performancePoints - a.performancePoints
  )[0];

  // ==========================
  // Leaderboards
  // ==========================

  const killLeaderboard = [...players]
    .sort((a, b) => b.totalKills - a.totalKills)
    .slice(0, 5);

  const performanceLeaderboard = [...players]
    .sort((a, b) => b.performancePoints - a.performancePoints)
    .slice(0, 5);

  // ==========================
  // Recent Matches
  // ==========================

  const recentMatches = [...matches]
    .reverse()
    .slice(0, 5);

  return (
    <div className="space-y-8 p-6 text-white md:p-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-extrabold text-yellow-400">
          🦅 4 Baaj Dashboard
        </h1>

        <p className="mt-2 text-gray-400">
          Welcome back, Coach. Here's your team's latest performance.
        </p>

      </div>

      {/* Top Cards */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

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
          value={currentMVP ? currentMVP.name : "-"}
        />

      </div>

      {/* Bottom Grid */}

      <div className="grid gap-6 xl:grid-cols-3">

        {/* Kill Leaderboard */}

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-yellow-500/10">

          <h2 className="mb-5 text-2xl font-bold text-yellow-400">
            🔥 Kill Leaderboard
          </h2>

          <div className="space-y-3">            {killLeaderboard.map((player, index) => (

              <div
                key={player.id}
                className="flex items-center justify-between rounded-xl bg-slate-700 p-4 transition-all duration-300 hover:bg-slate-600"
              >

                <span className="font-medium">

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

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-yellow-500/10">

          <h2 className="mb-5 text-2xl font-bold text-yellow-400">
            ⭐ Performance Leaderboard
          </h2>

          <div className="space-y-3">

            {performanceLeaderboard.map((player, index) => (

              <div
                key={player.id}
                className="flex items-center justify-between rounded-xl bg-slate-700 p-4 transition-all duration-300 hover:bg-slate-600"
              >

                <span className="font-medium">

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

        </div>        {/* Recent Matches */}

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-yellow-500/10">

          <h2 className="mb-5 text-2xl font-bold text-yellow-400">
            🕒 Recent Matches
          </h2>

          {recentMatches.length === 0 ? (

            <div className="rounded-xl border border-dashed border-slate-600 p-6 text-center text-gray-400">
              No matches have been played yet.
            </div>

          ) : (

            <div className="space-y-3">

              {recentMatches.map((match) => (

                <div
                  key={match.id}
                  className="rounded-xl bg-slate-700 p-4 transition-all duration-300 hover:bg-slate-600"
                >

                  <h3 className="font-bold text-yellow-400">
                    {match.tournament}
                  </h3>

                  <p className="mt-1 text-sm text-gray-300">
                    🗺️ {match.map}
                  </p>

                  <p className="text-sm">
                    🏆 Placement #{match.placement}
                  </p>

                  <p className="text-sm">
                    🔥 Team Kills: {match.teamKills}
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