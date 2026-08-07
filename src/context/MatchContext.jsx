import {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import playersData from "../data/players";

export const MatchContext = createContext();

export function MatchProvider({ children }) {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("players");

    return saved
      ? JSON.parse(saved)
      : playersData;
  });

  const [matches, setMatches] = useState([]);

  const [loadingMatches, setLoadingMatches] = useState(true);

  // =========================================
  // Load Matches From Firestore
  // =========================================

  useEffect(() => {
    const matchesRef = collection(db, "matches");

    const unsubscribe = onSnapshot(
      matchesRef,
      (snapshot) => {
        const firestoreMatches = snapshot.docs.map(
          (docSnapshot) => ({
            ...docSnapshot.data(),
            firestoreId: docSnapshot.id,
          })
        );

        setMatches(firestoreMatches);
        setLoadingMatches(false);
      },
      (error) => {
        console.error(
          "Firestore match loading error:",
          error
        );

        setLoadingMatches(false);
      }
    );

    return unsubscribe;
  }, []);

  // =========================================
  // Save Players Locally
  // =========================================

  useEffect(() => {
    localStorage.setItem(
      "players",
      JSON.stringify(players)
    );
  }, [players]);

  // =========================================
  // Recalculate Player Stats
  // =========================================

  const recalculatePlayers = (allMatches) => {
    const updatedPlayers = playersData.map(
      (player) => ({
        ...player,

        totalKills: 0,
        performancePoints: 0,
        matchesPlayed: 0,
        roomJoins: 0,
        chickens: 0,
        top8Finishes: 0,
        penalties: 0,
      })
    );

    allMatches.forEach((match) => {
      updatedPlayers.forEach((player) => {
        const stats =
          match.playerStats?.[player.id];

        if (!stats?.roomJoin) return;

        const kills = Number(
          stats.kills || 0
        );

        const roomJoinPoints = 1;

        const chickenPoints = stats.chicken
          ? 2
          : 0;

        const top8Points =
          Number(match.placement) >= 2 &&
          Number(match.placement) <= 8
            ? 1
            : 0;

        const penaltyPoints =
          stats.penalty
            ? -1
            : 0;

        const performance =
          kills +
          roomJoinPoints +
          chickenPoints +
          top8Points +
          penaltyPoints;

        player.totalKills += kills;

        player.performancePoints +=
          performance;

        player.matchesPlayed += 1;

        player.roomJoins += 1;

        if (stats.chicken) {
          player.chickens += 1;
        }

        if (top8Points) {
          player.top8Finishes += 1;
        }

        if (stats.penalty) {
          player.penalties += 1;
        }
      });
    });

    setPlayers(updatedPlayers);
  };

  // =========================================
  // Recalculate When Matches Change
  // =========================================

  useEffect(() => {
    if (!loadingMatches) {
      recalculatePlayers(matches);
    }
  }, [matches, loadingMatches]);

  // =========================================
  // Migrate Old LocalStorage Matches
  // =========================================

  useEffect(() => {
    const migrateOldMatches = async () => {
      if (loadingMatches) return;

      const saved =
        localStorage.getItem("matches");

      if (!saved) return;

      try {
        const oldMatches = JSON.parse(saved);

        if (
          !Array.isArray(oldMatches) ||
          oldMatches.length === 0
        ) {
          return;
        }

        const existingSnapshot =
          await getDocs(
            collection(db, "matches")
          );

        if (!existingSnapshot.empty) {
          return;
        }

        console.log(
          "Migrating old local matches to Firestore..."
        );

        for (const match of oldMatches) {
          const { firestoreId, ...matchData } =
            match;

          await addDoc(
            collection(db, "matches"),
            matchData
          );
        }

        console.log(
          "Old matches migrated successfully."
        );

        localStorage.removeItem("matches");
      } catch (error) {
        console.error(
          "Migration error:",
          error
        );
      }
    };

    migrateOldMatches();
  }, [loadingMatches]);

  // =========================================
  // Add Match
  // =========================================

  const addMatch = async (match) => {
    try {
      const { firestoreId, ...matchData } =
        match;

      await addDoc(
        collection(db, "matches"),
        matchData
      );
    } catch (error) {
      console.error(
        "Error adding match:",
        error
      );

      throw error;
    }
  };

  // =========================================
  // Update Match
  // =========================================

  const updateMatch = async (updatedMatch) => {
    try {
      const firestoreId =
        updatedMatch.firestoreId;

      if (!firestoreId) {
        console.error(
          "Firestore ID missing for update."
        );

        return;
      }

      const { firestoreId: _, ...matchData } =
        updatedMatch;

      await updateDoc(
        doc(
          db,
          "matches",
          firestoreId
        ),
        matchData
      );
    } catch (error) {
      console.error(
        "Error updating match:",
        error
      );

      throw error;
    }
  };

  // =========================================
  // Delete Match
  // =========================================

  const deleteMatch = async (matchId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this match?"
    );

    if (!confirmDelete) return;

    try {
      let firestoreId = matchId;

      const match = matches.find(
        (item) =>
          item.id === matchId ||
          item.firestoreId === matchId
      );

      if (match?.firestoreId) {
        firestoreId = match.firestoreId;
      }

      await deleteDoc(
        doc(
          db,
          "matches",
          firestoreId
        )
      );
    } catch (error) {
      console.error(
        "Error deleting match:",
        error
      );

      throw error;
    }
  };

  // =========================================
  // Reset All Data
  // =========================================

  const resetAllData = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to delete ALL match data?"
    );

    if (!confirmReset) return;

    try {
      const snapshot = await getDocs(
        collection(db, "matches")
      );

      for (const matchDoc of snapshot.docs) {
        await deleteDoc(matchDoc.ref);
      }

      localStorage.removeItem("players");
      localStorage.removeItem("matches");

      setPlayers(playersData);
      setMatches([]);
    } catch (error) {
      console.error(
        "Error resetting data:",
        error
      );

      throw error;
    }
  };

  // =========================================
  // Context
  // =========================================

  return (
    <MatchContext.Provider
      value={{
        players,
        matches,

        addMatch,
        updateMatch,
        deleteMatch,

        resetAllData,

        loadingMatches,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
}

export default MatchProvider;