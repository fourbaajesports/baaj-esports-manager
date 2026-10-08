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

/*
  =========================================
  Fixed BGMI Maps
  =========================================
*/

export const MAPS = [
  "Erangel",
  "Miramar",
  "Rondo",
];

export function MatchProvider({ children }) {
  // =========================================
  // Players
  // =========================================

  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("players");

    return saved
      ? JSON.parse(saved)
      : playersData;
  });

  // =========================================
  // Matches
  // =========================================

  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] =
    useState(true);

  // =========================================
  // Tournaments
  // =========================================

  const [tournaments, setTournaments] = useState([]);
  const [loadingTournaments, setLoadingTournaments] =
    useState(true);

  // =========================================
  // Load Matches From Firestore
  // =========================================

  useEffect(() => {
    const matchesRef = collection(db, "matches");

    const unsubscribe = onSnapshot(
      matchesRef,
      (snapshot) => {
        const firestoreMatches =
          snapshot.docs.map(
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
  // Load Tournaments From Firestore
  // =========================================

  useEffect(() => {
    const tournamentsRef =
      collection(db, "tournaments");

    const unsubscribe = onSnapshot(
      tournamentsRef,
      (snapshot) => {
        const firestoreTournaments =
          snapshot.docs.map(
            (docSnapshot) => ({
              ...docSnapshot.data(),
              firestoreId: docSnapshot.id,
            })
          );

        setTournaments(firestoreTournaments);
        setLoadingTournaments(false);
      },
      (error) => {
        console.error(
          "Firestore tournament loading error:",
          error
        );

        setLoadingTournaments(false);
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
    const updatedPlayers =
      playersData.map((player) => ({
        ...player,

        totalKills: 0,
        matchesPlayed: 0,
        averageKills: 0,
      }));

    allMatches.forEach((match) => {
      updatedPlayers.forEach((player) => {
        const stats =
          match.playerStats?.[player.id];

        if (!stats) return;

        const kills = Number(
          stats.kills || 0
        );

        player.totalKills += kills;
        player.matchesPlayed += 1;
      });
    });

    updatedPlayers.forEach((player) => {
      player.averageKills =
        player.matchesPlayed > 0
          ? Number(
              (
                player.totalKills /
                player.matchesPlayed
              ).toFixed(2)
            )
          : 0;
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
          const {
            firestoreId,
            ...matchData
          } = match;

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
      const {
        firestoreId,
        ...matchData
      } = match;

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

      const {
        firestoreId: _,
        ...matchData
      } = updatedMatch;

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
  // Add Tournament
  // =========================================

  const addTournament = async ({
    name,
    finalPosition,
    rounds = [],
  }) => {
    try {
      const tournamentName = name.trim();

      if (!tournamentName) {
        throw new Error(
          "Tournament name is required."
        );
      }

      const position = Number(
        finalPosition
      );

      if (
        !Number.isInteger(position) ||
        position < 1
      ) {
        throw new Error(
          "Final position must be a valid positive number."
        );
      }

      /*
        Clean and normalize rounds.
        Empty rounds are removed.
        Duplicate rounds are removed.
      */

      const cleanedRounds = [
        ...new Set(
          rounds
            .map((round) =>
              String(round).trim()
            )
            .filter(Boolean)
        ),
      ];

      if (cleanedRounds.length === 0) {
        throw new Error(
          "Please add at least one round."
        );
      }

      const alreadyExists =
        tournaments.some(
          (tournament) =>
            tournament.name?.toLowerCase() ===
            tournamentName.toLowerCase()
        );

      if (alreadyExists) {
        throw new Error(
          "This tournament already exists."
        );
      }

      await addDoc(
        collection(db, "tournaments"),
        {
          name: tournamentName,
          finalPosition: position,

          /*
            Tournament-specific rounds
          */

          rounds: cleanedRounds,

          /*
            Maps are currently fixed for
            every tournament.
          */

          maps: MAPS,

          createdAt:
            new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error(
        "Error adding tournament:",
        error
      );

      throw error;
    }
  };

  // =========================================
  // Update Tournament
  // =========================================

  const updateTournament = async (
    updatedTournament
  ) => {
    try {
      const firestoreId =
        updatedTournament.firestoreId;

      if (!firestoreId) {
        throw new Error(
          "Tournament Firestore ID is missing."
        );
      }

      const tournamentName =
        updatedTournament.name?.trim();

      const position = Number(
        updatedTournament.finalPosition
      );

      if (!tournamentName) {
        throw new Error(
          "Tournament name is required."
        );
      }

      if (
        !Number.isInteger(position) ||
        position < 1
      ) {
        throw new Error(
          "Final position must be a valid positive number."
        );
      }

      /*
        Preserve existing rounds when
        updating an old tournament.
      */

      const existingTournament =
        tournaments.find(
          (tournament) =>
            tournament.firestoreId ===
            firestoreId
        );

      const existingRounds =
        existingTournament?.rounds || [];

      const cleanedRounds = [
        ...new Set(
          (
            updatedTournament.rounds ||
            existingRounds
          )
            .map((round) =>
              String(round).trim()
            )
            .filter(Boolean)
        ),
      ];

      await updateDoc(
        doc(
          db,
          "tournaments",
          firestoreId
        ),
        {
          name: tournamentName,
          finalPosition: position,

          rounds: cleanedRounds,

          maps: MAPS,
        }
      );
    } catch (error) {
      console.error(
        "Error updating tournament:",
        error
      );

      throw error;
    }
  };

  // =========================================
  // Delete Tournament
  // =========================================

  const deleteTournament = async (
    tournamentId
  ) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tournament?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(
          db,
          "tournaments",
          tournamentId
        )
      );
    } catch (error) {
      console.error(
        "Error deleting tournament:",
        error
      );

      throw error;
    }
  };

  // =========================================
  // Get Tournament Details
  // =========================================

  const getTournamentDetails = (
    tournamentName
  ) => {
    return (
      tournaments.find(
        (tournament) =>
          tournament.name === tournamentName
      ) || null
    );
  };

  // =========================================
  // Get Tournament Rounds
  // =========================================

  const getTournamentRounds = (
    tournamentName
  ) => {
    const tournament =
      getTournamentDetails(
        tournamentName
      );

    /*
      New tournaments:
      Use the rounds saved inside
      the tournament document.
    */

    if (
      tournament?.rounds &&
      Array.isArray(tournament.rounds) &&
      tournament.rounds.length > 0
    ) {
      return tournament.rounds;
    }

    /*
      Old tournaments:
      If rounds were not saved previously,
      use existing match stages as fallback.

      This keeps old data working.
    */

    const oldStages = [
      ...new Set(
        matches
          .filter(
            (match) =>
              match.tournament ===
              tournamentName
          )
          .map((match) => match.stage)
          .filter(Boolean)
      ),
    ];

    return oldStages;
  };

  // =========================================
  // Get Tournament Maps
  // =========================================

  const getTournamentMaps = (
    tournamentName
  ) => {
    const tournament =
      getTournamentDetails(
        tournamentName
      );

    /*
      If a tournament has a maps array,
      use it.

      Otherwise use the current
      fixed map list.
    */

    if (
      tournament?.maps &&
      Array.isArray(tournament.maps) &&
      tournament.maps.length > 0
    ) {
      return tournament.maps;
    }

    return MAPS;
  };

  // =========================================
  // Tournament Helpers
  // =========================================

  const getTournamentNames = () => {
    const matchTournamentNames =
      matches
        .map((match) => match.tournament)
        .filter(Boolean);

    const savedTournamentNames =
      tournaments
        .map((tournament) =>
          tournament.name
        )
        .filter(Boolean);

    return [
      ...new Set([
        ...savedTournamentNames,
        ...matchTournamentNames,
      ]),
    ];
  };

  const getTournamentMatches = (
    tournament
  ) => {
    return matches.filter(
      (match) =>
        match.tournament === tournament
    );
  };

  const getStageMatches = (
    tournament,
    stage
  ) => {
    return matches.filter(
      (match) =>
        match.tournament === tournament &&
        match.stage === stage
    );
  };

  const getTournamentStages = (
    tournament
  ) => {
    return [
      ...new Set(
        matches
          .filter(
            (match) =>
              match.tournament ===
              tournament
          )
          .map((match) => match.stage)
          .filter(Boolean)
      ),
    ];
  };

  // =========================================
  // Calculate Team Stats
  // =========================================

  const calculateTeamStats = (
    tournamentMatches
  ) => {
    const totalMatches =
      tournamentMatches.length;

    const totalKills =
      tournamentMatches.reduce(
        (total, match) =>
          total +
          Number(match.teamKills || 0),
        0
      );

    const placementPoints =
      tournamentMatches.reduce(
        (total, match) => {
          const placement =
            Number(match.placement);

          const pointsMap = {
            1: 10,
            2: 6,
            3: 5,
            4: 4,
            5: 3,
            6: 2,
            7: 1,
            8: 1,
          };

          return (
            total +
            (pointsMap[placement] || 0)
          );
        },
        0
      );

    const averageKills =
      totalMatches > 0
        ? Number(
            (
              totalKills /
              totalMatches
            ).toFixed(2)
          )
        : 0;

    const totalPoints =
      totalKills + placementPoints;

    return {
      totalMatches,
      totalKills,
      averageKills,
      placementPoints,
      totalPoints,
    };
  };

  // =========================================
  // Calculate Player Stats
  // =========================================

  const calculatePlayerStats = (
    tournamentMatches
  ) => {
    return playersData.map((player) => {
      let totalKills = 0;
      let matchesPlayed = 0;

      tournamentMatches.forEach(
        (match) => {
          const stats =
            match.playerStats?.[
              player.id
            ];

          if (!stats) return;

          totalKills += Number(
            stats.kills || 0
          );

          matchesPlayed += 1;
        }
      );

      const averageKills =
        matchesPlayed > 0
          ? Number(
              (
                totalKills /
                matchesPlayed
              ).toFixed(2)
            )
          : 0;

      return {
        ...player,
        totalKills,
        matchesPlayed,
        averageKills,
      };
    });
  };

  // =========================================
  // Reset All Data
  // =========================================

  const resetAllData = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to delete ALL match and tournament data?"
    );

    if (!confirmReset) return;

    try {
      // Delete matches
      const matchSnapshot =
        await getDocs(
          collection(db, "matches")
        );

      for (
        const matchDoc of
          matchSnapshot.docs
      ) {
        await deleteDoc(
          matchDoc.ref
        );
      }

      // Delete tournaments
      const tournamentSnapshot =
        await getDocs(
          collection(db, "tournaments")
        );

      for (
        const tournamentDoc of
          tournamentSnapshot.docs
      ) {
        await deleteDoc(
          tournamentDoc.ref
        );
      }

      localStorage.removeItem(
        "players"
      );

      localStorage.removeItem(
        "matches"
      );

      setPlayers(playersData);
      setMatches([]);
      setTournaments([]);
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
        // Players
        players,

        // Fixed maps
        MAPS,

        // Matches
        matches,
        addMatch,
        updateMatch,
        deleteMatch,

        // Tournaments
        tournaments,
        addTournament,
        updateTournament,
        deleteTournament,
        getTournamentDetails,

        // Tournament rounds/maps
        getTournamentRounds,
        getTournamentMaps,

        // Loading
        loadingMatches,
        loadingTournaments,

        // Tournament helpers
        getTournamentNames,
        getTournamentMatches,
        getTournamentStages,
        getStageMatches,

        // Statistics
        calculateTeamStats,
        calculatePlayerStats,

        // Reset
        resetAllData,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
}

export default MatchProvider;