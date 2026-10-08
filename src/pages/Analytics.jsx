import { useContext, useMemo, useState } from "react";
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
  const {
    matches,
    players,
    getTournamentNames,
    getTournamentRounds,
    getTournamentMaps,
  } = useContext(MatchContext);

  // ==========================
  // FILTER STATE
  // ==========================

  const [selectedTournament, setSelectedTournament] =
    useState("overall");

  const [selectedRound, setSelectedRound] =
    useState("all");

  const [selectedMap, setSelectedMap] =
    useState("all");

  // ==========================
  // PLACEMENT POINTS
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
  // TOURNAMENT LIST
  // ==========================

  const tournamentNames = getTournamentNames();

  // ==========================
  // AVAILABLE ROUNDS
  // ==========================

  const availableRounds = useMemo(() => {
    if (selectedTournament === "overall") {
      return [
        ...new Set(
          matches
            .map((match) => match.stage)
            .filter(Boolean)
        ),
      ];
    }

    const rounds =
      getTournamentRounds(selectedTournament);

    return Array.isArray(rounds)
      ? rounds
      : [];
  }, [
    matches,
    selectedTournament,
    getTournamentRounds,
  ]);

  // ==========================
  // AVAILABLE MAPS
  // ==========================

  const availableMaps = useMemo(() => {
    let scopedMatches = matches;

    if (selectedTournament !== "overall") {
      scopedMatches = scopedMatches.filter(
        (match) =>
          match.tournament ===
          selectedTournament
      );
    }

    if (selectedRound !== "all") {
      scopedMatches = scopedMatches.filter(
        (match) =>
          match.stage === selectedRound
      );
    }

    const actualMaps = [
      ...new Set(
        scopedMatches
          .map((match) => match.map)
          .filter(Boolean)
      ),
    ];

    // Use tournament's configured maps where
    // possible, while keeping only relevant
    // maps when actual match data exists.
    if (
      selectedTournament !== "overall"
    ) {
      const tournamentMaps =
        getTournamentMaps(
          selectedTournament
        );

      if (
        Array.isArray(tournamentMaps) &&
        tournamentMaps.length > 0
      ) {
        if (actualMaps.length === 0) {
          return tournamentMaps;
        }

        return tournamentMaps.filter(
          (map) =>
            actualMaps.includes(map)
        );
      }
    }

    return actualMaps;
  }, [
    matches,
    selectedTournament,
    selectedRound,
    getTournamentMaps,
  ]);

  // ==========================
  // FILTER MATCHES
  // ==========================

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      // Tournament
      if (
        selectedTournament !== "overall" &&
        match.tournament !==
          selectedTournament
      ) {
        return false;
      }

      // Round
      if (
        selectedRound !== "all" &&
        match.stage !== selectedRound
      ) {
        return false;
      }

      // Map
      if (
        selectedMap !== "all" &&
        match.map !== selectedMap
      ) {
        return false;
      }

      return true;
    });
  }, [
    matches,
    selectedTournament,
    selectedRound,
    selectedMap,
  ]);

  // ==========================
  // FILTER LABEL
  // ==========================

  const currentScope = useMemo(() => {
    if (
      selectedTournament === "overall"
    ) {
      return "All Tournaments";
    }

    if (
      selectedRound === "all" &&
      selectedMap === "all"
    ) {
      return selectedTournament;
    }

    if (
      selectedRound !== "all" &&
      selectedMap === "all"
    ) {
      return `${selectedTournament} • ${selectedRound}`;
    }

    if (
      selectedRound === "all" &&
      selectedMap !== "all"
    ) {
      return `${selectedTournament} • ${selectedMap}`;
    }

    return `${selectedTournament} • ${selectedRound} • ${selectedMap}`;
  }, [
    selectedTournament,
    selectedRound,
    selectedMap,
  ]);

  // ==========================
  // TEAM STATS
  // ==========================

  const totalMatches =
    filteredMatches.length;

  const totalKills =
    filteredMatches.reduce(
      (sum, match) =>
        sum +
        Number(match.teamKills || 0),
      0
    );

  const averageKills =
    totalMatches > 0
      ? Number(
          (
            totalKills /
            totalMatches
          ).toFixed(2)
        )
      : 0;

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
    totalMatches > 0
      ? Number(
          (
            totalPlacementPoints /
            totalMatches
          ).toFixed(2)
        )
      : 0;

  const totalPoints =
    totalKills +
    totalPlacementPoints;

  // ==========================
  // AVERAGE PLACEMENT
  // ==========================

  const averagePlacement =
    totalMatches > 0
      ? Number(
          (
            filteredMatches.reduce(
              (sum, match) =>
                sum +
                Number(
                  match.placement || 0
                ),
              0
            ) / totalMatches
          ).toFixed(2)
        )
      : 0;

  // ==========================
  // BEST PLACEMENT
  // ==========================

  const bestPlacement =
    totalMatches > 0
      ? Math.min(
          ...filteredMatches
            .map((match) =>
              Number(
                match.placement
              )
            )
            .filter(
              (placement) =>
                placement > 0
            )
        )
      : null;

  // ==========================
  // MATCH CHART
  // ==========================

  const matchChart =
    filteredMatches.map(
      (match, index) => {
        const placement =
          placementPoints[
            Number(match.placement)
          ] || 0;

        const kills = Number(
          match.teamKills || 0
        );

        return {
          match: `M${index + 1}`,
          kills,
          placementPoints:
            placement,
          totalPoints:
            kills + placement,
        };
      }
    );

  // ==========================
  // ROUND PERFORMANCE
  // ==========================

  const roundPerformance =
    useMemo(() => {
      const grouped = {};

      filteredMatches.forEach(
        (match) => {
          const round =
            match.stage || "Unknown";

          if (!grouped[round]) {
            grouped[round] = {
              round,
              matches: 0,
              kills: 0,
              points: 0,
            };
          }

          const kills = Number(
            match.teamKills || 0
          );

          const placement =
            placementPoints[
              Number(match.placement)
            ] || 0;

          grouped[round].matches += 1;
          grouped[round].kills += kills;
          grouped[round].points +=
            kills + placement;
        }
      );

      return Object.values(grouped);
    }, [filteredMatches]);

  // ==========================
  // MAP PERFORMANCE
  // ==========================

  const mapPerformance =
    useMemo(() => {
      const grouped = {};

      filteredMatches.forEach(
        (match) => {
          const map =
            match.map || "Unknown";

          if (!grouped[map]) {
            grouped[map] = {
              map,
              matches: 0,
              kills: 0,
              placementPoints: 0,
              totalPoints: 0,
            };
          }

          const kills = Number(
            match.teamKills || 0
          );

          const placement =
            placementPoints[
              Number(match.placement)
            ] || 0;

          grouped[map].matches += 1;
          grouped[map].kills += kills;
          grouped[map].placementPoints +=
            placement;
          grouped[map].totalPoints +=
            kills + placement;
        }
      );

      return Object.values(grouped);
    }, [filteredMatches]);

  // ==========================
  // PLAYER STATS
  // ==========================

  const analyticsPlayers =
    players.map((player) => {
      let totalKills = 0;
      let matchesPlayed = 0;

      filteredMatches.forEach(
        (match) => {
          const stats =
            match.playerStats?.[
              player.id
            ];

          if (!stats) return;

          totalKills += Number(
            stats.kills || 0
          );

          matchesPlayed += 1;
        }
      );

      const averageKills =
        matchesPlayed > 0
          ? Number(
              (
                totalKills /
                matchesPlayed
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

  // ==========================
  // PLAYER × MAP ANALYSIS
  // ==========================

  const playerMapStats =
    useMemo(() => {
      return players.map((player) => {
        const mapStats = {};

        filteredMatches.forEach(
          (match) => {
            const map =
              match.map;

            if (!map) return;

            if (!mapStats[map]) {
              mapStats[map] = {
                kills: 0,
                matches: 0,
              };
            }

            const stats =
              match.playerStats?.[
                player.id
              ];

            if (!stats) return;

            mapStats[map].kills +=
              Number(
                stats.kills || 0
              );

            mapStats[map].matches +=
              1;
          }
        );

        return {
          ...player,
          mapStats,
        };
      });
    }, [
      players,
      filteredMatches,
    ]);

  // ==========================
  // KILL CONTRIBUTION
  // ==========================

  const pieData =
    analyticsPlayers
      .filter(
        (player) =>
          player.totalKills > 0
      )
      .map((player) => ({
        name:
          player.ign ||
          player.name,
        value: player.totalKills,
      }));

  const COLORS = [
    "#19c77a",
    "#d4af37",
    "#0b8f55",
    "#8b7355",
    "#6ee7b7",
  ];

  // ==========================
  // TEAM RECORDS
  // ==========================

  const highestKillMatch =
    filteredMatches.length > 0
      ? filteredMatches.reduce(
          (highest, match) =>
            Number(
              match.teamKills || 0
            ) >
            Number(
              highest.teamKills || 0
            )
              ? match
              : highest
        )
      : null;

  const topKiller = [
    ...analyticsPlayers,
  ].sort(
    (a, b) =>
      b.totalKills -
      a.totalKills
  )[0];

  const bestAverageKiller = [
    ...analyticsPlayers,
  ]
    .filter(
      (player) =>
        player.matchesPlayed > 0
    )
    .sort(
      (a, b) =>
        b.averageKills -
        a.averageKills
    )[0];

  const highestPointsMatch =
    matchChart.length > 0
      ? matchChart.reduce(
          (highest, match) =>
            match.totalPoints >
            highest.totalPoints
              ? match
              : highest
        )
      : null;

  // ==========================
  // FILTER HANDLERS
  // ==========================

  const handleTournamentChange = (
    value
  ) => {
    setSelectedTournament(value);

    // Reset dependent filters
    setSelectedRound("all");
    setSelectedMap("all");
  };

  const handleRoundChange = (
    value
  ) => {
    setSelectedRound(value);

    // Map options depend on round
    setSelectedMap("all");
  };

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

          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
                Team Analytics
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                Analyze team performance
                across tournaments, rounds
                and individual maps.
              </p>
            </div>

            <div className="border border-white/5 bg-white/[0.025] px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                Current Scope
              </p>

              <p className="mt-1 max-w-[280px] truncate text-xs font-black uppercase tracking-[0.12em] text-white">
                {currentScope}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================
          ANALYTICS FILTER
      ========================== */}

      <section className="border border-white/5 bg-[#080808] p-5 md:p-6">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#19c77a]">
            Performance Filter
          </p>

          <h2 className="mt-2 text-xl font-black uppercase tracking-wide text-white">
            Analytics Scope
          </h2>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-600">
            Drill down from overall team
            performance to a tournament,
            round or individual map.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {/* TOURNAMENT */}

          <FilterBox
            label="Tournament"
            value={selectedTournament}
            onChange={(value) =>
              handleTournamentChange(
                value
              )
            }
          >
            <option
              value="overall"
              className="bg-[#050505]"
            >
              Overall — All Tournaments
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
          </FilterBox>

          {/* ROUND */}

          <FilterBox
            label="Round"
            value={selectedRound}
            onChange={(value) =>
              handleRoundChange(value)
            }
            disabled={
              selectedTournament ===
              "overall"
            }
          >
            <option
              value="all"
              className="bg-[#050505]"
            >
              All Rounds
            </option>

            {availableRounds.map(
              (round) => (
                <option
                  key={round}
                  value={round}
                  className="bg-[#050505]"
                >
                  {round}
                </option>
              )
            )}
          </FilterBox>

          {/* MAP */}

          <FilterBox
            label="Map"
            value={selectedMap}
            onChange={(value) =>
              setSelectedMap(value)
            }
            disabled={
              selectedTournament ===
                "overall" ||
              availableMaps.length === 0
            }
          >
            <option
              value="all"
              className="bg-[#050505]"
            >
              All Maps
            </option>

            {availableMaps.map(
              (map) => (
                <option
                  key={map}
                  value={map}
                  className="bg-[#050505]"
                >
                  {map}
                </option>
              )
            )}
          </FilterBox>
        </div>

        {/* SCOPE SUMMARY */}

        <div className="mt-5 grid gap-3 border-t border-white/5 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <ScopeItem
            label="Tournament"
            value={
              selectedTournament ===
              "overall"
                ? "All"
                : selectedTournament
            }
          />

          <ScopeItem
            label="Round"
            value={
              selectedRound ===
              "all"
                ? "All"
                : selectedRound
            }
          />

          <ScopeItem
            label="Map"
            value={
              selectedMap === "all"
                ? "All"
                : selectedMap
            }
          />

          <ScopeItem
            label="Matches Analyzed"
            value={totalMatches}
            highlight
          />
        </div>
      </section>

      {/* ==========================
          TOP CARDS
      ========================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnalyticsCard
          label="Total Matches"
          value={totalMatches}
        />

        <AnalyticsCard
          label="Total Team Kills"
          value={totalKills}
          highlight
        />

        <AnalyticsCard
          label="Avg Kills / Match"
          value={averageKills}
          highlight
        />

        <AnalyticsCard
          label="Placement Points"
          value={totalPlacementPoints}
        />

        <AnalyticsCard
          label="Avg Placement Points"
          value={averagePlacementPoints}
        />

        <AnalyticsCard
          label="Total Points"
          value={totalPoints}
          highlight
        />

        <AnalyticsCard
          label="Average Placement"
          value={
            averagePlacement ||
            "-"
          }
        />

        <AnalyticsCard
          label="Best Placement"
          value={
            bestPlacement ||
            "-"
          }
          highlight
        />
      </div>

      {/* ==========================
          MATCH CHARTS
      ========================== */}

      <div className="grid gap-5 xl:grid-cols-2">
        {/* KILLS PER MATCH */}

        <ChartContainer
          title="Kills Per Match"
          subtitle="Team kill output across the selected matches."
        >
          {matchChart.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <LineChart
                data={matchChart}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                  vertical={false}
                />

                <XAxis
                  dataKey="match"
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
                    backgroundColor:
                      "#080808",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0px",
                    color: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="kills"
                  stroke="#19c77a"
                  strokeWidth={3}
                  dot={{
                    r: 3,
                    fill: "#19c77a",
                    strokeWidth: 0,
                  }}
                  activeDot={{
                    r: 5,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>

        {/* PLACEMENT POINTS */}

        <ChartContainer
          title="Placement Points Per Match"
          subtitle="Placement contribution across the selected matches."
        >
          {matchChart.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart
                data={matchChart}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                  vertical={false}
                />

                <XAxis
                  dataKey="match"
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
                    backgroundColor:
                      "#080808",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0px",
                    color: "#fff",
                  }}
                />

                <Bar
                  dataKey="placementPoints"
                  fill="#d4af37"
                  radius={[
                    3,
                    3,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </div>

      {/* ==========================
          ROUND + MAP PERFORMANCE
      ========================== */}

      <div className="grid gap-5 xl:grid-cols-2">
        {/* ROUND PERFORMANCE */}

        <ChartContainer
          title="Round Performance"
          subtitle="Performance comparison across rounds in the current scope."
        >
          {roundPerformance.length ===
          0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart
                data={roundPerformance}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                  vertical={false}
                />

                <XAxis
                  dataKey="round"
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
                    backgroundColor:
                      "#080808",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    color: "#fff",
                  }}
                />

                <Bar
                  dataKey="points"
                  fill="#19c77a"
                  radius={[
                    3,
                    3,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>

        {/* MAP PERFORMANCE */}

        <ChartContainer
          title="Map Performance"
          subtitle="Team performance by map within the current scope."
        >
          {mapPerformance.length ===
          0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart
                data={mapPerformance}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                  vertical={false}
                />

                <XAxis
                  dataKey="map"
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
                    backgroundColor:
                      "#080808",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    color: "#fff",
                  }}
                />

                <Bar
                  dataKey="totalPoints"
                  fill="#d4af37"
                  radius={[
                    3,
                    3,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </div>

      {/* ==========================
          MAP BREAKDOWN
      ========================== */}

      <section className="border border-white/5 bg-[#080808] p-5 md:p-6">
        <div className="mb-6">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#19c77a]">
            Map Intelligence
          </p>

          <h2 className="mt-2 text-xl font-black uppercase tracking-wide text-white">
            Map Performance Breakdown
          </h2>

          <p className="mt-2 text-xs leading-5 text-gray-600">
            Compare matches, kills, placement
            points and total points across
            maps in the current scope.
          </p>
        </div>

        {mapPerformance.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                    Map
                  </th>

                  <th className="px-4 py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                    Matches
                  </th>

                  <th className="px-4 py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                    Kills
                  </th>

                  <th className="px-4 py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                    Avg Kills
                  </th>

                  <th className="px-4 py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                    Placement Pts
                  </th>

                  <th className="px-4 py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                    Total Points
                  </th>
                </tr>
              </thead>

              <tbody>
                {mapPerformance.map(
                  (map) => (
                    <tr
                      key={map.map}
                      className="group border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-5">
                        <p className="font-black uppercase tracking-wide text-white group-hover:text-[#19c77a]">
                          {map.map}
                        </p>
                      </td>

                      <td className="px-4 py-5 text-center text-sm font-bold text-gray-400">
                        {map.matches}
                      </td>

                      <td className="px-4 py-5 text-center text-sm font-black text-[#19c77a]">
                        {map.kills}
                      </td>

                      <td className="px-4 py-5 text-center text-sm font-black text-[#d4af37]">
                        {map.matches > 0
                          ? (
                              map.kills /
                              map.matches
                            ).toFixed(2)
                          : "0"}
                      </td>

                      <td className="px-4 py-5 text-center text-sm font-bold text-gray-400">
                        {
                          map.placementPoints
                        }
                      </td>

                      <td className="px-4 py-5 text-center text-sm font-black text-white">
                        {map.totalPoints}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ==========================
          KILL CONTRIBUTION + RECORDS
      ========================== */}

      <div className="grid gap-5 xl:grid-cols-2">
        {/* KILL CONTRIBUTION */}

        <ChartContainer
          title="Kill Contribution"
          subtitle="Share of total team kills by player."
        >
          {pieData.length === 0 ? (
            <div className="flex h-[350px] items-center justify-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
                No kills recorded
              </p>
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
                  innerRadius={65}
                  paddingAngle={3}
                  label={({
                    name,
                    percent,
                  }) =>
                    `${name} ${(
                      percent * 100
                    ).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map(
                    (entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                        stroke="none"
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor:
                      "#080808",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>

        {/* TEAM RECORDS */}

        <section className="border border-white/5 bg-[#080808] p-6">
          <div className="mb-6">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#19c77a]">
              Performance Highlights
            </p>

            <h2 className="mt-2 text-xl font-black uppercase tracking-wide text-white">
              Team Records
            </h2>
          </div>

          <div className="space-y-3">
            <RecordCard
              label="Highest Kill Match"
              value={
                highestKillMatch
                  ? `${highestKillMatch.teamKills} Kills`
                  : "-"
              }
              description={
                highestKillMatch
                  ? `${
                      highestKillMatch.tournament ||
                      "Tournament"
                    } • ${
                      highestKillMatch.stage ||
                      "Round"
                    } • ${
                      highestKillMatch.map ||
                      "Map"
                    }`
                  : ""
              }
            />

            <RecordCard
              label="Highest Points Match"
              value={
                highestPointsMatch
                  ? `${highestPointsMatch.totalPoints} Points`
                  : "-"
              }
              highlight
            />

            <RecordCard
              label="Top Killer"
              value={
                topKiller?.ign ||
                topKiller?.name ||
                "-"
              }
              description={
                topKiller
                  ? `${topKiller.totalKills} total kills`
                  : ""
              }
              highlight
            />

            <RecordCard
              label="Best Average Killer"
              value={
                bestAverageKiller?.ign ||
                bestAverageKiller?.name ||
                "-"
              }
              description={
                bestAverageKiller
                  ? `${bestAverageKiller.averageKills} kills per match`
                  : ""
              }
              highlight
            />
          </div>
        </section>
      </div>

      {/* ==========================
          PLAYER × MAP
      ========================== */}

      <section className="border border-white/5 bg-[#080808] p-5 md:p-6">
        <div className="mb-6">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#19c77a]">
            Map Intelligence
          </p>

          <h2 className="mt-2 text-xl font-black uppercase tracking-wide text-white">
            Player × Map Performance
          </h2>

          <p className="mt-2 text-xs leading-5 text-gray-600">
            Individual player performance
            across every map in the selected
            analytics scope.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                  Player
                </th>

                {availableMaps.map(
                  (map) => (
                    <th
                      key={map}
                      className="px-4 py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-600"
                    >
                      {map}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {playerMapStats.map(
                (player) => (
                  <tr
                    key={player.id}
                    className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-5">
                      <p className="font-black uppercase tracking-wide text-white">
                        {player.ign ||
                          player.name}
                      </p>

                      <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-gray-600">
                        {player.role}
                      </p>
                    </td>

                    {availableMaps.map(
                      (map) => {
                        const stats =
                          player.mapStats[
                            map
                          ];

                        return (
                          <td
                            key={map}
                            className="px-4 py-5 text-center"
                          >
                            <p className="text-sm font-black text-[#19c77a]">
                              {stats
                                ?.kills ||
                                0}
                            </p>

                            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-gray-600">
                              {stats
                                ?.matches ||
                                0}{" "}
                              Matches
                            </p>
                          </td>
                        );
                      }
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==========================
          PLAYER STATISTICS
      ========================== */}

      <section className="border border-white/5 bg-[#080808] p-5 md:p-6">
        <div className="mb-6">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#19c77a]">
            Individual Performance
          </p>

          <h2 className="mt-2 text-xl font-black uppercase tracking-wide text-white">
            Player Statistics
          </h2>

          <p className="mt-2 text-xs leading-5 text-gray-600">
            Player performance for the
            selected analytics period.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                  Player
                </th>

                <th className="px-4 py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                  Matches
                </th>

                <th className="px-4 py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                  Total Kills
                </th>

                <th className="px-4 py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                  Avg Kills
                </th>
              </tr>
            </thead>

            <tbody>
              {[...analyticsPlayers]
                .sort(
                  (a, b) =>
                    b.totalKills -
                    a.totalKills
                )
                .map(
                  (
                    player,
                    index
                  ) => (
                    <tr
                      key={player.id}
                      className="group border-b border-white/5 transition-colors duration-300 last:border-b-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-gray-700">
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <div>
                            <p className="font-black uppercase tracking-wide text-white transition-colors group-hover:text-[#19c77a]">
                              {player.ign ||
                                player.name}
                            </p>

                            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-gray-600">
                              {player.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5 text-center text-sm font-bold text-gray-400">
                        {
                          player.matchesPlayed
                        }
                      </td>

                      <td className="px-4 py-5 text-center text-sm font-black text-[#19c77a]">
                        {
                          player.totalKills
                        }
                      </td>

                      <td className="px-4 py-5 text-center text-sm font-black text-[#d4af37]">
                        {
                          player.averageKills
                        }
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// ==========================
// FILTER BOX
// ==========================

function FilterBox({
  label,
  value,
  onChange,
  disabled = false,
  children,
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
        {label}
      </label>

      <select
        value={value}
        disabled={disabled}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={`h-12 w-full border bg-[#050505] px-4 text-sm font-semibold text-white outline-none transition ${
          disabled
            ? "cursor-not-allowed border-white/5 text-gray-700 opacity-50"
            : "border-white/10 focus:border-[#19c77a]/50"
        }`}
      >
        {children}
      </select>
    </div>
  );
}

// ==========================
// SCOPE ITEM
// ==========================

function ScopeItem({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="border border-white/5 bg-[#050505] px-4 py-3">
      <p className="text-[8px] font-black uppercase tracking-[0.18em] text-gray-600">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-xs font-black uppercase tracking-wide ${
          highlight
            ? "text-[#19c77a]"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// ==========================
// ANALYTICS CARD
// ==========================

function AnalyticsCard({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="group relative overflow-hidden border border-white/5 bg-[#080808] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#19c77a]/25">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#19c77a]/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
        {label}
      </p>

      <h2
        className={`mt-3 text-3xl font-black md:text-4xl ${
          highlight
            ? "text-[#19c77a]"
            : "text-white"
        }`}
      >
        {value}
      </h2>
    </div>
  );
}

// ==========================
// CHART CONTAINER
// ==========================

function ChartContainer({
  title,
  subtitle,
  children,
}) {
  return (
    <section className="border border-white/5 bg-[#080808] p-5 md:p-6">
      <div className="mb-5">
        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#19c77a]">
          Performance Data
        </p>

        <h2 className="mt-2 text-xl font-black uppercase tracking-wide text-white">
          {title}
        </h2>

        <p className="mt-1 text-xs text-gray-600">
          {subtitle}
        </p>
      </div>

      {children}
    </section>
  );
}

// ==========================
// RECORD CARD
// ==========================

function RecordCard({
  label,
  value,
  description,
  highlight = false,
}) {
  return (
    <div className="group border border-white/5 bg-[#050505] p-4 transition-all duration-300 hover:border-[#19c77a]/25">
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">
        {label}
      </p>

      <p
        className={`mt-2 truncate text-lg font-black uppercase tracking-wide ${
          highlight
            ? "text-[#19c77a]"
            : "text-white"
        }`}
      >
        {value}
      </p>

      {description && (
        <p className="mt-1 text-[10px] font-semibold text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
}

// ==========================
// EMPTY CHART
// ==========================

function EmptyChart() {
  return (
    <div className="flex h-[300px] items-center justify-center border border-dashed border-white/5">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
        No match data available
      </p>
    </div>
  );
}

export default Analytics;