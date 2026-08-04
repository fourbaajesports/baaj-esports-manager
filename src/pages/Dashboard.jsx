import { useContext } from "react";
import StatCard from "../components/StatCard";
import { MatchContext } from "../context/MatchContext";

function Dashboard() {
  const { matches } = useContext(MatchContext);

  const totalMatches = matches.length;

  const totalKills = matches.reduce(
    (sum, match) => sum + Number(match.teamKills),
    0
  );

  const averagePlacement =
    totalMatches === 0
      ? "-"
      : (
          matches.reduce(
            (sum, match) => sum + Number(match.placement),
            0
          ) / totalMatches
        ).toFixed(1);

  return (
    <div className="p-8 text-white">

      <h1 className="mb-8 text-4xl font-bold text-yellow-400">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Matches"
          value={totalMatches}
        />

        <StatCard
          title="Team Kills"
          value={totalKills}
        />

        <StatCard
          title="Average Placement"
          value={averagePlacement}
        />

        <StatCard
          title="Current Cycle"
          value="Day 1 / 3"
        />

      </div>

    </div>
  );
}

export default Dashboard;