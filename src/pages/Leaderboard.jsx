import { useContext, useState } from "react";
import { MatchContext } from "../context/MatchContext";

function Leaderboard() {
  const { players, matches } = useContext(MatchContext);

  const [tab, setTab] = useState("kills");
  const [selectedDate, setSelectedDate] = useState("");

  // ==========================
  // Date Filter
  // ==========================

  const filteredMatches = selectedDate
    ? matches.filter((match) => {
        if (!match.date) return false;

        const matchDate = new Date(match.date);

        if (isNaN(matchDate.getTime())) return false;

        const formattedDate = `${matchDate.getFullYear()}-${String(
          matchDate.getMonth() + 1
        ).padStart(2, "0")}-${String(
          matchDate.getDate()
        ).padStart(2, "0")}`;

        return formattedDate === selectedDate;
      })
    : matches;

  // ==========================
  // Calculate Player Stats
  // ==========================

  const leaderboardPlayers = players.map((player) => {
    let totalKills = 0;
    let matchesPlayed = 0;
    let performancePoints = 0;

    filteredMatches.forEach((match) => {
      const stats = match.playerStats?.[player.id];

      if (!stats?.roomJoin) return;

      const kills = Number(stats.kills || 0);

      const roomJoinPoints = 1;

      const chickenPoints = stats.chicken ? 2 : 0;

      const top8Points =
        Number(match.placement) >= 2 &&
        Number(match.placement) <= 8
          ? 1
          : 0;

      const penaltyPoints = stats.penalty ? -1 : 0;

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
      matchesPlayed,
      performancePoints,
    };
  });

  // ==========================
  // Sort
  // ==========================

  const sortedPlayers = [...leaderboardPlayers].sort((a, b) =>
    tab === "kills"
      ? b.totalKills - a.totalKills
      : b.performancePoints - a.performancePoints
  );

  // ==========================
  // Medal
  // ==========================

  const medal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";

    return `#${index + 1}`;
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-yellow-400">
          🏆 Leaderboard
        </h1>

        <p className="mt-2 text-gray-400">
          Top performing players of 4 Baaj Esports.
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
            onChange={(e) => setSelectedDate(e.target.value)}
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

      {/* Selected Date Info */}

      <div className="text-sm text-gray-400">
        {selectedDate
          ? `Showing leaderboard for ${selectedDate}`
          : "Showing overall leaderboard"}
      </div>

      {/* Tabs */}

      <div className="flex flex-wrap gap-3">

        <button
          onClick={() => setTab("kills")}
          className={`rounded-xl px-6 py-3 font-bold transition ${
            tab === "kills"
              ? "bg-yellow-500 text-black"
              : "bg-slate-700 text-white hover:bg-slate-600"
          }`}
        >
          🔥 Kill Leaderboard
        </button>

        <button
          onClick={() => setTab("performance")}
          className={`rounded-xl px-6 py-3 font-bold transition ${
            tab === "performance"
              ? "bg-yellow-500 text-black"
              : "bg-slate-700 text-white hover:bg-slate-600"
          }`}
        >
          ⭐ Performance
        </button>

      </div>

      {/* Players */}

      <div className="space-y-4">

        {sortedPlayers.map((player, index) => (

          <div
            key={player.id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-lg transition hover:border-yellow-400 md:flex-row md:items-center md:justify-between"
          >

            <div className="flex items-center gap-5">

              <div className="text-4xl">
                {medal(index)}
              </div>

              <div>

                <h2 className="text-xl font-bold text-yellow-400">
                  {player.name}
                </h2>

                <p className="text-gray-400">
                  {player.role}
                </p>

                <p className="text-sm text-gray-500">
                  {player.ign}
                </p>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-6 text-center md:flex md:gap-10">

              <div>

                <p className="text-xs text-gray-400">
                  Matches
                </p>

                <p className="text-xl font-bold">
                  {player.matchesPlayed}
                </p>

              </div>

              <div>

                <p className="text-xs text-gray-400">
                  Kills
                </p>

                <p className="text-xl font-bold text-yellow-400">
                  {player.totalKills}
                </p>

              </div>

              <div>

                <p className="text-xs text-gray-400">
                  Performance
                </p>

                <p className="text-xl font-bold text-yellow-400">
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

export default Leaderboard;