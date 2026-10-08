import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { MatchContext } from "../context/MatchContext";

function PlayerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { players, matches } = useContext(MatchContext);

  const player = players.find(
    (p) => p.id === Number(id)
  );

  if (!player) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#050505] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#19c77a]/10 blur-[120px]" />
        </div>

        <div className="relative z-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center border border-[#19c77a]/30 bg-[#19c77a]/5">
            <span className="text-2xl font-black text-[#19c77a]">
              ?
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-black uppercase tracking-tight">
            Player Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            The requested player profile does not exist.
          </p>

          <button
            onClick={() => navigate("/players")}
            className="group mt-7 inline-flex items-center gap-3 border border-[#19c77a]/30 bg-[#19c77a]/5 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#19c77a] transition-all duration-300 hover:border-[#19c77a] hover:bg-[#19c77a]/10"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>

            Back to Players
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // PLAYER MATCHES
  // =========================================

  const playerMatches = matches.filter((match) => {
    const stats = match.playerStats?.[player.id];

    return stats !== undefined;
  });

  // =========================================
  // PLAYER STATS
  // =========================================

  const totalMatches = playerMatches.length;

  const totalKills = playerMatches.reduce(
    (sum, match) => {
      const stats =
        match.playerStats?.[player.id];

      return sum + Number(stats?.kills || 0);
    },
    0
  );

  const averageKills =
    totalMatches > 0
      ? (totalKills / totalMatches).toFixed(2)
      : "0.00";

  // =========================================
  // TOURNAMENT STATS
  // =========================================

  const tournamentStats = {};

  playerMatches.forEach((match) => {
    const tournament =
      match.tournament || "Other Matches";

    if (!tournamentStats[tournament]) {
      tournamentStats[tournament] = {
        matches: 0,
        kills: 0,
      };
    }

    tournamentStats[tournament].matches += 1;

    tournamentStats[tournament].kills += Number(
      match.playerStats?.[player.id]?.kills || 0
    );
  });

  const tournamentList = Object.entries(
    tournamentStats
  ).map(([name, stats]) => ({
    name,
    matches: stats.matches,
    kills: stats.kills,
    average:
      stats.matches > 0
        ? (stats.kills / stats.matches).toFixed(2)
        : "0.00",
  }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">

      {/* =========================================
          PAGE BACKGROUND
      ========================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[#19c77a]/8 blur-[140px]" />

        <div className="absolute right-[-15%] top-[35%] h-[500px] w-[500px] rounded-full bg-[#d4af37]/5 blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="relative z-10 space-y-10">

        {/* =========================================
            BACK BUTTON
        ========================================= */}

        <button
          onClick={() => navigate("/players")}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-gray-600 transition-all duration-300 hover:text-[#19c77a]"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>

          Back to Players
        </button>

        {/* =========================================
            PLAYER HERO
        ========================================= */}

        <section
          className="group relative overflow-hidden border border-white/10 bg-[#090909]"
          style={{
            animation:
              "playerHeroIn 0.8s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >

          {/* Top accent */}

          <div className="absolute left-0 top-0 z-30 h-[2px] w-full bg-gradient-to-r from-[#19c77a] via-[#19c77a]/40 to-transparent" />

          {/* Background glow */}

          <div className="absolute inset-0 bg-gradient-to-r from-[#19c77a]/5 via-transparent to-[#d4af37]/5" />

          {/* Decorative lines */}

          <div className="absolute right-[-5%] top-[-30%] h-[500px] w-[500px] rotate-12 border border-[#19c77a]/10" />

          <div className="absolute right-[8%] top-[-20%] h-[350px] w-[350px] rotate-12 border border-white/5" />

          <div className="relative grid min-h-[520px] md:grid-cols-2">

            {/* =====================================
                PLAYER IMAGE
            ===================================== */}

            <div className="relative flex min-h-[420px] items-end justify-center overflow-hidden bg-gradient-to-b from-[#101010] via-[#090909] to-[#050505] md:min-h-[560px]">

              {/* Grid */}

              <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Glow */}

              <div className="absolute bottom-[-15%] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#19c77a]/10 blur-[110px] transition-all duration-700 group-hover:bg-[#19c77a]/15" />

              {/* Image */}

              {player.image ? (
                <img
                  src={player.image}
                  alt={player.name}
                  className="relative z-10 h-full max-h-[560px] w-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-[1.025]"
                  style={{
                    animation:
                      "playerImageIn 1s cubic-bezier(0.22,1,0.36,1) 0.15s both",
                  }}
                />
              ) : (
                <div className="relative z-10 flex h-full items-center justify-center">
                  <div className="flex h-32 w-32 items-center justify-center border border-[#19c77a]/20 bg-[#19c77a]/5">
                    <span className="text-4xl font-black text-[#19c77a]">
                      SOUL
                    </span>
                  </div>
                </div>
              )}

              {/* Bottom fade */}

              <div className="absolute inset-x-0 bottom-0 z-20 h-48 bg-gradient-to-t from-[#090909] via-[#090909]/60 to-transparent" />

              {/* Role */}

              <div
                className="absolute right-5 top-5 z-30 border border-[#19c77a]/30 bg-[#050505]/90 px-4 py-2.5 backdrop-blur-md"
                style={{
                  animation:
                    "fadeSlideDown 0.7s ease-out 0.35s both",
                }}
              >
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#19c77a]">
                  {player.role || "Player"}
                </span>
              </div>

              {/* Player number */}

              <div className="absolute bottom-5 left-6 z-30">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                  Player Profile
                </p>

                <p className="mt-1 text-5xl font-black leading-none text-white/5">
                  0{player.id}
                </p>
              </div>
            </div>

            {/* =====================================
                PLAYER INFORMATION
            ===================================== */}

            <div className="relative flex flex-col justify-center p-7 md:p-12">

              <div
                style={{
                  animation:
                    "fadeSlideRight 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s both",
                }}
              >

                <div className="mb-5 flex items-center gap-3">
                  <span className="h-[2px] w-10 bg-[#19c77a]" />

                  <p className="text-[9px] font-black uppercase tracking-[0.35em] text-[#19c77a]">
                    SOUL ESPORTS
                  </p>
                </div>

                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">
                  Player Profile
                </p>

                <h1 className="mt-3 text-4xl font-black uppercase tracking-[-0.04em] text-white md:text-6xl">
                  {player.name}
                </h1>

                <p className="mt-3 text-xl font-black uppercase tracking-[0.12em] text-[#19c77a] md:text-2xl">
                  {player.ign}
                </p>

                <div className="mt-7 h-px bg-white/10" />

                {/* Player Info */}

                <div className="mt-6 grid grid-cols-2 gap-3">

                  <ProfileTag
                    label="Role"
                    value={player.role || "Player"}
                  />

                  <ProfileTag
                    label="Status"
                    value={
                      player.active
                        ? "ACTIVE"
                        : "INACTIVE"
                    }
                    green={player.active}
                  />

                </div>

                {/* Quick Stats */}

                <div className="mt-8 grid grid-cols-3 gap-3">

                  <HeroStat
                    label="Matches"
                    value={totalMatches}
                  />

                  <HeroStat
                    label="Kills"
                    value={totalKills}
                  />

                  <HeroStat
                    label="Avg Kills"
                    value={averageKills}
                  />

                </div>

                {/* =====================================
                    SOCIAL LINKS
                ===================================== */}

                {(player.instagram || player.youtube) && (
                  <div className="mt-8">

                    <p className="mb-3 text-[8px] font-black uppercase tracking-[0.25em] text-gray-600">
                      Follow Player
                    </p>

                    <div className="flex flex-wrap gap-3">

                      {player.instagram && (
                        <a
                          href={player.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          className="group/social inline-flex items-center gap-3 border border-white/10 bg-[#080808] px-5 py-3 text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#19c77a]/40 hover:bg-[#19c77a]/5 hover:text-[#19c77a]"
                        >
                          <FaInstagram
                            size={16}
                            className="transition-transform duration-300 group-hover/social:scale-110"
                          />

                          <span>Instagram</span>

                          <span className="text-gray-700 transition-all duration-300 group-hover/social:translate-x-1 group-hover/social:text-[#19c77a]">
                            ↗
                          </span>
                        </a>
                      )}

                      {player.youtube && (
                        <a
                          href={player.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          className="group/social inline-flex items-center gap-3 border border-white/10 bg-[#080808] px-5 py-3 text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37]/40 hover:bg-[#d4af37]/5 hover:text-[#d4af37]"
                        >
                          <FaYoutube
                            size={17}
                            className="transition-transform duration-300 group-hover/social:scale-110"
                          />

                          <span>YouTube</span>

                          <span className="text-gray-700 transition-all duration-300 group-hover/social:translate-x-1 group-hover/social:text-[#d4af37]">
                            ↗
                          </span>
                        </a>
                      )}

                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            OVERALL STATISTICS
        ========================================= */}

        <section
          style={{
            animation:
              "fadeSlideUp 0.7s ease-out 0.25s both",
          }}
        >

          <SectionHeading
            eyebrow="Performance"
            title="Overall Statistics"
          />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

            <StatBox
              label="Matches Played"
              value={totalMatches}
            />

            <StatBox
              label="Total Kills"
              value={totalKills}
              highlight
            />

            <StatBox
              label="Average Kills"
              value={averageKills}
              highlight
            />

            <StatBox
              label="Tournaments"
              value={tournamentList.length}
            />

          </div>
        </section>

        {/* =========================================
            PLAYER INFORMATION
        ========================================= */}

        <section
          className="border border-white/10 bg-[#090909] p-6 md:p-8"
          style={{
            animation:
              "fadeSlideUp 0.7s ease-out 0.35s both",
          }}
        >

          <SectionHeading
            eyebrow="Profile"
            title="Player Information"
          />

          <div className="grid gap-4 md:grid-cols-3">

            <InfoCard
              label="Player Name"
              value={player.name}
            />

            <InfoCard
              label="In-Game Name"
              value={player.ign || "—"}
            />

            <InfoCard
              label="Role"
              value={player.role || "—"}
            />

          </div>
        </section>

        {/* =========================================
            TOURNAMENT PERFORMANCE
        ========================================= */}

        <section
          style={{
            animation:
              "fadeSlideUp 0.7s ease-out 0.45s both",
          }}
        >

          <SectionHeading
            eyebrow="Tournament History"
            title="Tournament Performance"
          />

          {tournamentList.length === 0 ? (

            <div className="border border-white/10 bg-[#090909] p-6 text-sm text-gray-600">
              No tournament statistics available yet.
            </div>

          ) : (

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {tournamentList.map(
                (tournament, index) => (

                  <button
                    key={tournament.name}
                    onClick={() =>
                      navigate(
                        `/tournaments/${encodeURIComponent(
                          tournament.name
                        )}`
                      )
                    }
                    className="group relative overflow-hidden border border-white/10 bg-[#090909] p-5 text-left transition-all duration-500 hover:-translate-y-1 hover:border-[#19c77a]/40 hover:bg-[#0b100e]"
                    style={{
                      animation: `fadeSlideUp 0.5s ease-out ${
                        0.1 + index * 0.07
                      }s both`,
                    }}
                  >

                    <div className="absolute left-0 top-0 h-[2px] w-0 bg-[#19c77a] transition-all duration-500 group-hover:w-full" />

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#19c77a]">
                          Tournament
                        </p>

                        <h3 className="mt-2 text-lg font-black uppercase tracking-tight text-white">
                          {tournament.name}
                        </h3>
                      </div>

                      <span className="text-gray-700 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#19c77a]">
                        →
                      </span>

                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">

                      <StatBox
                        label="Matches"
                        value={tournament.matches}
                      />

                      <StatBox
                        label="Kills"
                        value={tournament.kills}
                        highlight
                      />

                      <StatBox
                        label="Avg"
                        value={tournament.average}
                        highlight
                      />

                    </div>
                  </button>
                )
              )}

            </div>
          )}
        </section>

        {/* =========================================
            FOOTER
        ========================================= */}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex-row md:text-left">

          <p className="text-2xl font-black tracking-[-0.04em]">
            SOUL<span className="text-[#19c77a]">.</span>
          </p>

          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-700">
            Player Performance Profile
          </p>

        </div>
      </div>

      {/* =========================================
          ANIMATION STYLES
      ========================================= */}

      <style>{`
        @keyframes playerHeroIn {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes playerImageIn {
          from {
            opacity: 0;
            transform: translateY(35px) scale(0.94);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeSlideRight {
          from {
            opacity: 0;
            transform: translateX(35px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeSlideDown {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}


// =========================================
// SECTION HEADING
// =========================================

function SectionHeading({
  eyebrow,
  title,
}) {
  return (
    <div className="mb-5">

      <div className="flex items-center gap-3">

        <span className="h-[2px] w-7 bg-[#19c77a]" />

        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#19c77a]">
          {eyebrow}
        </p>

      </div>

      <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
        {title}
      </h2>
    </div>
  );
}


// =========================================
// PROFILE TAG
// =========================================

function ProfileTag({
  label,
  value,
  green = false,
}) {
  return (
    <div className="border border-white/10 bg-[#080808] px-4 py-3 transition-all duration-300 hover:border-[#19c77a]/20">

      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">
        {label}
      </p>

      <p
        className={`mt-1 text-xs font-black uppercase tracking-[0.12em] ${
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
// HERO STAT
// =========================================

function HeroStat({
  label,
  value,
}) {
  return (
    <div className="border border-white/10 bg-[#080808] p-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-[#19c77a]/30">

      <p className="text-[8px] font-black uppercase tracking-[0.18em] text-gray-600">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-[#19c77a]">
        {value}
      </p>

    </div>
  );
}


// =========================================
// INFO CARD
// =========================================

function InfoCard({
  label,
  value,
}) {
  return (
    <div className="border border-white/5 bg-[#080808] p-4 transition-all duration-300 hover:border-[#19c77a]/20">

      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
        {label}
      </p>

      <p className="mt-2 text-lg font-black text-white">
        {value}
      </p>

    </div>
  );
}


// =========================================
// STAT BOX
// =========================================

function StatBox({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="border border-white/5 bg-[#080808] p-4 transition-all duration-300 hover:border-[#19c77a]/20">

      <p className="text-[8px] font-black uppercase tracking-[0.18em] text-gray-600">
        {label}
      </p>

      <p
        className={`mt-1 text-xl font-black ${
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

export default PlayerDetails;