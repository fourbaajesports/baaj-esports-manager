import { useContext, useState } from "react";
import { MatchContext } from "../context/MatchContext";

function Leaderboard() {
  const { players, matches } = useContext(MatchContext);

  const [selectedTournament, setSelectedTournament] = useState("");

  // =========================
  // TOURNAMENT LIST
  // =========================

  const tournamentNames = [
    ...new Set(
      matches
        .map((match) => match.tournament)
        .filter(Boolean)
    ),
  ];

  // =========================
  // TOURNAMENT FILTER
  // =========================

  const filteredMatches = selectedTournament
    ? matches.filter(
        (match) =>
          match.tournament === selectedTournament
      )
    : matches;

  // =========================
  // PLAYER STATS
  // =========================

  const leaderboardPlayers = players.map((player) => {
    let totalKills = 0;
    let matchesPlayed = 0;

    filteredMatches.forEach((match) => {
      const stats = match.playerStats?.[player.id];

      if (!stats) return;

      const kills = Number(stats.kills || 0);

      totalKills += kills;
      matchesPlayed += 1;
    });

    const averageKills =
      matchesPlayed > 0
        ? Number(
            (
              totalKills / matchesPlayed
            ).toFixed(2)
          )
        : 0;

    return {
      ...player,
      totalKills,
      matchesPlayed,
      averageKills,
    };
  });

  // =========================
  // SORT BY KILLS
  // =========================

  const sortedPlayers = [
    ...leaderboardPlayers,
  ].sort((a, b) => {
    if (b.totalKills !== a.totalKills) {
      return b.totalKills - a.totalKills;
    }

    return b.averageKills - a.averageKills;
  });

  // =========================
  // RANK STYLE
  // =========================

  const getRankStyle = (index) => {
    if (index === 0) {
      return {
        border: "border-[#d4af37]/50",
        glow:
          "shadow-[0_0_35px_rgba(212,175,55,0.10)]",
        number: "text-[#d4af37]",
        badge:
          "bg-[#d4af37]/10 border-[#d4af37]/30",
      };
    }

    if (index === 1) {
      return {
        border: "border-gray-400/30",
        glow:
          "shadow-[0_0_30px_rgba(156,163,175,0.06)]",
        number: "text-gray-300",
        badge:
          "bg-gray-400/10 border-gray-400/20",
      };
    }

    if (index === 2) {
      return {
        border: "border-orange-500/30",
        glow:
          "shadow-[0_0_30px_rgba(249,115,22,0.06)]",
        number: "text-orange-400",
        badge:
          "bg-orange-500/10 border-orange-500/20",
      };
    }

    return {
      border: "border-white/5",
      glow: "",
      number: "text-gray-600",
      badge:
        "bg-white/[0.03] border-white/5",
    };
  };

  return (
    <div className="space-y-8">
      {/* =========================
          HEADER
      ========================= */}

      <section className="relative overflow-hidden border border-white/5 bg-[#080808] px-6 py-8 md:px-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#19c77a]/70 to-transparent" />

        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#19c77a]/5 blur-3xl" />

        <div className="relative">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#19c77a]">
            Player Statistics
          </p>

          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
                Leaderboard
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                Player rankings based on total
                kills and average kills per
                match.
              </p>
            </div>

            <div className="border border-white/5 bg-white/[0.025] px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                Ranking Metric
              </p>

              <p className="mt-1 text-xs font-black uppercase tracking-[0.15em] text-white">
                Kills + Average
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          TOURNAMENT FILTER
      ========================= */}

      <section className="border border-white/5 bg-[#080808] p-5 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600">
              Performance Filter
            </p>

            <h2 className="mt-2 text-lg font-black uppercase tracking-wide text-white">
              Filter By Tournament
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div>
              <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                Select Tournament
              </label>

              <select
                value={selectedTournament}
                onChange={(e) =>
                  setSelectedTournament(
                    e.target.value
                  )
                }
                className="h-11 min-w-[220px] border border-white/10 bg-[#050505] px-4 text-sm font-semibold text-white outline-none transition focus:border-[#19c77a]/50"
              >
                <option
                  value=""
                  className="bg-[#050505]"
                >
                  All Tournaments
                </option>

                {tournamentNames.map(
                  (tournament) => (
                    <option
                      key={tournament}
                      value={tournament}
                      className="bg-[#050505]"
                    >
                      {tournament}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              onClick={() =>
                setSelectedTournament("")
              }
              className="h-11 border border-[#19c77a]/20 bg-[#19c77a]/5 px-5 text-[10px] font-black uppercase tracking-[0.18em] text-[#19c77a] transition-all duration-300 hover:border-[#19c77a]/50 hover:bg-[#19c77a]/10"
            >
              All Tournaments
            </button>
          </div>
        </div>
      </section>

      {/* =========================
          FILTER INFO
      ========================= */}

      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-600">
            Current View
          </p>

          <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-gray-400">
            {selectedTournament
              ? `Leaderboard for ${selectedTournament}`
              : "Overall Leaderboard"}
          </p>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#19c77a]">
          {sortedPlayers.length} Players
        </p>
      </div>

      {/* =========================
          LEADERBOARD
      ========================= */}

      <div className="space-y-3">
        {sortedPlayers.map(
          (player, index) => {
            const rankStyle =
              getRankStyle(index);

            return (
              <div
                key={player.id}
                className={`group relative overflow-hidden border bg-[#080808] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-[#19c77a]/30 md:p-6 ${rankStyle.border} ${rankStyle.glow}`}
              >
                <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#19c77a]/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  {/* PLAYER */}

                  <div className="flex min-w-0 items-center gap-5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center border ${rankStyle.badge}`}
                    >
                      <span
                        className={`text-lg font-black ${rankStyle.number}`}
                      >
                        {index + 1}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                        Rank {index + 1}
                      </p>

                      <h2 className="mt-1 truncate text-xl font-black uppercase tracking-wide text-white transition-colors duration-300 group-hover:text-[#19c77a] md:text-2xl">
                        {player.ign ||
                          player.name}
                      </h2>

                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
                        {player.role}
                      </p>
                    </div>
                  </div>

                  {/* STATS */}

                  <div className="grid grid-cols-3 border-t border-white/5 pt-5 md:flex md:border-t-0 md:pt-0">
                    {/* MATCHES */}

                    <div className="min-w-[90px] px-3 text-center md:border-l md:border-white/5 md:px-6">
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-600">
                        Matches
                      </p>

                      <p className="mt-2 text-xl font-black text-white">
                        {player.matchesPlayed}
                      </p>
                    </div>

                    {/* TOTAL KILLS */}

                    <div className="min-w-[90px] border-l border-white/5 px-3 text-center md:px-6">
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-600">
                        Total Kills
                      </p>

                      <p className="mt-2 text-xl font-black text-[#19c77a]">
                        {player.totalKills}
                      </p>
                    </div>

                    {/* AVERAGE */}

                    <div className="min-w-[90px] border-l border-white/5 px-3 text-center md:px-6">
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-600">
                        Avg / Match
                      </p>

                      <p className="mt-2 text-xl font-black text-[#d4af37]">
                        {player.averageKills}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* =========================
          EMPTY STATE
      ========================= */}

      {sortedPlayers.length === 0 && (
        <div className="border border-dashed border-white/10 bg-[#080808] p-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-600">
            No Player Statistics
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Player statistics will appear
            here once match data is
            available.
          </p>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;