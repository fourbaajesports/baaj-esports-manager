import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MatchContext } from "../context/MatchContext";
import { AuthContext } from "../context/AuthContext";
import { FaTrash, FaEdit } from "react-icons/fa";

function Matches() {
  const {
    matches,
    players,
    deleteMatch,
    calculateTeamStats,
  } = useContext(MatchContext);

  const { isCoach } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* BACKGROUND */}
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
                  Match History
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
                  Complete record of tournament matches, results and player
                  performance.
                </p>
              </div>

              {/* MATCH COUNT */}
              <div className="border border-white/10 bg-[#080808] px-7 py-5">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600">
                  Recorded Matches
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-black text-[#19c77a]">
                    {matches.length}
                  </span>

                  <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
                    Matches
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            EMPTY STATE
        ========================= */}

        {matches.length === 0 ? (
          <div className="border border-white/10 bg-[#0a0a0a] p-12 text-center">
            <div className="mx-auto mb-5 h-10 w-10 border border-white/10" />

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#19c77a]">
              Match Records
            </p>

            <h2 className="mt-3 text-2xl font-black uppercase">
              No Matches Recorded
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              No matches have been added to the system yet.
            </p>
          </div>
        ) : (
          <section>
            {/* SECTION TITLE */}

            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#19c77a]">
                  Competitive Record
                </p>

                <h2 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-3xl">
                  All Matches
                </h2>
              </div>

              <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-gray-700 md:block">
                Latest results first
              </span>
            </div>

            {/* MATCH LIST */}

            <div className="space-y-6">
              {matches
                .slice()
                .reverse()
                .map((match, index) => {
                  const matchStats = calculateTeamStats([match]);

                  return (
                    <div
                      key={
                        match.firestoreId ||
                        match.id ||
                        index
                      }
                      className="group relative overflow-hidden border border-white/10 bg-[#0a0a0a] transition-all duration-500 hover:border-[#19c77a]/30"
                    >
                      {/* TOP ACCENT */}

                      <div className="absolute left-0 top-0 z-20 h-[2px] w-0 bg-[#19c77a] transition-all duration-500 group-hover:w-full" />

                      {/* SIDE ACCENT */}

                      <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#19c77a] via-[#0b8f55] to-transparent" />

                      <div className="p-6 md:p-8">
                        {/* =========================
                            MATCH HEADER
                        ========================= */}

                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#19c77a]">
                                Match {matches.length - index}
                              </span>

                              <span className="h-px w-8 bg-white/10" />

                              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-700">
                                {match.date || "Date unavailable"}
                              </span>
                            </div>

                            <h2 className="mt-3 text-2xl font-black uppercase tracking-tight md:text-3xl">
                              {match.tournament || "Tournament"}
                            </h2>

                            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-600">
                              {match.stage || "Stage not specified"}
                            </p>
                          </div>

                          {/* ADMIN ACTIONS */}

                          {isCoach && (
                            <div className="flex gap-3">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/admin/edit-match/${
                                      match.firestoreId ||
                                      match.id
                                    }`
                                  )
                                }
                                className="group/edit flex items-center gap-2 border border-white/10 bg-white/[0.03] px-4 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 transition-all duration-300 hover:border-[#19c77a]/40 hover:bg-[#19c77a]/10 hover:text-[#19c77a]"
                              >
                                <FaEdit className="transition-transform duration-300 group-hover/edit:scale-110" />
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  deleteMatch(
                                    match.firestoreId ||
                                      match.id
                                  )
                                }
                                className="group/delete flex items-center gap-2 border border-red-500/10 bg-red-500/[0.03] px-4 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-red-400 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10"
                              >
                                <FaTrash className="transition-transform duration-300 group-hover/delete:scale-110" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>

                        {/* DIVIDER */}

                        <div className="my-7 h-px bg-white/10" />

                        {/* =========================
                            MATCH INFORMATION
                        ========================= */}

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                          <InfoCard
                            label="Stage"
                            value={match.stage || "—"}
                          />

                          <InfoCard
                            label="Map"
                            value={match.map || "—"}
                          />

                          <InfoCard
                            label="Placement"
                            value={
                              match.placement
                                ? `#${match.placement}`
                                : "—"
                            }
                            highlight
                          />

                          <InfoCard
                            label="Team Kills"
                            value={match.teamKills || 0}
                            highlight
                          />

                          <InfoCard
                            label="Match Points"
                            value={matchStats.totalPoints}
                            highlight
                          />
                        </div>

                        {/* =========================
                            PLAYER PERFORMANCE
                        ========================= */}

                        <div className="mt-9">
                          <div className="mb-5 flex items-end justify-between">
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#19c77a]">
                                Individual Statistics
                              </p>

                              <h3 className="mt-2 text-xl font-black uppercase">
                                Player Performance
                              </h3>
                            </div>

                            <span className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-gray-700 md:block">
                              Kills
                            </span>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {players.map((player) => {
                              const stats =
                                match.playerStats?.[
                                  player.id
                                ] || {};

                              return (
                                <div
                                  key={player.id}
                                  className="group/player border border-white/10 bg-[#080808] p-4 transition-all duration-300 hover:border-[#19c77a]/25 hover:bg-[#0b100e]"
                                >
                                  <div className="flex items-center justify-between gap-4">
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-black uppercase text-white">
                                        {player.name}
                                      </p>

                                      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-gray-600">
                                        {player.role}
                                      </p>
                                    </div>

                                    <div className="text-right">
                                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-600">
                                        Kills
                                      </p>

                                      <p className="mt-1 text-2xl font-black text-[#19c77a] transition-transform duration-300 group-hover/player:scale-105">
                                        {stats.kills || 0}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="mt-4 h-px bg-white/5" />

                                  <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-700">
                                      Performance
                                    </span>

                                    <span className="h-1.5 w-1.5 rounded-full bg-[#19c77a]/60" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* FOOTER */}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex-row md:text-left">
          <p className="text-2xl font-black tracking-[-0.04em]">
            SOUL<span className="text-[#19c77a]">.</span>
          </p>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-700">
            Competitive Match Archive
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================
   INFO CARD
========================= */

function InfoCard({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="group border border-white/10 bg-[#080808] p-4 transition-all duration-300 hover:border-[#19c77a]/20 hover:bg-[#0b100e]">
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

export default Matches;