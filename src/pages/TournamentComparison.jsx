import { useContext, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { MatchContext } from "../context/MatchContext";

function TournamentComparison() {
  const {
    matches,
    players,
    getTournamentNames,
    getTournamentDetails,
  } = useContext(MatchContext);

  const tournamentNames = getTournamentNames();

  const [tournamentOne, setTournamentOne] = useState("");
  const [tournamentTwo, setTournamentTwo] = useState("");

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
  // TOURNAMENT STATS
  // ==========================

  const calculateStats = (tournament) => {
    const tournamentMatches = matches.filter(
      (match) => match.tournament === tournament
    );

    const totalMatches = tournamentMatches.length;

    const totalKills = tournamentMatches.reduce(
      (sum, match) =>
        sum + Number(match.teamKills || 0),
      0
    );

    const totalPlacementPoints =
      tournamentMatches.reduce(
        (sum, match) =>
          sum +
          (placementPoints[
            Number(match.placement)
          ] || 0),
        0
      );

    const totalPoints =
      totalKills + totalPlacementPoints;

    const averageKills =
      totalMatches > 0
        ? Number(
            (
              totalKills / totalMatches
            ).toFixed(2)
          )
        : 0;

    const averagePlacementPoints =
      totalMatches > 0
        ? Number(
            (
              totalPlacementPoints /
              totalMatches
            ).toFixed(2)
          )
        : 0;

    const tournamentDetails =
      getTournamentDetails(tournament);

    return {
      totalMatches,
      totalKills,
      totalPlacementPoints,
      totalPoints,
      averageKills,
      averagePlacementPoints,
      finalPosition:
        tournamentDetails?.finalPosition ||
        null,
    };
  };

  const statsOne = useMemo(
    () =>
      tournamentOne
        ? calculateStats(tournamentOne)
        : null,
    [tournamentOne, matches]
  );

  const statsTwo = useMemo(
    () =>
      tournamentTwo
        ? calculateStats(tournamentTwo)
        : null,
    [tournamentTwo, matches]
  );

  // ==========================
  // PLAYER STATS
  // ==========================

  const getPlayerStats = (tournament) => {
    const tournamentMatches = matches.filter(
      (match) => match.tournament === tournament
    );

    return players.map((player) => {
      let kills = 0;
      let played = 0;

      tournamentMatches.forEach((match) => {
        const stats =
          match.playerStats?.[player.id];

        if (!stats) return;

        kills += Number(stats.kills || 0);
        played += 1;
      });

      return {
        ...player,
        kills,
        played,
        average:
          played > 0
            ? Number(
                (kills / played).toFixed(2)
              )
            : 0,
      };
    });
  };

  // ==========================
  // PLAYER COMPARISON
  // ==========================

  const playerComparison = useMemo(() => {
    if (!tournamentOne || !tournamentTwo) {
      return [];
    }

    const playersOne =
      getPlayerStats(tournamentOne);

    const playersTwo =
      getPlayerStats(tournamentTwo);

    return players.map((player) => {
      const one = playersOne.find(
        (item) => item.id === player.id
      );

      const two = playersTwo.find(
        (item) => item.id === player.id
      );

      return {
        ...player,
        tournamentOneKills:
          one?.kills || 0,
        tournamentTwoKills:
          two?.kills || 0,
        tournamentOneAverage:
          one?.average || 0,
        tournamentTwoAverage:
          two?.average || 0,
        killDifference:
          (two?.kills || 0) -
          (one?.kills || 0),
      };
    });
  }, [
    tournamentOne,
    tournamentTwo,
    matches,
    players,
  ]);

  // ==========================
  // CHART DATA
  // ==========================

  const chartData =
    statsOne && statsTwo
      ? [
          {
            stat: "Team Kills",
            tournamentOne:
              statsOne.totalKills,
            tournamentTwo:
              statsTwo.totalKills,
          },
          {
            stat: "Placement Points",
            tournamentOne:
              statsOne.totalPlacementPoints,
            tournamentTwo:
              statsTwo.totalPlacementPoints,
          },
          {
            stat: "Total Points",
            tournamentOne:
              statsOne.totalPoints,
            tournamentTwo:
              statsTwo.totalPoints,
          },
        ]
      : [];

  // ==========================
  // WINNER
  // ==========================

  const getWinner = (
    valueOne,
    valueTwo
  ) => {
    if (valueOne === valueTwo) {
      return "Tie";
    }

    return valueOne > valueTwo
      ? tournamentOne
      : tournamentTwo;
  };

  const hasComparison =
    tournamentOne &&
    tournamentTwo &&
    tournamentOne !== tournamentTwo;

  return (
    <div className="space-y-8 text-white">
      {/* ==========================
          HEADER
      ========================== */}

      <section className="relative overflow-hidden border border-white/5 bg-[#080808] px-6 py-8 md:px-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#19c77a]/70 to-transparent" />

        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#19c77a]/5 blur-3xl" />

        <div className="relative">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#19c77a]">
            SOUL Esports
          </p>

          <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
            Tournament Comparison
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Compare the performance of two
            tournaments across team and player
            statistics.
          </p>
        </div>
      </section>

      {/* ==========================
          TOURNAMENT SELECTION
      ========================== */}

      <section className="border border-white/5 bg-[#080808] p-5 md:p-6">
        <div className="mb-6">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#19c77a]">
            Comparison Setup
          </p>

          <h2 className="mt-2 text-xl font-black uppercase tracking-wide text-white">
            Select Tournaments
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <div>
            <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
              Tournament 1
            </label>

            <select
              value={tournamentOne}
              onChange={(e) =>
                setTournamentOne(e.target.value)
              }
              className="h-12 w-full border border-white/10 bg-[#050505] px-4 text-sm font-semibold text-white outline-none transition focus:border-[#19c77a]/50"
            >
              <option
                value=""
                className="bg-[#050505]"
              >
                Select Tournament
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

          <div className="flex h-12 w-12 items-center justify-center justify-self-center border border-[#d4af37]/40 bg-[#d4af37]/10 text-xs font-black tracking-wider text-[#d4af37]">
            VS
          </div>

          <div>
            <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
              Tournament 2
            </label>

            <select
              value={tournamentTwo}
              onChange={(e) =>
                setTournamentTwo(e.target.value)
              }
              className="h-12 w-full border border-white/10 bg-[#050505] px-4 text-sm font-semibold text-white outline-none transition focus:border-[#19c77a]/50"
            >
              <option
                value=""
                className="bg-[#050505]"
              >
                Select Tournament
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
        </div>

        {tournamentOne &&
          tournamentTwo &&
          tournamentOne ===
            tournamentTwo && (
            <div className="mt-5 border border-red-500/20 bg-red-500/5 p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-400">
                Please select two different
                tournaments.
              </p>
            </div>
          )}
      </section>

      {/* ==========================
          EMPTY STATE
      ========================== */}

      {!hasComparison && (
        <section className="border border-dashed border-white/10 bg-[#080808] p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center border border-white/10 bg-white/[0.02] text-sm font-black text-gray-600">
            VS
          </div>

          <h2 className="mt-5 text-xl font-black uppercase tracking-wide text-white">
            Select Two Tournaments
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
            Choose two tournaments above to
            compare their performance.
          </p>
        </section>
      )}

      {hasComparison && (
        <>
          {/* ==========================
              TOURNAMENT HEADERS
          ========================== */}

          <div className="grid gap-5 md:grid-cols-2">
            <TournamentHeader
              name={tournamentOne}
              position={statsOne?.finalPosition}
              accent="green"
            />

            <TournamentHeader
              name={tournamentTwo}
              position={statsTwo?.finalPosition}
              accent="gold"
            />
          </div>

          {/* ==========================
              MAIN COMPARISON
          ========================== */}

          <section className="overflow-hidden border border-white/5 bg-[#080808]">
            <div className="border-b border-white/5 px-5 py-5">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#19c77a]">
                Performance Breakdown
              </p>

              <h2 className="mt-2 text-xl font-black uppercase tracking-wide text-white">
                Tournament Statistics
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.015]">
                    <th className="px-5 py-4 text-left text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                      Statistic
                    </th>

                    <th className="px-5 py-4 text-center text-[9px] font-black uppercase tracking-[0.15em] text-[#19c77a]">
                      {tournamentOne}
                    </th>

                    <th className="px-5 py-4 text-center text-[9px] font-black uppercase tracking-[0.15em] text-[#d4af37]">
                      {tournamentTwo}
                    </th>

                    <th className="px-5 py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                      Better
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <ComparisonRow
                    label="Matches"
                    valueOne={
                      statsOne.totalMatches
                    }
                    valueTwo={
                      statsTwo.totalMatches
                    }
                    winner={getWinner(
                      statsOne.totalMatches,
                      statsTwo.totalMatches
                    )}
                  />

                  <ComparisonRow
                    label="Team Kills"
                    valueOne={
                      statsOne.totalKills
                    }
                    valueTwo={
                      statsTwo.totalKills
                    }
                    winner={getWinner(
                      statsOne.totalKills,
                      statsTwo.totalKills
                    )}
                  />

                  <ComparisonRow
                    label="Avg Kills / Match"
                    valueOne={
                      statsOne.averageKills
                    }
                    valueTwo={
                      statsTwo.averageKills
                    }
                    winner={getWinner(
                      statsOne.averageKills,
                      statsTwo.averageKills
                    )}
                  />

                  <ComparisonRow
                    label="Placement Points"
                    valueOne={
                      statsOne.totalPlacementPoints
                    }
                    valueTwo={
                      statsTwo.totalPlacementPoints
                    }
                    winner={getWinner(
                      statsOne.totalPlacementPoints,
                      statsTwo.totalPlacementPoints
                    )}
                  />

                  <ComparisonRow
                    label="Avg Placement Points"
                    valueOne={
                      statsOne.averagePlacementPoints
                    }
                    valueTwo={
                      statsTwo.averagePlacementPoints
                    }
                    winner={getWinner(
                      statsOne.averagePlacementPoints,
                      statsTwo.averagePlacementPoints
                    )}
                  />

                  <ComparisonRow
                    label="Total Points"
                    valueOne={
                      statsOne.totalPoints
                    }
                    valueTwo={
                      statsTwo.totalPoints
                    }
                    winner={getWinner(
                      statsOne.totalPoints,
                      statsTwo.totalPoints
                    )}
                    highlight
                  />

                  <ComparisonRow
                    label="Final Position"
                    valueOne={
                      statsOne.finalPosition
                        ? `#${statsOne.finalPosition}`
                        : "—"
                    }
                    valueTwo={
                      statsTwo.finalPosition
                        ? `#${statsTwo.finalPosition}`
                        : "—"
                    }
                    winner={
                      statsOne.finalPosition &&
                      statsTwo.finalPosition
                        ? statsOne.finalPosition <
                          statsTwo.finalPosition
                          ? tournamentOne
                          : statsOne.finalPosition >
                            statsTwo.finalPosition
                          ? tournamentTwo
                          : "Tie"
                        : "—"
                    }
                    highlight
                  />
                </tbody>
              </table>
            </div>
          </section>

          {/* ==========================
              CHART
          ========================== */}

          <section className="border border-white/5 bg-[#080808] p-5 md:p-6">
            <div className="mb-6">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#19c77a]">
                Visual Comparison
              </p>

              <h2 className="mt-2 text-xl font-black uppercase tracking-wide text-white">
                Team Performance
              </h2>
            </div>

            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                  vertical={false}
                />

                <XAxis
                  dataKey="stat"
                  stroke="#4b5563"
                  tick={{
                    fill: "#6b7280",
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  stroke="#4b5563"
                  tick={{
                    fill: "#6b7280",
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#080808",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    color: "#fff",
                  }}
                />

                <Legend />

                <Bar
                  dataKey="tournamentOne"
                  name={tournamentOne}
                  fill="#19c77a"
                  radius={[3, 3, 0, 0]}
                />

                <Bar
                  dataKey="tournamentTwo"
                  name={tournamentTwo}
                  fill="#d4af37"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </section>

          {/* ==========================
              PLAYER COMPARISON
          ========================== */}

          <section className="border border-white/5 bg-[#080808] p-5 md:p-6">
            <div className="mb-6">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#19c77a]">
                Individual Performance
              </p>

              <h2 className="mt-2 text-xl font-black uppercase tracking-wide text-white">
                Player Comparison
              </h2>

              <p className="mt-2 text-xs leading-5 text-gray-600">
                Compare individual player
                performance between both
                tournaments.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.015]">
                    <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                      Player
                    </th>

                    <th
                      colSpan="2"
                      className="px-4 py-4 text-center text-[9px] font-black uppercase tracking-[0.15em] text-[#19c77a]"
                    >
                      {tournamentOne}
                    </th>

                    <th
                      colSpan="2"
                      className="px-4 py-4 text-center text-[9px] font-black uppercase tracking-[0.15em] text-[#d4af37]"
                    >
                      {tournamentTwo}
                    </th>

                    <th className="px-4 py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                      Change
                    </th>
                  </tr>

                  <tr className="border-b border-white/5">
                    <th></th>

                    <th className="px-4 py-3 text-center text-[8px] font-bold uppercase tracking-[0.15em] text-gray-600">
                      Kills
                    </th>

                    <th className="px-4 py-3 text-center text-[8px] font-bold uppercase tracking-[0.15em] text-gray-600">
                      Avg
                    </th>

                    <th className="px-4 py-3 text-center text-[8px] font-bold uppercase tracking-[0.15em] text-gray-600">
                      Kills
                    </th>

                    <th className="px-4 py-3 text-center text-[8px] font-bold uppercase tracking-[0.15em] text-gray-600">
                      Avg
                    </th>

                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {playerComparison.map(
                    (player) => (
                      <tr
                        key={player.id}
                        className="group border-b border-white/5 transition-colors duration-300 last:border-b-0 hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-5">
                          <div>
                            <p className="font-black uppercase tracking-wide text-white transition-colors group-hover:text-[#19c77a]">
                              {player.ign ||
                                player.name}
                            </p>

                            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-gray-600">
                              {player.role}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-5 text-center text-sm font-black text-[#19c77a]">
                          {
                            player.tournamentOneKills
                          }
                        </td>

                        <td className="px-4 py-5 text-center text-sm font-bold text-gray-400">
                          {
                            player.tournamentOneAverage
                          }
                        </td>

                        <td className="px-4 py-5 text-center text-sm font-black text-[#d4af37]">
                          {
                            player.tournamentTwoKills
                          }
                        </td>

                        <td className="px-4 py-5 text-center text-sm font-bold text-gray-400">
                          {
                            player.tournamentTwoAverage
                          }
                        </td>

                        <td
                          className={`px-4 py-5 text-center text-sm font-black ${
                            player.killDifference >
                            0
                              ? "text-[#19c77a]"
                              : player.killDifference <
                                0
                              ? "text-red-400"
                              : "text-gray-600"
                          }`}
                        >
                          {player.killDifference >
                          0
                            ? `+${player.killDifference}`
                            : player.killDifference}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==========================
              FINAL VERDICT
          ========================== */}

          <section className="relative overflow-hidden border border-[#d4af37]/20 bg-[#080808] p-6 md:p-7">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />

            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#d4af37]">
              Overall Comparison
            </p>

            <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
              {statsOne.totalPoints ===
              statsTwo.totalPoints
                ? "Both tournaments performed equally"
                : statsOne.totalPoints >
                  statsTwo.totalPoints
                ? `${tournamentOne} performed better`
                : `${tournamentTwo} performed better`}
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <VerdictStat
                label="Point Difference"
                value={Math.abs(
                  statsOne.totalPoints -
                    statsTwo.totalPoints
                )}
              />

              <VerdictStat
                label="Kill Difference"
                value={Math.abs(
                  statsOne.totalKills -
                    statsTwo.totalKills
                )}
              />

              <VerdictStat
                label="Avg Kill Difference"
                value={Math.abs(
                  statsOne.averageKills -
                    statsTwo.averageKills
                ).toFixed(2)}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

// ==========================
// TOURNAMENT HEADER
// ==========================

function TournamentHeader({
  name,
  position,
  accent,
}) {
  const accentColor =
    accent === "green"
      ? "text-[#19c77a]"
      : "text-[#d4af37]";

  const borderColor =
    accent === "green"
      ? "border-[#19c77a]/20"
      : "border-[#d4af37]/20";

  return (
    <section
      className={`relative overflow-hidden border bg-[#080808] p-6 ${borderColor}`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-px ${
          accent === "green"
            ? "bg-[#19c77a]/60"
            : "bg-[#d4af37]/60"
        }`}
      />

      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600">
        Tournament
      </p>

      <h2 className="mt-3 break-words text-2xl font-black uppercase tracking-wide text-white">
        {name}
      </h2>

      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
          Final Position
        </span>

        <span
          className={`text-2xl font-black ${accentColor}`}
        >
          {position ? `#${position}` : "—"}
        </span>
      </div>
    </section>
  );
}

// ==========================
// COMPARISON ROW
// ==========================

function ComparisonRow({
  label,
  valueOne,
  valueTwo,
  winner,
  highlight = false,
}) {
  return (
    <tr className="group border-b border-white/5 last:border-b-0 hover:bg-white/[0.015]">
      <td className="px-5 py-5 text-sm font-bold text-gray-400">
        {label}
      </td>

      <td
        className={`px-5 py-5 text-center text-sm font-black ${
          highlight
            ? "text-[#19c77a]"
            : "text-white"
        }`}
      >
        {valueOne}
      </td>

      <td
        className={`px-5 py-5 text-center text-sm font-black ${
          highlight
            ? "text-[#d4af37]"
            : "text-white"
        }`}
      >
        {valueTwo}
      </td>

      <td className="px-5 py-5 text-center text-[10px] font-black uppercase tracking-[0.1em] text-gray-600">
        {winner === "Tie"
          ? "Tie"
          : winner === "—"
          ? "—"
          : winner}
      </td>
    </tr>
  );
}

// ==========================
// VERDICT STAT
// ==========================

function VerdictStat({
  label,
  value,
}) {
  return (
    <div className="border border-white/5 bg-[#050505] p-4">
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

export default TournamentComparison;