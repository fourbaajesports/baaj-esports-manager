import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MatchContext } from "../context/MatchContext";

function Players() {
  const { players } = useContext(MatchContext);
  const navigate = useNavigate();

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
                className="cursor-pointer border-t border-slate-700 transition hover:bg-slate-700"
                onClick={() => navigate(`/players/${player.id}`)}
              >
                <td className="p-4 font-semibold text-yellow-400">
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

      <p className="mt-4 text-sm text-gray-400">
        💡 Click on any player to view detailed statistics.
      </p>
    </div>
  );
}

export default Players;