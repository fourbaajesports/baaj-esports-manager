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

  // -----------------------------
  // Team Stats
  // -----------------------------

  const totalMatches = matches.length;

  const totalKills = matches.reduce(
    (sum, match) => sum + Number(match.teamKills || 0),
    0
  );

  const totalPerformance = players.reduce(
    (sum, player) => sum + Number(player.performancePoints || 0),
    0
  );

  const averagePlacement =
    totalMatches === 0
      ? 0
      : (
          matches.reduce(
            (sum, match) =>
              sum + Number(match.placement),
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
      : ((chickenCount / totalMatches) * 100).toFixed(1);

  const top8Rate =
    totalMatches === 0
      ? 0
      : ((top8Count / totalMatches) * 100).toFixed(1);

  // -----------------------------
  // Charts
  // -----------------------------

  const matchChart = matches.map((match, index) => ({
    match: `M${index + 1}`,
    kills: Number(match.teamKills),
    placement: Number(match.placement),
  }));

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
  ];

  // -----------------------------
  // Records
  // -----------------------------

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

  return (    <div className="p-8 text-white">

      <h1 className="mb-8 text-4xl font-bold text-yellow-400">
        📊 Team Analytics
      </h1>

      {/* Top Cards */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-xl bg-slate-800 p-6">
          <h3 className="text-gray-400">📅 Total Matches</h3>
          <p className="mt-2 text-4xl font-bold">{totalMatches}</p>
        </div>

        <div className="rounded-xl bg-slate-800 p-6">
          <h3 className="text-gray-400">🔥 Total Kills</h3>
          <p className="mt-2 text-4xl font-bold text-yellow-400">
            {totalKills}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-6">
          <h3 className="text-gray-400">⭐ Team Performance</h3>
          <p className="mt-2 text-4xl font-bold text-green-400">
            {totalPerformance}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-6">
          <h3 className="text-gray-400">🏆 Chicken Rate</h3>
          <p className="mt-2 text-4xl font-bold">
            {chickenRate}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-6">
          <h3 className="text-gray-400">🎯 Top 8 Rate</h3>
          <p className="mt-2 text-4xl font-bold">
            {top8Rate}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-6">
          <h3 className="text-gray-400">📍 Avg Placement</h3>
          <p className="mt-2 text-4xl font-bold">
            {averagePlacement}
          </p>
        </div>

      </div>

      {/* Charts */}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">

        <div className="rounded-xl bg-slate-800 p-6">

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

        <div className="rounded-xl bg-slate-800 p-6">

          <h2 className="mb-5 text-xl font-bold text-yellow-400">
            📊 Placement Trend
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={matchChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="match" />
              <YAxis reversed />
              <Tooltip />
              <Bar
                dataKey="placement"
                fill="#3b82f6"
              />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* Pie + Records */}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">

        <div className="rounded-xl bg-slate-800 p-6">

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

        <div className="rounded-xl bg-slate-800 p-6">

          <h2 className="mb-5 text-xl font-bold text-yellow-400">
            🏅 Team Records
          </h2>

          <div className="space-y-4">

            <div className="rounded-lg bg-slate-700 p-4">
              <p className="text-gray-400">
                Highest Kill Match
              </p>
              <p className="font-bold">
                {highestKillMatch
                  ? `${highestKillMatch.teamKills} Kills`
                  : "-"}
              </p>
            </div>

            <div className="rounded-lg bg-slate-700 p-4">
              <p className="text-gray-400">
                Top Killer
              </p>
              <p className="font-bold">
                {topKiller?.name || "-"}
              </p>
            </div>

            <div className="rounded-lg bg-slate-700 p-4">
              <p className="text-gray-400">
                Best Performer
              </p>
              <p className="font-bold">
                {topPerformer?.name || "-"}
              </p>
            </div>

            <div className="rounded-lg bg-slate-700 p-4">
              <p className="text-gray-400">
                Most Chicken
              </p>
              <p className="font-bold">
                {mostChicken?.name || "-"}
              </p>
            </div>

            <div className="rounded-lg bg-slate-700 p-4">
              <p className="text-gray-400">
                Most Top 8
              </p>
              <p className="font-bold">
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