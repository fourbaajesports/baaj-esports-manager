import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MatchContext } from "../context/MatchContext";

function TournamentDetails() {
  const { tournament } = useParams();
  const navigate = useNavigate();

  const {
    getTournamentMatches,
    getTournamentStages,
    getStageMatches,
    calculateTeamStats,
    calculatePlayerStats,
    getTournamentDetails,
    loadingTournaments,
  } = useContext(MatchContext);

  const tournamentName = decodeURIComponent(tournament);

  const tournamentDetails =
    getTournamentDetails(tournamentName);

  const matches =
    getTournamentMatches(tournamentName);

  const stages =
    getTournamentStages(tournamentName);

  const overallStats =
    calculateTeamStats(matches);

  const playerStats =
    calculatePlayerStats(matches);

  const sortedPlayers =
    Object.values(playerStats).sort(
      (a, b) => b.totalKills - a.totalKills
    );

  const finalPosition =
    tournamentDetails?.finalPosition;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* =========================
          BACKGROUND
      ========================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#19c77a]/10 blur-[120px]" />

        <div className="absolute right-[-10%] top-[35%] h-96 w-96 rounded-full bg-[#d4af37]/5 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative space-y-10">
        {/* =========================
            HEADER
        ========================= */}

        <section className="relative overflow-hidden border border-white/10 bg-[#0a0a0a]">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#19c77a] via-[#0b8f55] to-transparent" />

          <div className="absolute right-[-8%] top-[-55%] h-[500px] w-[500px] rotate-12 border border-[#19c77a]/10" />

          <div className="relative z-10 p-7 md:p-10 lg:p-12">
            <button
              onClick={() => navigate("/tournaments")}
              className="mb-7 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.25em] text-gray-600 transition-all duration-300 hover:gap-4 hover:text-[#19c77a]"
            >
              <span className="text-base">←</span>
              Back to Tournaments
            </button>

            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="min-w-0">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-[2px] w-10 bg-[#19c77a]" />

                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#19c77a]">
                    Tournament Run
                  </p>
                </div>

                <h1 className="break-words text-4xl font-black uppercase tracking-[-0.04em] sm:text-5xl md:text-6xl">
                  {tournamentName}
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
                  Complete tournament performance, stage breakdown and
                  player statistics.
                </p>
              </div>

              {/* FINAL POSITION */}

              <div className="shrink-0 border border-[#d4af37]/20 bg-[#d4af37]/[0.04] px-7 py-5">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600">
                  Final Position
                </p>

                <p className="mt-1 text-4xl font-black text-[#d4af37]">
                  {finalPosition
                    ? `#${finalPosition}`
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            OVERALL STATS
        ========================= */}

        <section>
          <div className="mb-5">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#19c77a]">
              Tournament Overview
            </p>

            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-3xl">
              Overall Performance
            </h2>
          </div>

          {loadingTournaments ? (
            <div className="border border-white/10 bg-[#0a0a0a] p-7 text-sm text-gray-500">
              Loading tournament details...
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <StatCard
                label="Final Position"
                value={
                  finalPosition
                    ? `#${finalPosition}`
                    : "—"
                }
                highlight="gold"
              />

              <StatCard
                label="Matches"
                value={overallStats.totalMatches}
              />

              <StatCard
                label="Team Kills"
                value={overallStats.totalKills}
              />

              <StatCard
                label="Avg Kills"
                value={overallStats.averageKills}
              />

              <StatCard
                label="Placement Points"
                value={overallStats.placementPoints}
              />

              <StatCard
                label="Total Points"
                value={overallStats.totalPoints}
                highlight="green"
              />
            </div>
          )}
        </section>

        {/* =========================
            STAGES
        ========================= */}

        <section>
          <div className="mb-5">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#19c77a]">
              Tournament Progression
            </p>

            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-3xl">
              Tournament Stages
            </h2>
          </div>

          {stages.length === 0 ? (
            <div className="border border-white/10 bg-[#0a0a0a] p-7 text-sm text-gray-500">
              No stage data available.
            </div>
          ) : (
            <div className="space-y-4">
              {stages.map((stage, index) => {
                const stageMatches =
                  getStageMatches(
                    tournamentName,
                    stage
                  );

                const stageStats =
                  calculateTeamStats(
                    stageMatches
                  );

                return (
                  <div
                    key={stage}
                    className="group relative overflow-hidden border border-white/10 bg-[#0a0a0a] p-5 transition-all duration-500 hover:border-[#19c77a]/25"
                  >
                    <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#19c77a] to-transparent opacity-60" />

                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-[#080808]">
                          <span className="text-[10px] font-black text-[#19c77a]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div>
                          <p className="text-[8px] font-black uppercase tracking-[0.25em] text-gray-600">
                            Stage
                          </p>

                          <h3 className="mt-2 text-xl font-black uppercase">
                            {stage}
                          </h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <MiniStat
                          label="Matches"
                          value={stageStats.totalMatches}
                        />

                        <MiniStat
                          label="Kills"
                          value={stageStats.totalKills}
                        />

                        <MiniStat
                          label="Placement"
                          value={stageStats.placementPoints}
                        />

                        <MiniStat
                          label="Points"
                          value={stageStats.totalPoints}
                          highlight
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================
            PLAYER PERFORMANCE
        ========================= */}

        <section>
          <div className="mb-5">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#19c77a]">
              Individual Statistics
            </p>

            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-3xl">
              Player Performance
            </h2>
          </div>

          <div className="overflow-hidden border border-white/10 bg-[#0a0a0a]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead className="border-b border-white/10 bg-[#080808]">
                  <tr>
                    <th className="px-5 py-4 text-left text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                      Player
                    </th>

                    <th className="px-5 py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                      Matches
                    </th>

                    <th className="px-5 py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                      Total Kills
                    </th>

                    <th className="px-5 py-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                      Avg Kills
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sortedPlayers.map((player, index) => (
                    <tr
                      key={player.id}
                      className="group border-b border-white/5 last:border-b-0 transition-colors duration-300 hover:bg-[#19c77a]/[0.025]"
                    >
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <span className="text-[9px] font-black text-gray-700">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div>
                            <p className="font-black uppercase text-white">
                              {player.ign}
                            </p>

                            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-gray-600">
                              Player
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 text-center text-sm font-bold text-gray-400">
                        {player.matchesPlayed}
                      </td>

                      <td className="px-5 py-5 text-center">
                        <span className="text-lg font-black text-[#19c77a]">
                          {player.totalKills}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-center text-sm font-bold text-gray-300">
                        {player.averageKills}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* =========================
            MATCHES
        ========================= */}

        <section>
          <div className="mb-5">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#19c77a]">
              Match Record
            </p>

            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-3xl">
              Tournament Matches
            </h2>
          </div>

          {matches.length === 0 ? (
            <div className="border border-white/10 bg-[#0a0a0a] p-7 text-sm text-gray-500">
              No matches have been added for this tournament yet.
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match, index) => {
                const matchStats =
                  calculateTeamStats([match]);

                return (
                  <div
                    key={
                      match.firestoreId ||
                      match.id ||
                      index
                    }
                    className="group relative overflow-hidden border border-white/10 bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-[#19c77a]/25 hover:bg-[#0b100e]"
                  >
                    <div className="absolute left-0 top-0 h-full w-[2px] bg-[#19c77a] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#19c77a]">
                            Match {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="h-px w-6 bg-white/10" />
                        </div>

                        <h3 className="mt-3 text-lg font-black uppercase">
                          {match.stage || "Stage not specified"}
                        </h3>

                        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-600">
                          {match.map || "Map unavailable"}{" "}
                          <span className="mx-1 text-gray-800">
                            •
                          </span>{" "}
                          {match.date || "Date unavailable"}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:w-auto">
                        <MiniStat
                          label="Placement"
                          value={
                            match.placement
                              ? `#${match.placement}`
                              : "—"
                          }
                        />

                        <MiniStat
                          label="Kills"
                          value={match.teamKills || 0}
                        />

                        <MiniStat
                          label="Points"
                          value={matchStats.totalPoints}
                          highlight
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex-row md:text-left">
          <p className="text-2xl font-black tracking-[-0.04em]">
            SOUL<span className="text-[#19c77a]">.</span>
          </p>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-700">
            Tournament Performance Archive
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
  label,
  value,
  highlight = false,
}) {
  let valueClass = "text-white";

  if (highlight === "green") {
    valueClass = "text-[#19c77a]";
  }

  if (highlight === "gold") {
    valueClass = "text-[#d4af37]";
  }

  return (
    <div className="group border border-white/10 bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-[#19c77a]/20 hover:bg-[#0c110f]">
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">
        {label}
      </p>

      <p
        className={`mt-3 text-2xl font-black ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================
   MINI STAT
========================= */

function MiniStat({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="min-w-[80px] border border-white/10 bg-[#080808] px-3 py-2.5 text-center transition-all duration-300 group-hover:border-white/15">
      <p className="text-[8px] font-black uppercase tracking-[0.15em] text-gray-600">
        {label}
      </p>

      <p
        className={`mt-1.5 text-sm font-black ${
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

export default TournamentDetails;