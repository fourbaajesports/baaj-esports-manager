import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaGamepad,
  FaMap,
  FaSave,
  FaUsers,
} from "react-icons/fa";

import { MatchContext } from "../context/MatchContext";

function MatchEntry() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const {
    players,
    tournaments,
    matches,
    addMatch,
    updateMatch,
    getTournamentRounds,
    getTournamentMaps,
  } = useContext(MatchContext);

  const [form, setForm] = useState({
    tournament: "",
    stage: "",
    map: "",
    placement: "",
    teamKills: "",
  });

  const [playerStats, setPlayerStats] =
    useState({});

  const [saving, setSaving] =
    useState(false);

  const [loading, setLoading] =
    useState(isEditMode);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =========================================
  // CURRENT TOURNAMENT ROUNDS
  // =========================================

  const tournamentRounds = useMemo(() => {
    if (!form.tournament) return [];

    return getTournamentRounds(
      form.tournament
    );
  }, [
    form.tournament,
    getTournamentRounds,
  ]);


  // =========================================
  // CURRENT TOURNAMENT MAPS
  // =========================================

  const tournamentMaps = useMemo(() => {
    if (!form.tournament) return [];

    return getTournamentMaps(
      form.tournament
    );
  }, [
    form.tournament,
    getTournamentMaps,
  ]);


  // =========================================
  // LOAD MATCH FOR EDIT
  // =========================================

  useEffect(() => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    const existingMatch =
      matches.find(
        (match) =>
          match.firestoreId === id ||
          String(match.id) === String(id)
      );

    if (!existingMatch) {
      if (matches.length > 0) {
        setError("Match not found.");
        setLoading(false);
      }

      return;
    }

    setForm({
      tournament:
        existingMatch.tournament || "",

      stage:
        existingMatch.stage || "",

      map:
        existingMatch.map || "",

      placement:
        existingMatch.placement ?? "",

      teamKills:
        existingMatch.teamKills ?? "",
    });

    setPlayerStats(
      existingMatch.playerStats || {}
    );

    setLoading(false);
  }, [
    isEditMode,
    id,
    matches,
  ]);


  // =========================================
  // FORM CHANGE
  // =========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setError("");
    setSuccess("");

    // =========================================
    // TOURNAMENT CHANGE
    // =========================================

    if (name === "tournament") {
      setForm((prev) => ({
        ...prev,

        tournament: value,

        /*
          Reset round and map because
          both depend on tournament.
        */

        stage: "",
        map: "",
      }));

      return;
    }

    // =========================================
    // ROUND CHANGE
    // =========================================

    if (name === "stage") {
      setForm((prev) => ({
        ...prev,

        stage: value,

        /*
          Reset map when round changes.
          Map is independently selectable.
        */

        map: "",
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // =========================================
  // PLAYER KILLS
  // =========================================

  const updatePlayerKills = (
    playerId,
    value
  ) => {
    setError("");
    setSuccess("");

    setPlayerStats((prev) => ({
      ...prev,

      [playerId]: {
        kills: value,
      },
    }));
  };


  // =========================================
  // SAVE / UPDATE MATCH
  // =========================================

  const saveMatch = async () => {
    setError("");
    setSuccess("");

    // =========================================
    // BASIC VALIDATION
    // =========================================

    if (!form.tournament) {
      setError(
        "Please select a tournament."
      );
      return;
    }

    if (!form.stage) {
      setError(
        "Please select a round."
      );
      return;
    }

    if (!form.map) {
      setError(
        "Please select a map."
      );
      return;
    }

    if (!form.placement) {
      setError(
        "Please enter the match placement."
      );
      return;
    }

    if (form.teamKills === "") {
      setError(
        "Please enter team kills."
      );
      return;
    }


    // =========================================
    // NUMBER VALIDATION
    // =========================================

    const placement =
      Number(form.placement);

    const teamKills =
      Number(form.teamKills);

    if (
      !Number.isInteger(placement) ||
      placement < 1
    ) {
      setError(
        "Placement must be a valid positive number."
      );
      return;
    }

    if (
      !Number.isInteger(teamKills) ||
      teamKills < 0
    ) {
      setError(
        "Team kills must be a valid non-negative number."
      );
      return;
    }


    // =========================================
    // CHECK PLAYER KILLS
    // =========================================

    let totalPlayerKills = 0;

    players.forEach((player) => {
      const kills =
        Number(
          playerStats[player.id]?.kills ||
            0
        );

      totalPlayerKills += kills;
    });

    if (
      totalPlayerKills !== teamKills
    ) {
      setError(
        `Player kills (${totalPlayerKills}) do not match Team Kills (${teamKills}).`
      );
      return;
    }


    // =========================================
    // FINAL PLAYER STATS
    // =========================================

    const finalPlayerStats = {};

    players.forEach((player) => {
      finalPlayerStats[player.id] = {
        kills: Number(
          playerStats[player.id]?.kills ||
            0
        ),
      };
    });


    try {
      setSaving(true);


      // =========================================
      // EDIT EXISTING MATCH
      // =========================================

      if (isEditMode) {
        const existingMatch =
          matches.find(
            (match) =>
              match.firestoreId === id ||
              String(match.id) ===
                String(id)
          );

        if (!existingMatch) {
          throw new Error(
            "Match not found."
          );
        }

        const updatedMatch = {
          ...existingMatch,

          tournament:
            form.tournament,

          /*
            Keep stage field for compatibility
            with existing tournament pages.
          */

          stage:
            form.stage.trim(),

          map:
            form.map.trim(),

          placement,

          teamKills,

          playerStats:
            finalPlayerStats,
        };

        await updateMatch(
          updatedMatch
        );

        setSuccess(
          "Match updated successfully."
        );
      }


      // =========================================
      // ADD NEW MATCH
      // =========================================

      else {
        const newMatch = {
          id: Date.now(),

          tournament:
            form.tournament,

          /*
            stage stores the selected
            tournament round.
          */

          stage:
            form.stage.trim(),

          map:
            form.map.trim(),

          placement,

          teamKills,

          date:
            new Date().toLocaleDateString(),

          playerStats:
            finalPlayerStats,
        };

        await addMatch(
          newMatch
        );

        setSuccess(
          "Match saved successfully."
        );
      }


      /*
        Small delay so the success state
        can actually be seen before redirect.
      */

      setTimeout(() => {
        navigate("/history");
      }, 700);

    } catch (error) {
      console.error(error);

      setError(
        isEditMode
          ? "Failed to update match. Please try again."
          : "Failed to save match. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#19c77a]" />

          <p className="text-sm text-gray-500">
            Loading match...
          </p>

        </div>

      </div>
    );
  }


  // =========================================
  // EDIT MATCH NOT FOUND
  // =========================================

  if (
    isEditMode &&
    !matches.some(
      (match) =>
        match.firestoreId === id ||
        String(match.id) === String(id)
    )
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white">

        <div className="border border-white/10 bg-[#080808] p-8 text-center">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
            Error
          </p>

          <h2 className="mt-3 text-2xl font-black">
            Match Not Found
          </h2>

          <button
            onClick={() =>
              navigate("/history")
            }
            className="mt-6 inline-flex items-center gap-2 border border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-gray-300 transition-all hover:border-[#19c77a]/40 hover:text-[#19c77a]"
          >
            <FaArrowLeft size={11} />
            Back to Match History
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="space-y-8 text-white">

      {/* =========================================
          HEADER
      ========================================= */}

      <section className="relative overflow-hidden border border-white/10 bg-[#080808]">

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#19c77a] to-transparent" />

        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#19c77a]/10 blur-3xl" />

        <div className="relative p-6 md:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-[#19c77a] shadow-[0_0_12px_#19c77a]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#19c77a]">
                  Match Management
                </p>

              </div>

              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                {isEditMode
                  ? "Edit Match"
                  : "Add Match"}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                {isEditMode
                  ? "Update match results and player performance."
                  : "Record a new match result and player performance."}
              </p>

            </div>

            <div className="flex h-14 w-14 items-center justify-center border border-[#19c77a]/20 bg-[#19c77a]/10 text-[#19c77a]">
              <FaGamepad size={21} />
            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          MAIN FORM
      ========================================= */}

      <section className="max-w-5xl border border-white/10 bg-[#080808]">

        {/* =====================================
            MATCH INFORMATION HEADER
        ===================================== */}

        <div className="border-b border-white/5 px-6 py-5 md:px-8">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#d4af37]">
              <FaGamepad size={17} />
            </div>

            <div>

              <h2 className="text-xl font-black">
                Match Information
              </h2>

              <p className="mt-1 text-xs text-gray-600">
                Select the tournament, round and map
                for this match.
              </p>

            </div>

          </div>

        </div>


        <div className="space-y-8 p-6 md:p-8">

          {/* =====================================
              TOURNAMENT / ROUND
          ===================================== */}

          <div className="grid gap-5 md:grid-cols-2">

            {/* TOURNAMENT */}

            <div>

              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                Tournament
              </label>

              <select
                name="tournament"
                value={form.tournament}
                onChange={handleChange}
                className="w-full border border-white/10 bg-[#050505] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 focus:border-[#19c77a]/60"
              >

                <option
                  value=""
                  className="bg-[#080808]"
                >
                  Select Tournament
                </option>

                {tournaments.map(
                  (tournament) => (

                    <option
                      key={
                        tournament.firestoreId
                      }
                      value={
                        tournament.name
                      }
                      className="bg-[#080808]"
                    >
                      {tournament.name}
                    </option>

                  )
                )}

              </select>

              {tournaments.length === 0 && (
                <p className="mt-2 text-xs text-red-400">
                  No tournaments found. Create a
                  tournament from the Admin Panel
                  first.
                </p>
              )}

            </div>


            {/* ROUND */}

            <div>

              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                Round
              </label>

              <select
                name="stage"
                value={form.stage}
                onChange={handleChange}
                disabled={
                  !form.tournament ||
                  tournamentRounds.length === 0
                }
                className="w-full border border-white/10 bg-[#050505] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 focus:border-[#19c77a]/60 disabled:cursor-not-allowed disabled:opacity-40"
              >

                <option
                  value=""
                  className="bg-[#080808]"
                >
                  {!form.tournament
                    ? "Select tournament first"
                    : tournamentRounds.length === 0
                      ? "No rounds available"
                      : "Select Round"}
                </option>

                {tournamentRounds.map(
                  (round, index) => (

                    <option
                      key={`${round}-${index}`}
                      value={round}
                      className="bg-[#080808]"
                    >
                      {round}
                    </option>

                  )
                )}

                {/*
                  Compatibility for old matches:
                  If an old match has a stage that is
                  not present in the newly saved rounds,
                  keep that value available in edit mode.
                */}

                {isEditMode &&
                  form.stage &&
                  !tournamentRounds.includes(
                    form.stage
                  ) && (

                    <option
                      value={form.stage}
                      className="bg-[#080808]"
                    >
                      {form.stage}
                    </option>

                  )}

              </select>

              {form.tournament &&
                tournamentRounds.length === 0 && (

                  <p className="mt-2 text-xs text-yellow-500/70">
                    This tournament has no saved
                    rounds. Add rounds from the Admin
                    Panel.
                  </p>

                )}

            </div>


            {/* MAP */}

            <div>

              <label className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">

                <FaMap
                  size={9}
                  className="text-[#19c77a]"
                />

                Map

              </label>

              <select
                name="map"
                value={form.map}
                onChange={handleChange}
                disabled={
                  !form.tournament ||
                  !form.stage ||
                  tournamentMaps.length === 0
                }
                className="w-full border border-white/10 bg-[#050505] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 focus:border-[#19c77a]/60 disabled:cursor-not-allowed disabled:opacity-40"
              >

                <option
                  value=""
                  className="bg-[#080808]"
                >
                  {!form.tournament
                    ? "Select tournament first"
                    : !form.stage
                      ? "Select round first"
                      : "Select Map"}
                </option>

                {tournamentMaps.map(
                  (map, index) => (

                    <option
                      key={`${map}-${index}`}
                      value={map}
                      className="bg-[#080808]"
                    >
                      {map}
                    </option>

                  )
                )}

                {/*
                  Compatibility for old matches
                  whose map may not exist in the
                  current fixed map list.
                */}

                {isEditMode &&
                  form.map &&
                  !tournamentMaps.includes(
                    form.map
                  ) && (

                    <option
                      value={form.map}
                      className="bg-[#080808]"
                    >
                      {form.map}
                    </option>

                  )}

              </select>

            </div>


            {/* PLACEMENT */}

            <div>

              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                Match Placement
              </label>

              <input
                type="number"
                min="1"
                name="placement"
                value={form.placement}
                onChange={handleChange}
                placeholder="e.g. 1"
                className="w-full border border-white/10 bg-[#050505] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-[#d4af37]/60"
              />

            </div>


            {/* TEAM KILLS */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                Team Kills
              </label>

              <input
                type="number"
                min="0"
                name="teamKills"
                value={form.teamKills}
                onChange={handleChange}
                placeholder="Total team kills"
                className="w-full border border-white/10 bg-[#050505] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-[#d4af37]/60"
              />

            </div>

          </div>


          {/* =====================================
              CURRENT SELECTION SUMMARY
          ===================================== */}

          {form.tournament &&
            form.stage &&
            form.map && (

            <div className="border border-[#19c77a]/20 bg-[#19c77a]/5 p-4">

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#19c77a]">
                Match Configuration
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                <span className="border border-white/10 bg-[#050505] px-3 py-2 text-xs font-semibold text-gray-300">
                  {form.tournament}
                </span>

                <span className="border border-white/10 bg-[#050505] px-3 py-2 text-xs font-semibold text-gray-300">
                  {form.stage}
                </span>

                <span className="border border-white/10 bg-[#050505] px-3 py-2 text-xs font-semibold text-[#19c77a]">
                  {form.map}
                </span>

              </div>

            </div>

          )}


          {/* =====================================
              PLAYER KILLS
          ===================================== */}

          <div className="border-t border-white/5 pt-8">

            <div className="mb-5 flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#19c77a]/20 bg-[#19c77a]/10 text-[#19c77a]">
                <FaUsers size={17} />
              </div>

              <div>

                <h2 className="text-xl font-black">
                  Player Kills
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-600">
                  Enter kills for each player. The
                  combined player kills must match
                  Team Kills.
                </p>

              </div>

            </div>


            <div className="space-y-3">

              {players.map(
                (player) => (

                  <div
                    key={player.id}
                    className="flex flex-col gap-4 border border-white/10 bg-[#050505] p-4 transition-all duration-300 hover:border-white/15 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="text-sm font-black text-white">
                          {player.ign ||
                            player.name}
                        </h3>

                        <span className="border border-white/10 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-gray-600">
                          {player.role}
                        </span>

                      </div>

                      <p className="mt-1 text-[10px] text-gray-700">
                        {player.name}
                      </p>

                    </div>


                    <div className="flex items-center gap-3">

                      <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-600">
                        Kills
                      </label>

                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={
                          playerStats[
                            player.id
                          ]?.kills ?? ""
                        }
                        onChange={(e) =>
                          updatePlayerKills(
                            player.id,
                            e.target.value
                          )
                        }
                        className="w-24 border border-white/10 bg-[#080808] px-3 py-2.5 text-center text-sm font-bold text-white outline-none transition-all focus:border-[#19c77a]/60"
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          </div>


          {/* =====================================
              VALIDATION / STATUS
          ===================================== */}

          {error && (

            <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {error}
            </div>

          )}

          {success && (

            <div className="flex items-center gap-3 border border-[#19c77a]/20 bg-[#19c77a]/5 px-4 py-3 text-sm text-[#19c77a]">

              <FaCheck size={13} />

              {success}

            </div>

          )}


          {/* =====================================
              SAVE
          ===================================== */}

          <button
            onClick={saveMatch}
            disabled={
              saving ||
              tournaments.length === 0
            }
            className="group flex w-full items-center justify-center gap-3 bg-[#19c77a] p-4 text-sm font-black uppercase tracking-[0.12em] text-black transition-all duration-300 hover:bg-[#22dd8b] disabled:cursor-not-allowed disabled:opacity-50"
          >

            <FaSave
              className="transition-transform duration-300 group-hover:scale-110"
            />

            {saving
              ? isEditMode
                ? "Updating Match..."
                : "Saving Match..."
              : isEditMode
                ? "Update Match"
                : "Save Match"}

          </button>


          {/* CANCEL */}

          <button
            onClick={() =>
              navigate("/history")
            }
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 border border-white/10 p-4 text-sm font-bold uppercase tracking-[0.1em] text-gray-500 transition-all duration-300 hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaArrowLeft size={11} />
            Cancel
          </button>

        </div>

      </section>

    </div>
  );
}

export default MatchEntry;