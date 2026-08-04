import { useContext } from "react";
import { MatchContext } from "../context/MatchContext";

function Players() {
  const { players } = useContext(MatchContext);

  return (
    <div className="p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold text-yellow-400">
        👥 Players
      </h1>

      <div className="overflow-x-auto rounded-xl bg-slate-800">
        <table className="w-full">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-4 text-left">Player</th>
              <th>Role</th>
              <th>IGN</th>
              <th>Matches</th>
              <th>Kills</th>
              <th>Performance</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {players.map((player) => (
              <tr
                key={player.id}
                className="border-t border-slate-700"
              >
                <td className="p-4 font-semibold">
                  {player.name}
                </td>

                <td>{player.role}</td>

                <td>{player.ign}</td>

                <td>{player.matchesPlayed}</td>

                <td>{player.totalKills}</td>

                <td>{player.performancePoints}</td>

                <td>
                  {player.active ? "🟢 Playing" : "🟡 Rotation"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Players;