import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MatchContext } from "../context/MatchContext";

function Tournaments() {
  const {
    getTournamentNames,
    getTournamentMatches,
    calculateTeamStats,
    getTournamentDetails,
  } = useContext(MatchContext);

  const navigate = useNavigate();

  const tournaments = getTournamentNames();

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
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-[2px] w-10 bg-[#19c77a]" />

                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#19c77a]">
                    SOUL ESPORTS
                  </p>
                </div>

                <h1 className="text-4xl font-black uppercase tracking-[-0.04em] sm:text-5xl md:text-6xl">
                  Tournaments
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
                  Explore tournament-wise performance, results and stage
                  statistics.
                </p>
              </div>

              {/* TOURNAMENT COUNT */}

              <div className="border border-white/10 bg-[#080808] px-7 py-5">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600">
                  Competitive Events
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-black text-[#19c77a]">
                    {tournaments.length}
                  </span>

                  <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
                    Tournaments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            EMPTY STATE
        ========================= */}

        {tournaments.length === 0 ? (
          <div className="border border-white/10 bg-[#0a0a0a] p-12 text-center">
            <div className="mx-auto mb-5 h-10 w-10 border border-white/10" />

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#19c77a]">
              Competitive History
            </p>

            <h2 className="mt-3 text-2xl font-black uppercase">
              No Tournaments Available
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Tournament records will appear here once matches are added.
            </p>
          </div>
        ) : (
          <section>
            {/* =========================
                SECTION TITLE
            ========================= */}

            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#19c77a]">
                  Competitive History
                </p>

                <h2 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-3xl">
                  Tournament Runs
                </h2>
              </div>

              <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-gray-700 md:block">
                Select tournament to view details
              </span>
            </div>

            {/* =========================
                TOURNAMENT GRID
            ========================= */}

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {tournaments.map((tournament, index) => {
                const matches =
                  getTournamentMatches(tournament);

                const stats =
                  calculateTeamStats(matches);

                const tournamentDetails =
                  getTournamentDetails(tournament);

                const finalPosition =
                  tournamentDetails?.finalPosition;

                return (
                  <button
                    key={tournament}
                    onClick={() =>
                      navigate(
                        `/tournaments/${encodeURIComponent(
                          tournament
                        )}`
                      )
                    }
                    className="group relative overflow-hidden border border-white/10 bg-[#0a0a0a] p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:border-[#19c77a]/40 hover:bg-[#0c110f]"
                  >
                    {/* TOP ACCENT */}

                    <div className="absolute left-0 top-0 z-20 h-[2px] w-0 bg-[#19c77a] transition-all duration-500 group-hover:w-full" />

                    {/* LEFT ACCENT */}

                    <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#19c77a] via-[#0b8f55] to-transparent opacity-60" />

                    {/* BACKGROUND NUMBER */}

                    <span className="pointer-events-none absolute bottom-[-25px] right-2 text-[120px] font-black leading-none text-white/[0.015] transition-all duration-500 group-hover:text-[#19c77a]/[0.03]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* =========================
                        TOP
                    ========================= */}

                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#19c77a]">
                          Tournament {String(index + 1).padStart(2, "0")}
                        </p>

                        <h2 className="mt-3 break-words text-xl font-black uppercase tracking-tight text-white transition-colors duration-300 group-hover:text-[#19c77a]">
                          {tournament}
                        </h2>
                      </div>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#d4af37]/20 bg-[#d4af37]/5">
                        <span className="text-[10px] font-black text-[#d4af37]">
                          TR
                        </span>
                      </div>
                    </div>

                    {/* =========================
                        FINAL POSITION
                    ========================= */}

                    <div className="relative z-10 mt-6 border border-[#d4af37]/15 bg-[#d4af37]/[0.04] p-4 transition-all duration-300 group-hover:border-[#d4af37]/25">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">
                            Final Position
                          </p>

                          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                            Tournament Result
                          </p>
                        </div>

                        <p className="text-3xl font-black text-[#d4af37]">
                          {finalPosition
                            ? `#${finalPosition}`
                            : "—"}
                        </p>
                      </div>
                    </div>

                    {/* =========================
                        STATS
                    ========================= */}

                    <div className="relative z-10 mt-4 grid grid-cols-2 gap-3">
                      <StatBox
                        label="Matches"
                        value={stats.totalMatches}
                      />

                      <StatBox
                        label="Team Kills"
                        value={stats.totalKills}
                      />

                      <StatBox
                        label="Avg Kills"
                        value={stats.averageKills}
                      />

                      <StatBox
                        label="Total Points"
                        value={stats.totalPoints}
                        highlight
                      />
                    </div>

                    {/* =========================
                        FOOTER
                    ========================= */}

                    <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 transition-colors duration-300 group-hover:text-gray-400">
                        View Tournament
                      </span>

                      <span className="text-lg font-black text-[#19c77a] transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

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
   STAT BOX
========================= */

function StatBox({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="border border-white/10 bg-[#080808] p-3 transition-all duration-300 group-hover:border-white/15">
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">
        {label}
      </p>

      <p
        className={`mt-2 text-lg font-black ${
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

export default Tournaments;