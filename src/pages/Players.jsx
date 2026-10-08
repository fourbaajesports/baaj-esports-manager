import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MatchContext } from "../context/MatchContext";

function Players() {
  const { players } = useContext(MatchContext);
  const navigate = useNavigate();

  const activePlayers = players.filter((player) => player.active);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#19c77a]/10 blur-[120px]" />

        <div className="absolute right-[-10%] top-[30%] h-96 w-96 rounded-full bg-[#d4af37]/5 blur-[120px]" />

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
            HERO
        ========================== */}
        <section className="relative overflow-hidden border border-white/10 bg-[#0a0a0a]">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#19c77a] via-[#0b8f55] to-transparent" />

          <div className="absolute right-[-8%] top-[-50%] h-[500px] w-[500px] rotate-12 border border-[#19c77a]/10" />

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
                  Team Roster
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
                  Meet the players representing SOUL on the battlefield.
                </p>
              </div>

              <div className="border border-white/10 bg-[#080808] px-7 py-5">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600">
                  Active Roster
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-black text-[#19c77a]">
                    {activePlayers.length}
                  </span>

                  <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
                    Players
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            ACTIVE LINEUP
        ========================== */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#19c77a]">
                Active Lineup
              </p>

              <h2 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-3xl">
                The Squad
              </h2>
            </div>

            <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-gray-700 md:block">
              Click player to view profile
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {activePlayers.map((player, index) => (
              <div
                key={player.id}
                onClick={() => navigate(`/players/${player.id}`)}
                className="group relative cursor-pointer overflow-hidden border border-white/10 bg-[#0a0a0a] transition-all duration-500 hover:-translate-y-1 hover:border-[#19c77a]/40 hover:bg-[#0c110f]"
              >
                {/* Top Hover Line */}
                <div className="absolute left-0 top-0 z-30 h-[2px] w-0 bg-[#19c77a] transition-all duration-500 group-hover:w-full" />

                {/* Player Number */}
                <div className="absolute left-5 top-5 z-30">
                  <span className="text-[10px] font-black tracking-[0.2em] text-white/20">
                    0{index + 1}
                  </span>
                </div>

                {/* Role */}
                <div className="absolute right-5 top-5 z-30 border border-[#19c77a]/20 bg-[#050505]/90 px-3 py-1.5 backdrop-blur">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#19c77a]">
                    {player.role}
                  </span>
                </div>

                {/* =========================
                    PLAYER IMAGE
                ========================== */}
                <div className="relative h-[440px] overflow-hidden bg-gradient-to-b from-[#111] via-[#0a0a0a] to-[#050505]">
                  {/* Green Glow */}
                  <div className="absolute bottom-[-20%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#19c77a]/10 blur-[90px] transition-all duration-500 group-hover:bg-[#19c77a]/20" />

                  {/* Grid */}
                  <div
                    className="absolute inset-0 z-0 opacity-[0.04]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                      backgroundSize: "35px 35px",
                    }}
                  />

                  {/* Player */}
                  <img
                    src={player.image}
                    alt={player.name}
                    className="relative z-10 h-full w-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-[1.035]"
                  />

                  {/* Bottom Fade */}
                  <div className="absolute inset-x-0 bottom-0 z-20 h-48 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/65 to-transparent" />

                  {/* Subtle Green Bottom Glow */}
                  <div className="absolute bottom-0 left-1/2 z-20 h-24 w-3/4 -translate-x-1/2 rounded-full bg-[#19c77a]/5 blur-3xl" />
                </div>

                {/* =========================
                    PLAYER INFO
                ========================== */}
                <div className="relative z-30 -mt-10 p-6">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600">
                    Player
                  </p>

                  <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">
                    {player.name}
                  </h2>

                  <p className="mt-1 text-sm font-black uppercase tracking-[0.15em] text-[#19c77a]">
                    {player.ign}
                  </p>

                  <div className="my-5 h-px bg-white/10" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-600">
                        Role
                      </p>

                      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-300">
                        {player.role}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-gray-600 transition-all duration-300 group-hover:text-[#19c77a]">
                      <span>View Profile</span>

                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Hover Line */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#19c77a] transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* =========================
            FOOTER
        ========================== */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex-row md:text-left">
          <div>
            <p className="text-2xl font-black tracking-[-0.04em]">
              SOUL<span className="text-[#19c77a]">.</span>
            </p>
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-700">
            Active Competitive Roster
          </p>
        </div>
      </div>
    </div>
  );
}

export default Players;