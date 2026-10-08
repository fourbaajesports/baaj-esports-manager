import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGamepad,
  FaHistory,
  FaTrophy,
  FaSignOutAlt,
  FaPlus,
  FaMinus,
  FaUserShield,
  FaArrowRight,
  FaExclamationTriangle,
  FaTrashAlt,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import { MatchContext } from "../context/MatchContext";

function Admin() {
  const { user, logout } = useContext(AuthContext);

  const {
    tournaments,
    addTournament,
    resetAllData,
  } = useContext(MatchContext);

  const navigate = useNavigate();

  const [tournamentName, setTournamentName] =
    useState("");

  const [finalPosition, setFinalPosition] =
    useState("");

  const [rounds, setRounds] =
    useState([""]);

  const [saving, setSaving] =
    useState(false);

  const [resetting, setResetting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================================
  // Logout
  // =========================================

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // =========================================
  // Round Management
  // =========================================

  const handleRoundChange = (
    index,
    value
  ) => {
    setRounds((currentRounds) =>
      currentRounds.map(
        (round, roundIndex) =>
          roundIndex === index
            ? value
            : round
      )
    );
  };

  const addRoundField = () => {
    setRounds((currentRounds) => [
      ...currentRounds,
      "",
    ]);
  };

  const removeRoundField = (index) => {
    if (rounds.length === 1) return;

    setRounds((currentRounds) =>
      currentRounds.filter(
        (_, roundIndex) =>
          roundIndex !== index
      )
    );
  };

  // =========================================
  // Create Tournament
  // =========================================

  const handleCreateTournament = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!tournamentName.trim()) {
      setError(
        "Please enter a tournament name."
      );
      return;
    }

    if (!finalPosition) {
      setError(
        "Please enter the final position."
      );
      return;
    }

    const cleanedRounds = rounds
      .map((round) => round.trim())
      .filter(Boolean);

    if (cleanedRounds.length === 0) {
      setError(
        "Please add at least one round."
      );
      return;
    }

    const duplicateRounds =
      cleanedRounds.filter(
        (round, index) =>
          cleanedRounds.findIndex(
            (item) =>
              item.toLowerCase() ===
              round.toLowerCase()
          ) !== index
      );

    if (duplicateRounds.length > 0) {
      setError(
        "Round names must be unique."
      );
      return;
    }

    try {
      setSaving(true);

      await addTournament({
        name: tournamentName,
        finalPosition,
        rounds: cleanedRounds,
      });

      setTournamentName("");
      setFinalPosition("");
      setRounds([""]);

      setSuccess(
        "Tournament created successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to create tournament."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // Reset All Data
  // =========================================

  const handleResetAllData = async () => {
    setError("");
    setSuccess("");

    try {
      setResetting(true);

      await resetAllData();

      setSuccess(
        "All match and tournament data has been permanently deleted."
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to reset all data."
      );
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-8 text-white">

      {/* =========================================
          HEADER
      ========================================= */}

      <section className="relative overflow-hidden border border-white/10 bg-[#080808]">

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#19c77a] to-transparent" />

        <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#19c77a]/10 blur-3xl" />

        <div className="relative p-6 md:p-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-[#19c77a] shadow-[0_0_12px_#19c77a]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#19c77a]">
                  Control Center
                </p>

              </div>

              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Admin Panel
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                Manage tournaments, rounds, matches
                and competitive performance data.
              </p>

            </div>

            <div className="flex items-center gap-3 border border-white/10 bg-white/[0.025] px-5 py-4">

              <div className="flex h-11 w-11 items-center justify-center border border-[#19c77a]/20 bg-[#19c77a]/10 text-[#19c77a]">
                <FaUserShield size={18} />
              </div>

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                  Authorized Admin
                </p>

                <p className="mt-1 max-w-[220px] truncate text-sm font-semibold text-gray-200">
                  {user?.email}
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================
          OVERVIEW
      ========================================= */}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div className="border border-white/10 bg-[#080808] p-5 transition-all duration-300 hover:border-[#19c77a]/30">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
                Tournaments
              </p>

              <p className="mt-2 text-3xl font-black text-white">
                {tournaments.length}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#d4af37]">
              <FaTrophy size={17} />
            </div>

          </div>

        </div>


        <div className="border border-white/10 bg-[#080808] p-5 transition-all duration-300 hover:border-[#19c77a]/30">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
                Access Level
              </p>

              <p className="mt-2 text-xl font-black text-[#19c77a]">
                OWNER
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center border border-[#19c77a]/20 bg-[#19c77a]/10 text-[#19c77a]">
              <FaUserShield size={17} />
            </div>

          </div>

        </div>


        <div className="border border-white/10 bg-[#080808] p-5 transition-all duration-300 hover:border-[#19c77a]/30 sm:col-span-2 lg:col-span-1">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
                System
              </p>

              <p className="mt-2 text-xl font-black text-[#19c77a]">
                ONLINE
              </p>

            </div>

            <span className="relative flex h-3 w-3">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#19c77a] opacity-50" />

              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#19c77a]" />

            </span>

          </div>

        </div>

      </section>


      {/* =========================================
          CREATE TOURNAMENT
      ========================================= */}

      <section className="border border-white/10 bg-[#080808]">

        <div className="border-b border-white/5 px-6 py-5 md:px-8">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#d4af37]">
              <FaTrophy size={18} />
            </div>

            <div>

              <h2 className="text-xl font-black md:text-2xl">
                Create Tournament
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Set the tournament, final position and
                rounds once. Match entry will use these
                saved values later.
              </p>

            </div>

          </div>

        </div>


        <form
          onSubmit={handleCreateTournament}
          className="space-y-7 p-6 md:p-8"
        >

          {/* Tournament + Position */}

          <div className="grid gap-6 md:grid-cols-[1fr_220px]">

            <div>

              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                Tournament Name
              </label>

              <input
                type="text"
                value={tournamentName}
                onChange={(e) =>
                  setTournamentName(
                    e.target.value
                  )
                }
                placeholder="e.g. BGIS 2026"
                className="w-full border border-white/10 bg-[#050505] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-[#19c77a]/60 focus:bg-white/[0.02]"
              />

            </div>


            <div>

              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                Final Position
              </label>

              <input
                type="number"
                min="1"
                value={finalPosition}
                onChange={(e) =>
                  setFinalPosition(
                    e.target.value
                  )
                }
                placeholder="e.g. 3"
                className="w-full border border-white/10 bg-[#050505] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-[#d4af37]/60 focus:bg-white/[0.02]"
              />

            </div>

          </div>


          {/* =====================================
              ROUNDS
          ===================================== */}

          <div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  Tournament Rounds
                </label>

                <p className="mt-1 text-xs text-gray-600">
                  Add every round that belongs to this
                  tournament.
                </p>

              </div>

              <button
                type="button"
                onClick={addRoundField}
                className="flex items-center justify-center gap-2 border border-[#19c77a]/30 bg-[#19c77a]/5 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#19c77a] transition-all duration-300 hover:border-[#19c77a]/60 hover:bg-[#19c77a]/10"
              >
                <FaPlus size={10} />
                Add Round
              </button>

            </div>


            <div className="space-y-3">

              {rounds.map(
                (round, index) => (
                  <div
                    key={index}
                    className="flex gap-3"
                  >

                    <div className="flex h-[50px] w-10 shrink-0 items-center justify-center border border-white/10 bg-[#050505] text-xs font-black text-gray-600">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <input
                      type="text"
                      value={round}
                      onChange={(e) =>
                        handleRoundChange(
                          index,
                          e.target.value
                        )
                      }
                      placeholder={`e.g. Round ${
                        index + 1
                      }`}
                      className="min-w-0 flex-1 border border-white/10 bg-[#050505] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-[#19c77a]/60 focus:bg-white/[0.02]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeRoundField(
                          index
                        )
                      }
                      disabled={
                        rounds.length === 1
                      }
                      className="flex h-[50px] w-[50px] shrink-0 items-center justify-center border border-white/10 bg-[#050505] text-gray-600 transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-20"
                      aria-label="Remove round"
                    >
                      <FaMinus size={12} />
                    </button>

                  </div>
                )
              )}

            </div>

          </div>


          {/* Maps Information */}

          <div className="border border-white/5 bg-white/[0.02] p-4">

            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
              Available Maps
            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              {[
                "Erangel",
                "Miramar",
                "Rondo",
              ].map((map) => (

                <span
                  key={map}
                  className="border border-white/10 bg-[#050505] px-3 py-2 text-xs font-semibold text-gray-400"
                >
                  {map}
                </span>

              ))}

            </div>

            <p className="mt-3 text-[10px] text-gray-700">
              Maps are fixed for the team and will be
              selectable from Match Entry.
            </p>

          </div>


          {/* Error */}

          {error && (
            <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}


          {/* Success */}

          {success && (
            <div className="border border-[#19c77a]/20 bg-[#19c77a]/5 px-4 py-3 text-sm text-[#19c77a]">
              {success}
            </div>
          )}


          {/* Submit */}

          <button
            type="submit"
            disabled={saving}
            className="group flex w-full items-center justify-center gap-3 bg-[#19c77a] px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition-all duration-300 hover:bg-[#22dd8b] disabled:cursor-not-allowed disabled:opacity-50"
          >

            <FaPlus
              className="transition-transform duration-300 group-hover:rotate-90"
            />

            {saving
              ? "Creating Tournament..."
              : "Create Tournament"}

          </button>

        </form>

      </section>


      {/* =========================================
          EXISTING TOURNAMENTS
      ========================================= */}

      <section>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#19c77a]">
              Tournament Database
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Existing Tournaments
            </h2>

          </div>

          <p className="text-xs text-gray-600">
            {tournaments.length} tournament
            {tournaments.length === 1
              ? ""
              : "s"} saved
          </p>

        </div>


        {tournaments.length === 0 ? (

          <div className="border border-dashed border-white/10 bg-[#080808] p-10 text-center">

            <FaTrophy
              className="mx-auto mb-4 text-gray-700"
              size={28}
            />

            <p className="text-sm font-semibold text-gray-500">
              No tournaments created yet.
            </p>

            <p className="mt-1 text-xs text-gray-700">
              Create your first tournament using
              the form above.
            </p>

          </div>

        ) : (

          <div className="grid gap-4 md:grid-cols-2">

            {tournaments.map(
              (tournament) => (

                <div
                  key={
                    tournament.firestoreId
                  }
                  className="group border border-white/10 bg-[#080808] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#19c77a]/30 hover:bg-[#0a0a0a]"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-gray-600">
                        Tournament
                      </p>

                      <h3 className="mt-2 truncate text-lg font-black text-white">
                        {tournament.name}
                      </h3>

                    </div>


                    <div className="shrink-0 border border-[#d4af37]/20 bg-[#d4af37]/10 px-4 py-2 text-center">

                      <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#d4af37]">
                        Finish
                      </p>

                      <p className="mt-0.5 text-xl font-black text-[#d4af37]">
                        #
                        {
                          tournament.finalPosition
                        }
                      </p>

                    </div>

                  </div>


                  {/* Rounds */}

                  {tournament.rounds?.length >
                    0 && (

                    <div className="mt-5">

                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                        Rounds
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">

                        {tournament.rounds.map(
                          (round, index) => (

                            <span
                              key={`${round}-${index}`}
                              className="border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-[10px] font-semibold text-gray-500"
                            >
                              {round}
                            </span>

                          )
                        )}

                      </div>

                    </div>

                  )}


                  <button
                    onClick={() =>
                      navigate(
                        `/tournaments/${encodeURIComponent(
                          tournament.name
                        )}`
                      )
                    }
                    className="group/btn mt-5 flex w-full items-center justify-between border border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-gray-400 transition-all duration-300 hover:border-[#19c77a]/40 hover:bg-[#19c77a]/5 hover:text-[#19c77a]"
                  >

                    <span>
                      View Tournament
                    </span>

                    <FaArrowRight
                      size={11}
                      className="transition-transform duration-300 group-hover/btn:translate-x-1"
                    />

                  </button>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* =========================================
          QUICK ACTIONS
      ========================================= */}

      <section>

        <div className="mb-5">

          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#19c77a]">
            Management
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Quick Actions
          </h2>

        </div>


        <div className="grid gap-4 md:grid-cols-2">

          {/* Add Match */}

          <button
            onClick={() =>
              navigate("/admin/matches")
            }
            className="group border border-white/10 bg-[#080808] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#19c77a]/40 hover:bg-[#0a0a0a]"
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center border border-[#19c77a]/20 bg-[#19c77a]/10 text-[#19c77a] transition-transform duration-300 group-hover:scale-105">
                  <FaGamepad size={18} />
                </div>

                <div>

                  <h2 className="text-lg font-black">
                    Add Match
                  </h2>

                  <p className="mt-1 text-xs text-gray-600">
                    Add a new match and player
                    performance.
                  </p>

                </div>

              </div>

              <FaArrowRight
                size={13}
                className="text-gray-700 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#19c77a]"
              />

            </div>

          </button>


          {/* Match History */}

          <button
            onClick={() =>
              navigate("/history")
            }
            className="group border border-white/10 bg-[#080808] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37]/40 hover:bg-[#0a0a0a]"
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#d4af37] transition-transform duration-300 group-hover:scale-105">
                  <FaHistory size={18} />
                </div>

                <div>

                  <h2 className="text-lg font-black">
                    Match History
                  </h2>

                  <p className="mt-1 text-xs text-gray-600">
                    View all recorded matches.
                  </p>

                </div>

              </div>

              <FaArrowRight
                size={13}
                className="text-gray-700 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#d4af37]"
              />

            </div>

          </button>

        </div>

      </section>


      {/* =========================================
          DANGER ZONE
      ========================================= */}

      <section className="border border-red-500/20 bg-[#080808]">

        <div className="border-b border-red-500/10 px-6 py-5 md:px-8">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-red-500/20 bg-red-500/10 text-red-400">
              <FaExclamationTriangle size={18} />
            </div>

            <div>

              <h2 className="text-xl font-black text-white md:text-2xl">
                Danger Zone
              </h2>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-600">
                Permanent database actions. Use this
                section only when you want to start with
                a completely clean match and tournament
                database.
              </p>

            </div>

          </div>

        </div>


        <div className="p-6 md:p-8">

          <div className="flex flex-col gap-5 border border-red-500/10 bg-red-500/[0.025] p-5 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <FaTrashAlt
                  size={12}
                  className="text-red-400"
                />

                <h3 className="text-sm font-black uppercase tracking-[0.08em] text-red-300">
                  Reset All Data
                </h3>

              </div>

              <p className="mt-2 max-w-xl text-xs leading-5 text-gray-600">
                This permanently deletes all matches and
                tournaments from Firestore and clears the
                locally stored match and player data.
              </p>

              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-red-500/70">
                This action cannot be undone.
              </p>

            </div>


            <button
              type="button"
              onClick={handleResetAllData}
              disabled={resetting}
              className="group flex shrink-0 items-center justify-center gap-3 border border-red-500/30 bg-red-500/10 px-6 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-red-400 transition-all duration-300 hover:border-red-500/60 hover:bg-red-500/15 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <FaTrashAlt
                size={12}
                className="transition-transform duration-300 group-hover:scale-110"
              />

              {resetting
                ? "Resetting..."
                : "Reset All Data"}

            </button>

          </div>

        </div>

      </section>


      {/* =========================================
          LOGOUT
      ========================================= */}

      <section className="border-t border-white/5 pt-6">

        <button
          onClick={handleLogout}
          className="group flex w-full items-center justify-center gap-3 border border-red-500/20 bg-red-500/5 px-5 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-red-400 transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/10 md:w-auto md:px-8"
        >

          <FaSignOutAlt
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />

          Logout

        </button>

      </section>

    </div>
  );
}

export default Admin;