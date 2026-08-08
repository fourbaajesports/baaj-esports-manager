import { useContext, useState } from "react";
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

  const [selectedDate, setSelectedDate] = useState("");

  // ==========================
  // Placement Points
  // ==========================

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

  // ==========================
  // Filter Matches By Date
  // ==========================

  const filteredMatches = selectedDate
    ? matches.filter((match) => {
        if (!match.date) return false;

        const matchDate = new Date(match.date);

        if (isNaN(matchDate.getTime())) {
          return false;
        }

        const formattedDate = `${matchDate.getFullYear()}-${String(
          matchDate.getMonth() + 1
        ).padStart(2, "0")}-${String(
          matchDate.getDate()
        ).padStart(2, "0")}`;

        return formattedDate === selectedDate;
      })
    : matches;

  // ==========================
  // Team Stats
  // ==========================

  const totalMatches = filteredMatches.length;

  const totalKills = filteredMatches.reduce(
    (sum, match) =>
      sum + Number(match.teamKills || 0),
    0
  );

  const totalPlacementPoints =
    filteredMatches.reduce(
      (sum, match) =>
        sum +
        (placementPoints[
          Number(match.placement)
        ] || 0),
      0
    );

  const averagePlacementPoints =
    totalMatches === 0
      ? "0.00"
      : (
          totalPlacementPoints / totalMatches
        ).toFixed(2);

  const chickenCount = filteredMatches.filter(
    (match) => Number(match.placement) === 1
  ).length;

  const top8Count = filteredMatches.filter(
    (match) =>
      Number(match.placement) <= 8
  ).length;

  const chickenRate =
    totalMatches === 0
      ? "0.0"
      : (
          (chickenCount / totalMatches) *
          100
        ).toFixed(1);

  const top8Rate =
    totalMatches === 0
      ? "0.0"
      : (
          (top8Count / totalMatches) *
          100
        ).toFixed(1);

  // ==========================
  // Match Chart
  // ==========================

  const matchChart = filteredMatches.map(
    (match, index) => ({
      match: `M${index + 1}`,
      kills: Number(match.teamKills || 0),
      placementPoints:
        placementPoints[
          Number(match.placement)
        ] || 0,
    })
  );

  // ==========================
  // Player Date-wise Stats
  // ==========================

  const analyticsPlayers = players.map(
    (player) => {
      let totalKills = 0;
      let performancePoints = 0;
      let matchesPlayed = 0;

      filteredMatches.forEach((match) => {
        const stats =
          match.playerStats?.[player.id];

        if (!stats?.roomJoin) return;

        const kills = Number(
          stats.kills || 0
        );

        const roomJoinPoints = 1;

        const chickenPoints = stats.chicken
          ? 2
          : 0;

        const top8Points =
          Number(match.placement) >= 2 &&
          Number(match.placement) <= 8
            ? 1
            : 0;

        const penaltyPoints = stats.penalty
          ? -1
          : 0;

        const performance =
          kills +
          roomJoinPoints +
          chickenPoints +
          top8Points +
          penaltyPoints;

        totalKills += kills;
        performancePoints += performance;
        matchesPlayed += 1;
      });

      return {
        ...player,
        totalKills,
        performancePoints,
        matchesPlayed,
      };
    }
  );

  // ==========================
  // Kill Contribution
  // ==========================

  const pieData = analyticsPlayers
    .filter((player) => player.totalKills > 0)
    .map((player) => ({
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

  // ==========================
  // Team Records
  // ==========================

  const highestKillMatch =
    filteredMatches.length > 0
      ? filteredMatches.reduce(
          (a, b) =>
            Number(a.teamKills || 0) >
            Number(b.teamKills || 0)
              ? a
              : b
        )
      : null;

  const topKiller =
    [...analyticsPlayers].sort(
      (a, b) =>
        b.totalKills - a.totalKills
    )[0];

  const topPerformer =
    [...analyticsPlayers].sort(
      (a, b) =>
        b.performancePoints -
        a.performancePoints
    )[0];

  const mostChicken =
    [...analyticsPlayers].sort(
      (a, b) =>
        b.chickens - a.chickens
    )[0];

  const mostTop8 =
    [...analyticsPlayers].sort(
      (a, b) =>
        b.top8Finishes -
        a.top8Finishes
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

      {/* Date Filter */}

      <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-slate-700 bg-slate-800 p-5">

        <div>

          <label className="mb-2 block text-sm font-semibold text-gray-400">
            📅 Select Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
            className="rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none focus:border-yellow-400"
          />

        </div>

        <button
          onClick={() => setSelectedDate("")}
          className="rounded-xl bg-slate-600 px-5 py-3 font-bold text-white transition hover:bg-slate-500"
        >
          All Dates
        </button>

      </div>

      {/* Date Info */}

      <div className="text-sm text-gray-400">

        {selectedDate
          ? `Showing analytics for ${selectedDate}`
          : "Showing all-time analytics"}

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
            🎯 Total Placement Points
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-400">
            {totalPlacementPoints}
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
            📍 Avg Placement Points
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {averagePlacementPoints}
          </h2>

        </div>

      </div>

      {/* Charts */}

      <div className="grid gap-6 xl:grid-cols-2">

        {/* Kills */}

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

          <h2 className="mb-5 text-xl font-bold text-yellow-400">
            📈 Kills Per Match
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart data={matchChart}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

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

        {/* Placement Points */}

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-lg">

          <h2 className="mb-5 text-xl font-bold text-yellow-400">
            📊 Placement Points Per Match
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart data={matchChart}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

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

          {pieData.length === 0 ? (

            <div className="flex h-[350px] items-center justify-center text-gray-400">
              No kills recorded for this date.
            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >

                  {pieData.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          )}

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