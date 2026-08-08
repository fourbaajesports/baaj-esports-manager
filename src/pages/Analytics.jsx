import { useContext } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { MatchContext } from "../context/MatchContext";

function Analytics() {
  const { matches, players } = useContext(MatchContext);

  // ==========================
  // Team Stats
  // ==========================

  const totalMatches = matches.length;

  const totalKills = matches.reduce(
    (sum, match) => sum + Number(match.teamKills || 0),
    0
  );

  const totalPerformance = players.reduce(
    (sum, player) =>
      sum + Number(player.performancePoints || 0),
    0
  );

const placementPoints = {
  1: 10,
  2: 6,
  3: 5,
  4: 4,
  5: 3,
  6: 2,
  7: 1,
  8: 1,
};

  const averagePlacementPoints =
  totalMatches === 0
    ? 0
    : (
        matches.reduce(
          (sum, match) =>
            sum +
            (placementPoints[Number(match.placement)] || 0),
          0
        ) / totalMatches
      ).toFixed(2);

  const chickenCount = matches.filter(
    (m) => Number(m.placement) === 1
  ).length;

  const top8Count = matches.filter(
    (m) => Number(m.placement) <= 8
  ).length;

  const chickenRate =
    totalMatches === 0
      ? 0
      : (
          (chickenCount / totalMatches) *
          100
        ).toFixed(1);

  const top8Rate =
    totalMatches === 0
      ? 0
      : (
          (top8Count / totalMatches) *
          100
        ).toFixed(1);

  // ==========================
  // Charts
  // ==========================

  const matchChart = matches.map(
  (match, index) => ({
    match: `M${index + 1}`,
    kills: Number(match.teamKills),
    placementPoints:
      placementPoints[Number(match.placement)] || 0,
  })
);

  const pieData = players.map((player) => ({
    name: player.name,
    value: player.totalKills,
  }));

  const COLORS = [
    "#facc15",
    "#3b82f6",
    "#22c55e",
    "#ef4444",
    "#8b5cf6",
  ];  // ==========================
  // Team Records
  // ==========================

  const highestKillMatch =
    matches.length > 0
      ? matches.reduce((a, b) =>
          Number(a.teamKills) >
          Number(b.teamKills)
            ? a
            : b
        )
      : null;

  const topKiller =
    [...players].sort(
      (a, b) => b.totalKills - a.totalKills
    )[0];

  const topPerformer =
    [...players].sort(
      (a, b) =>
        b.performancePoints -
        a.performancePoints
    )[0];

  const mostChicken =
    [...players].sort(
      (a, b) => b.chickens - a.chickens
    )[0];

  const mostTop8 =
    [...players].sort(
      (a, b) =>
        b.top8Finishes - a.top8Finishes
    )[0];

  return (

    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-yellow-400">
          📊 Team Analytics
        </h1>

        <p className="mt-2 text-gray-400">
          Complete statistics of your BGMI team.
        </p>

      </div>

      {/* Top Cards */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

          <p className="text-gray-400">
            📅 Total Matches
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {totalMatches}
          </h2>

        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

          <p className="text-gray-400">
            🔥 Total Kills
          </p>

          <h2 className="mt-3 text-4xl font-bold text-yellow-400">
            {totalKills}
          </h2>

        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

          <p className="text-gray-400">
            ⭐ Team Performance
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-400">
            {totalPerformance}
          </h2>

        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

          <p className="text-gray-400">
            🏆 Chicken Rate
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {chickenRate}%
          </h2>

        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

          <p className="text-gray-400">
            🎯 Top 8 Rate
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {top8Rate}%
          </h2>

        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

          <p className="text-gray-400">
  🎯 Avg Placement Points
</p>

<h2 className="mt-3 text-4xl font-bold">
  {averagePlacementPoints}
</h2>

        </div>

      </div>

      {/* Charts */}

      <div className="grid gap-6 xl:grid-cols-2">

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

          <h2 className="mb-5 text-xl font-bold text-yellow-400">
            📈 Kills Per Match
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={matchChart}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="match" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="kills"
                stroke="#facc15"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

         <h2 className="mb-5 text-xl font-bold text-yellow-400">
  📊 Placement Points Per Match
</h2>

<ResponsiveContainer width="100%" height={300}>

  <BarChart data={matchChart}>

    <CartesianGrid strokeDasharray="3 3" />

    <XAxis dataKey="match" />

    <YAxis />

    <Tooltip />

    <Bar
      dataKey="placementPoints"
      fill="#3b82f6"
    />

  </BarChart>

</ResponsiveContainer>

        </div>

      </div>
            {/* Bottom Section */}

      <div className="grid gap-6 xl:grid-cols-2">

        {/* Kill Contribution */}

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

          <h2 className="mb-5 text-xl font-bold text-yellow-400">
            🥧 Kill Contribution
          </h2>

          <ResponsiveContainer width="100%" height={350}>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >

                {pieData.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />

                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* Team Records */}

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

          <h2 className="mb-5 text-xl font-bold text-yellow-400">
            🏅 Team Records
          </h2>

          <div className="space-y-4">

            <div className="rounded-xl border border-slate-600 bg-slate-700 p-4">

              <p className="text-gray-400">
                Highest Kill Match
              </p>

              <p className="mt-1 text-lg font-bold">
                {highestKillMatch
                  ? `${highestKillMatch.teamKills} Kills`
                  : "-"}
              </p>

            </div>

            <div className="rounded-xl border border-slate-600 bg-slate-700 p-4">

              <p className="text-gray-400">
                Top Killer
              </p>

              <p className="mt-1 text-lg font-bold text-yellow-400">
                {topKiller?.name || "-"}
              </p>

            </div>

            <div className="rounded-xl border border-slate-600 bg-slate-700 p-4">

              <p className="text-gray-400">
                Best Performer
              </p>

              <p className="mt-1 text-lg font-bold text-green-400">
                {topPerformer?.name || "-"}
              </p>

            </div>

            <div className="rounded-xl border border-slate-600 bg-slate-700 p-4">

              <p className="text-gray-400">
                Most Chicken Dinners
              </p>

              <p className="mt-1 text-lg font-bold">
                {mostChicken?.name || "-"}
              </p>

            </div>

            <div className="rounded-xl border border-slate-600 bg-slate-700 p-4">

              <p className="text-gray-400">
                Most Top 8 Finishes
              </p>

              <p className="mt-1 text-lg font-bold">
                {mostTop8?.name || "-"}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;