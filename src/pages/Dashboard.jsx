import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MatchContext } from "../context/MatchContext";

function Dashboard() {
  const {
    matches,
    getTournamentNames,
    getTournamentMatches,
    calculateTeamStats,
    getTournamentDetails,
  } = useContext(MatchContext);

  const navigate = useNavigate();

  // =========================
  // BASIC STATS
  // =========================

  const totalMatches = matches.length;

  const totalKills = matches.reduce(
    (sum, match) =>
      sum + Number(match.teamKills || 0),
    0
  );

  const averageKills =
    totalMatches > 0
      ? Number(
          (totalKills / totalMatches).toFixed(2)
        )
      : 0;

  // =========================
  // PLACEMENT POINTS
  // =========================

  const placementPointsMap = {
    1: 10,
    2: 6,
    3: 5,
    4: 4,
    5: 3,
    6: 2,
    7: 1,
    8: 1,
  };

  const totalPlacementPoints = matches.reduce(
    (sum, match) =>
      sum +
      (placementPointsMap[
        Number(match.placement)
      ] || 0),
    0
  );

  const totalPoints =
    totalKills + totalPlacementPoints;

  // =========================
  // TOURNAMENTS
  // =========================

  const tournamentNames =
    getTournamentNames();

  const totalTournaments =
    tournamentNames.length;

  const tournamentResults =
    tournamentNames
      .map((tournament) => {
        const tournamentMatches =
          getTournamentMatches(tournament);

        const stats =
          calculateTeamStats(
            tournamentMatches
          );

        const details =
          getTournamentDetails(
            tournament
          );

        return {
          name: tournament,
          finalPosition:
            details?.finalPosition || null,
          totalMatches:
            stats.totalMatches,
          totalKills:
            stats.totalKills,
          totalPoints:
            stats.totalPoints,
        };
      })
      .sort((a, b) => {
        if (
          a.finalPosition &&
          b.finalPosition
        ) {
          return (
            a.finalPosition -
            b.finalPosition
          );
        }

        if (a.finalPosition) return -1;
        if (b.finalPosition) return 1;

        return (
          b.totalPoints -
          a.totalPoints
        );
      });

  // =========================
  // BEST TOURNAMENT RUN
  // =========================

  const bestTournamentRun =
    tournamentResults.length > 0
      ? [...tournamentResults].sort(
          (a, b) => {
            // Completed tournaments first
            if (
              a.finalPosition &&
              !b.finalPosition
            ) {
              return -1;
            }

            if (
              !a.finalPosition &&
              b.finalPosition
            ) {
              return 1;
            }

            // Better final position first
            if (
              a.finalPosition &&
              b.finalPosition &&
              a.finalPosition !==
                b.finalPosition
            ) {
              return (
                a.finalPosition -
                b.finalPosition
              );
            }

            // Same position → higher points
            return (
              b.totalPoints -
              a.totalPoints
            );
          }
        )[0]
      : null;

  // =========================
  // RECENT MATCHES
  // =========================

  const recentMatches = [...matches]
    .reverse()
    .slice(0, 5);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">

      {/* =========================================
          BACKGROUND ATMOSPHERE
      ========================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#0b8f55]/10 blur-[120px]" />

        <div className="absolute right-0 top-[500px] h-96 w-96 rounded-full bg-[#d4af37]/5 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

      </div>

      <div className="relative space-y-10 p-4 md:p-8 lg:p-10">

        {/* =========================================
            HERO
        ========================================= */}

        <section className="relative min-h-[480px] overflow-hidden border border-white/10 bg-[#0a0a0a]">

          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#19c77a] via-[#0b8f55] to-transparent" />

          <div className="absolute right-[-10%] top-[-30%] h-[700px] w-[700px] rotate-12 border border-[#19c77a]/10" />

          <div className="absolute right-[-5%] top-[-20%] h-[550px] w-[550px] rotate-12 border border-[#d4af37]/10" />

          <div className="absolute bottom-0 right-0 h-[70%] w-[55%] bg-gradient-to-l from-[#0b8f55]/10 to-transparent" />

          <div className="relative z-10 flex min-h-[480px] flex-col justify-center p-8 md:p-14 lg:p-20">

            <div className="max-w-4xl">

              <div className="mb-6 flex items-center gap-3">

                <span className="h-[2px] w-12 bg-[#19c77a]" />

                <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#19c77a]">
                  SOUL ESPORTS
                </p>

              </div>

              <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl">
                ROK SAKO TOH
                <span className="block text-[#19c77a]">
                  ROK LO.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
                Team performance, competitive results,
                tournament history and battlefield
                statistics — all in one place.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">

                <button
                  onClick={() =>
                    navigate("/players")
                  }
                  className="group relative overflow-hidden bg-[#19c77a] px-7 py-4 text-xs font-black uppercase tracking-[0.15em] text-black transition duration-300 hover:bg-[#25df8c]"
                >
                  <span className="relative z-10">
                    Explore Roster
                  </span>

                  <span className="absolute inset-0 -translate-x-full bg-white/20 transition duration-500 group-hover:translate-x-0" />
                </button>

                <button
                  onClick={() =>
                    navigate("/history")
                  }
                  className="border border-white/15 bg-white/[0.03] px-7 py-4 text-xs font-black uppercase tracking-[0.15em] text-white transition duration-300 hover:border-[#19c77a]/50 hover:bg-[#19c77a]/5"
                >
                  Match History
                </button>

              </div>

            </div>

          </div>

          {/* Hero graphic */}

          <div className="pointer-events-none absolute bottom-8 right-8 hidden lg:block">

            <div className="relative">

              <div className="absolute inset-0 rounded-full bg-[#19c77a]/20 blur-[80px]" />

              <div className="relative text-[180px] font-black italic leading-none text-white/[0.025]">
                SOUL
              </div>

              <div className="absolute bottom-[-15px] right-5 flex items-center gap-3">

                <div className="h-[2px] w-20 bg-[#19c77a]" />

                <span className="text-xs font-black uppercase tracking-[0.3em] text-[#19c77a]">
                  COMPETE
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =========================================
            PERFORMANCE STRIP
        ========================================= */}

        <section>

          <div className="mb-5 flex items-end justify-between">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#19c77a]">
                Performance Data
              </p>

              <h2 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-3xl">
                Team Numbers
              </h2>

            </div>

            <span className="hidden text-xs uppercase tracking-[0.2em] text-gray-600 md:block">
              Live statistics
            </span>

          </div>

          <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-3">

            <EsportsStat
              label="Total Tournaments"
              value={totalTournaments}
              number="01"
            />

            <EsportsStat
              label="Total Matches"
              value={totalMatches}
              number="02"
            />

            <EsportsStat
              label="Total Team Kills"
              value={totalKills}
              number="03"
              green
            />

            <EsportsStat
              label="Avg Kills / Match"
              value={averageKills}
              number="04"
            />

            <EsportsStat
              label="Placement Points"
              value={totalPlacementPoints}
              number="05"
            />

            <EsportsStat
              label="Total Points"
              value={totalPoints}
              number="06"
              green
            />

          </div>

        </section>

        {/* =========================================
            BEST TOURNAMENT RUN
        ========================================= */}

        <section className="relative overflow-hidden border border-white/10 bg-[#0a0a0a]">

          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#19c77a]/10 to-transparent" />

          <div className="relative flex flex-col justify-between gap-8 p-7 md:flex-row md:items-center md:p-10">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37]">
                Competitive Record
              </p>

              <h2 className="mt-3 text-3xl font-black uppercase md:text-4xl">
                Best Tournament Run
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {bestTournamentRun
                  ? "SOUL's strongest overall tournament performance"
                  : "No tournament performance recorded yet"}
              </p>

              {bestTournamentRun && (
                <div className="mt-5">

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
                    Tournament
                  </p>

                  <p className="mt-1 text-xl font-black uppercase text-white">
                    {bestTournamentRun.name}
                  </p>

                </div>
              )}

            </div>

            {bestTournamentRun && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

                <RunStat
                  label="Position"
                  value={
                    bestTournamentRun.finalPosition
                      ? `#${bestTournamentRun.finalPosition}`
                      : "—"
                  }
                />

                <RunStat
                  label="Points"
                  value={
                    bestTournamentRun.totalPoints
                  }
                  green
                />

                <RunStat
                  label="Kills"
                  value={
                    bestTournamentRun.totalKills
                  }
                />

              </div>
            )}

          </div>

        </section>

        {/* =========================================
            MAIN CONTENT
        ========================================= */}

        <div className="grid gap-8 xl:grid-cols-2">

          {/* =========================================
              TOURNAMENT RESULTS
          ========================================= */}

          <section>

            <SectionHeading
              eyebrow="Competitive Record"
              title="Tournament Results"
              subtitle="Latest tournament performances"
              action="View All"
              onClick={() =>
                navigate("/tournaments")
              }
            />

            {tournamentResults.length === 0 ? (

              <EmptyState text="No tournaments available yet." />

            ) : (

              <div className="space-y-2">

                {tournamentResults
                  .slice(0, 5)
                  .map((tournament, index) => (

                    <button
                      key={tournament.name}
                      onClick={() =>
                        navigate(
                          `/tournaments/${encodeURIComponent(
                            tournament.name
                          )}`
                        )
                      }
                      className="group relative flex w-full items-center justify-between overflow-hidden border border-white/10 bg-[#0a0a0a] p-5 text-left transition duration-300 hover:border-[#19c77a]/40 hover:bg-[#0d110f]"
                    >

                      <div className="absolute left-0 top-0 h-full w-0.5 bg-[#19c77a] opacity-0 transition group-hover:opacity-100" />

                      <div className="flex items-center gap-4">

                        <span className="text-xs font-black text-gray-700">
                          0{index + 1}
                        </span>

                        <div>

                          <h3 className="font-bold uppercase tracking-wide text-white">
                            {tournament.name}
                          </h3>

                          <p className="mt-1 text-xs text-gray-500">
                            {tournament.totalMatches} matches
                            {" • "}
                            {tournament.totalKills} kills
                            {" • "}
                            {tournament.totalPoints} points
                          </p>

                        </div>

                      </div>

                      <div className="text-right">

                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-600">
                          Position
                        </p>

                        <p className="text-2xl font-black text-[#19c77a]">
                          {tournament.finalPosition
                            ? `#${tournament.finalPosition}`
                            : "—"}
                        </p>

                      </div>

                    </button>

                  ))}

              </div>

            )}

          </section>

          {/* =========================================
              RECENT MATCHES
          ========================================= */}

          <section>

            <SectionHeading
              eyebrow="Battle Log"
              title="Recent Matches"
              subtitle="Latest recorded match results"
              action="View All"
              onClick={() =>
                navigate("/history")
              }
            />

            {recentMatches.length === 0 ? (

              <EmptyState text="No matches have been played yet." />

            ) : (

              <div className="space-y-2">

                {recentMatches.map(
                  (match, index) => (

                    <div
                      key={
                        match.firestoreId ||
                        match.id ||
                        index
                      }
                      className="group border border-white/10 bg-[#0a0a0a] p-5 transition duration-300 hover:border-[#19c77a]/40 hover:bg-[#0d110f]"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#19c77a]">
                            {match.tournament}
                          </p>

                          <h3 className="mt-2 font-bold uppercase tracking-wide">
                            {match.stage}
                          </h3>

                          <p className="mt-2 text-xs text-gray-500">
                            {match.map}
                            {" • "}
                            {match.date}
                          </p>

                        </div>

                        <div className="text-right">

                          <p className="text-[9px] font-bold uppercase tracking-wider text-gray-600">
                            Placement
                          </p>

                          <p className="text-2xl font-black text-white">
                            #{match.placement}
                          </p>

                        </div>

                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden bg-white/10">

                        <MatchMetric
                          label="Team Kills"
                          value={match.teamKills}
                        />

                        <MatchMetric
                          label="Match Points"
                          value={
                            calculateTeamStats(
                              [match]
                            ).totalPoints
                          }
                          green
                        />

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        </div>

        {/* =========================================
            TEAM SUMMARY
        ========================================= */}

        <section className="border border-white/10 bg-[#0a0a0a]">

          <div className="border-b border-white/10 p-6 md:p-8">

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#19c77a]">
              Complete Overview
            </p>

            <h2 className="mt-2 text-2xl font-black uppercase md:text-3xl">
              Team Summary
            </h2>

          </div>

          <div className="grid divide-y divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">

            <SummaryItem
              label="Matches Played"
              value={totalMatches}
            />

            <SummaryItem
              label="Total Kills"
              value={totalKills}
            />

            <SummaryItem
              label="Average Kills"
              value={averageKills}
            />

            <SummaryItem
              label="Total Points"
              value={totalPoints}
              green
            />

          </div>

        </section>

        {/* =========================================
            BOTTOM BRANDING
        ========================================= */}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex-row md:text-left">

          <div>

            <p className="text-2xl font-black tracking-[-0.04em]">
              SOUL<span className="text-[#19c77a]">.</span>
            </p>

          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-700">
            Competitive Performance Dashboard
          </p>

        </div>

      </div>
    </div>
  );
}


// =========================================
// ESPORTS STAT
// =========================================

function EsportsStat({
  label,
  value,
  number,
  green = false,
}) {
  return (
    <div className="group relative bg-[#080808] p-6 transition duration-300 hover:bg-[#0d110f]">

      <div className="flex items-start justify-between">

        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600">
          {number}
        </p>

        <div
          className={`h-2 w-2 rounded-full ${
            green
              ? "bg-[#19c77a] shadow-[0_0_12px_#19c77a]"
              : "bg-[#d4af37]"
          }`}
        />

      </div>

      <p
        className={`mt-7 text-4xl font-black tracking-tight ${
          green
            ? "text-[#19c77a]"
            : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
        {label}
      </p>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#19c77a] transition-all duration-500 group-hover:w-full" />

    </div>
  );
}


// =========================================
// SECTION HEADING
// =========================================

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  onClick,
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">

      <div>

        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#19c77a]">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">
          {title}
        </h2>

        <p className="mt-1 text-xs text-gray-600">
          {subtitle}
        </p>

      </div>

      <button
        onClick={onClick}
        className="shrink-0 border-b border-transparent pb-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 transition hover:border-[#19c77a] hover:text-[#19c77a]"
      >
        {action} →
      </button>

    </div>
  );
}


// =========================================
// MATCH METRIC
// =========================================

function MatchMetric({
  label,
  value,
  green = false,
}) {
  return (
    <div className="bg-[#080808] p-3">

      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-black ${
          green
            ? "text-[#19c77a]"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}


// =========================================
// BEST RUN STAT
// =========================================

function RunStat({
  label,
  value,
  green = false,
}) {
  return (
    <div className="min-w-[100px] border border-white/10 bg-[#080808] px-5 py-4 text-center">

      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-black ${
          green
            ? "text-[#19c77a]"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}


// =========================================
// EMPTY STATE
// =========================================

function EmptyState({ text }) {
  return (
    <div className="border border-dashed border-white/10 bg-[#080808] p-8 text-center">

      <div className="mx-auto mb-4 h-8 w-8 border border-[#19c77a]/30" />

      <p className="text-sm text-gray-600">
        {text}
      </p>

    </div>
  );
}


// =========================================
// SUMMARY ITEM
// =========================================

function SummaryItem({
  label,
  value,
  green = false,
}) {
  return (
    <div className="group bg-[#080808] p-6 transition duration-300 hover:bg-[#0d110f] md:p-8">

      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600">
        {label}
      </p>

      <p
        className={`mt-3 text-3xl font-black ${
          green
            ? "text-[#19c77a]"
            : "text-white"
        }`}
      >
        {value}
      </p>

      <div className="mt-4 h-[2px] w-8 bg-[#19c77a] transition-all duration-300 group-hover:w-16" />

    </div>
  );
}

export default Dashboard;