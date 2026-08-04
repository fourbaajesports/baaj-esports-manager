import { createContext, useState } from "react";
import playersData from "../data/players";

export const MatchContext = createContext();

export function MatchProvider({ children }) {
  const [players, setPlayers] = useState(playersData);
  const [matches, setMatches] = useState([]);

  const addMatch = (match) => {
    setMatches((prev) => [...prev, match]);

    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        const kills = Number(match.playerKills[player.id] || 0);

        return {
          ...player,
          totalKills: player.totalKills + kills,
          matchesPlayed: player.matchesPlayed + 1,
        };
      })
    );
  };

  return (
    <MatchContext.Provider
      value={{
        players,
        setPlayers,
        matches,
        setMatches,
        addMatch,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
}