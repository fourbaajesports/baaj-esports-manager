import { useContext } from "react";
import { MatchContext } from "../context/MatchContext";

function Matches() {
  const { matches, players } = useContext(MatchContext);

  return (
    <div className="p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold text-yellow-400">
        🎮 Match History
      </h1>

      {matches.length === 0 ? (
        <div className="rounded-xl bg-slate-800 p-8 text-center text-gray-400">
          No Matches Played Yet
        </div>
      ) : (
        <div className="space-y-6">
          {matches
            .slice()
            .reverse()
            .map((match) => (
              <div
                key={match.id}
                className="rounded-xl bg-slate-800 p-6"
              >
                <h2 className="text-2xl font-bold text-yellow-400">
                  {match.tournament}
                </h2>

                <div className="mt-4 space-y-2">
                  <p>🗺️ Map : {match.map}</p>
                  <p>🏆 Placement : #{match.placement}</p>
                  <p>🔥 Team Kills : {match.teamKills}</p>
                  <p>📅 {match.date}</p>
                </div>

                <hr className="my-5 border-slate-700" />

                <h3 className="mb-3 text-xl font-semibold">
                  👥 Player Kills
                </h3>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="flex justify-between rounded-lg bg-slate-700 p-3"
                    >
                      <span>{player.name}</span>

                      <span className="font-bold text-yellow-400">
                        {match.playerKills[player.id] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Matches;