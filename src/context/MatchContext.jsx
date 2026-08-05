import { createContext, useEffect, useState } from "react";
import playersData from "../data/players";

export const MatchContext = createContext();

export function MatchProvider({ children }) {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("players");
    return saved ? JSON.parse(saved) : playersData;
  });

  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem("matches");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [matches]);

  // ==========================
  // Recalculate Player Stats
  // ==========================

  const recalculatePlayers = (allMatches) => {
    const updatedPlayers = playersData.map((player) => ({
      ...player,
      totalKills: 0,
      performancePoints: 0,
      matchesPlayed: 0,
      roomJoins: 0,
      chickens: 0,
      top8Finishes: 0,
      penalties: 0,
    }));

    allMatches.forEach((match) => {
      updatedPlayers.forEach((player) => {
        const stats = match.playerStats[player.id];

        if (!stats?.roomJoin) return;

        const kills = Number(stats.kills || 0);

        const roomJoinPoints = 1;
        const chickenPoints = stats.chicken ? 2 : 0;

        const top8Points =
          match.placement >= 2 &&
          match.placement <= 8
            ? 1
            : 0;

        const penaltyPoints =
          stats.penalty ? -1 : 0;

        const performance =
          kills +
          roomJoinPoints +
          chickenPoints +
          top8Points +
          penaltyPoints;

        player.totalKills += kills;
        player.performancePoints += performance;
        player.matchesPlayed += 1;
        player.roomJoins += 1;

        if (stats.chicken)
          player.chickens += 1;

        if (top8Points)
          player.top8Finishes += 1;

        if (stats.penalty)
          player.penalties += 1;
      });
    });

    setPlayers(updatedPlayers);
  };
    // ==========================
  // Add Match
  // ==========================

  const addMatch = (match) => {
    const updatedMatches = [...matches, match];

    setMatches(updatedMatches);

    recalculatePlayers(updatedMatches);
  };

  // ==========================
  // Delete Match
  // ==========================

  const deleteMatch = (matchId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this match?"
    );

    if (!confirmDelete) return;

    const updatedMatches = matches.filter(
      (match) => match.id !== matchId
    );

    setMatches(updatedMatches);

    recalculatePlayers(updatedMatches);
  };

  // ==========================
  // Update Match
  // ==========================

  const updateMatch = (updatedMatch) => {
    const updatedMatches = matches.map((match) =>
      match.id === updatedMatch.id
        ? updatedMatch
        : match
    );

    setMatches(updatedMatches);

    recalculatePlayers(updatedMatches);
  };
    // ==========================
  // Reset All Data
  // ==========================

  const resetAllData = () => {
    localStorage.removeItem("players");
    localStorage.removeItem("matches");

    setPlayers(playersData);
    setMatches([]);
  };

  return (
    <MatchContext.Provider
      value={{
        players,
        matches,

        addMatch,
        updateMatch,
        deleteMatch,

        resetAllData,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
}