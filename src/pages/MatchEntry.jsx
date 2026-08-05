import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MatchContext } from "../context/MatchContext";

function MatchEntry() {
  const navigate = useNavigate();

  const { players, addMatch } = useContext(MatchContext);

  const [form, setForm] = useState({
    tournament: "",
    map: "",
    placement: "",
    teamKills: "",
  });

  const [playerStats, setPlayerStats] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updatePlayer = (id, field, value) => {
    setPlayerStats((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const saveMatch = () => {
    if (
      !form.tournament ||
      !form.map ||
      !form.placement ||
      !form.teamKills
    ) {
      alert("Please fill all fields.");
      return;
    }

    const roomPlayers = players.filter(
      (player) => playerStats[player.id]?.roomJoin
    );

    if (roomPlayers.length !== 4) {
      alert("Exactly 4 players must be selected for Room Join.");
      return;
    }

    let totalKills = 0;

    for (const player of players) {
      const stats = playerStats[player.id] || {};

      const kills = Number(stats.kills || 0);

      if (!stats.roomJoin && kills > 0) {
        alert(
          `${player.name} has kills but is not marked as Room Join.`
        );
        return;
      }

      totalKills += kills;
    }

    if (totalKills !== Number(form.teamKills)) {
      alert(
        `Player kills (${totalKills}) do not match Team Kills (${form.teamKills}).`
      );
      return;
    }

    const finalPlayerStats = {};

    players.forEach((player) => {
      const stats = playerStats[player.id] || {};

      const roomJoin = !!stats.roomJoin;

      finalPlayerStats[player.id] = {
        kills: Number(stats.kills || 0),

        roomJoin,

        chicken:
          roomJoin &&
          Number(form.placement) === 1,

        penalty: !!stats.penalty,
      };
    });

    const newMatch = {
      id: Date.now(),
      tournament: form.tournament,
      map: form.map,
      placement: Number(form.placement),
      teamKills: Number(form.teamKills),
      date: new Date().toLocaleDateString(),
      playerStats: finalPlayerStats,
    };

    addMatch(newMatch);

    alert("✅ Match Saved Successfully");

    navigate("/history");
  };

  return (    <div className="p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold text-yellow-400">
        🎮 Add Match
      </h1>

      <div className="max-w-5xl rounded-2xl bg-slate-800 p-8">

        <div className="grid grid-cols-2 gap-5">

          <input
            className="rounded-lg bg-slate-700 p-3"
            placeholder="Tournament Name"
            name="tournament"
            value={form.tournament}
            onChange={handleChange}
          />

          <input
            className="rounded-lg bg-slate-700 p-3"
            placeholder="Map"
            name="map"
            value={form.map}
            onChange={handleChange}
          />

          <input
            type="number"
            className="rounded-lg bg-slate-700 p-3"
            placeholder="Placement"
            name="placement"
            value={form.placement}
            onChange={handleChange}
          />

          <input
            type="number"
            className="rounded-lg bg-slate-700 p-3"
            placeholder="Team Kills"
            name="teamKills"
            value={form.teamKills}
            onChange={handleChange}
          />

        </div>

        <div className="mt-10">

          <h2 className="mb-5 text-2xl font-bold text-yellow-400">
            👥 Player Performance
          </h2>

          <div className="space-y-4">

            {players.map((player) => {

              const roomJoinCount = players.filter(
                (p) => playerStats[p.id]?.roomJoin
              ).length;

              const selected =
                playerStats[player.id]?.roomJoin || false;

              return (

                <div
                  key={player.id}
                  className="rounded-xl bg-slate-700 p-4"
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <h3 className="text-lg font-bold">
                        {player.name}
                      </h3>

                      <p className="text-sm text-gray-400">
                        {player.role}
                      </p>

                    </div>

                    <input
                      type="number"
                      min="0"
                      placeholder="Kills"
                      value={
                        playerStats[player.id]?.kills || ""
                      }
                      onChange={(e) =>
                        updatePlayer(
                          player.id,
                          "kills",
                          Number(e.target.value)
                        )
                      }
                      className="w-24 rounded-lg bg-slate-900 p-2 text-center"
                    />

                  </div>

                  <div className="mt-4 flex flex-wrap gap-6">

                    <label className="flex items-center gap-2">

                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => {

                          if (
                            e.target.checked &&
                            roomJoinCount >= 4
                          ) {
                            alert(
                              "Only 4 players can Room Join."
                            );
                            return;
                          }

                          updatePlayer(
                            player.id,
                            "roomJoin",
                            e.target.checked
                          );
                        }}
                      />

                      Room Join

                    </label>

                    <label className="flex items-center gap-2">

                      <input
                        type="checkbox"
                        checked={
                          Number(form.placement) === 1
                            ? selected
                            : playerStats[player.id]?.chicken ||
                              false
                        }
                        disabled
                      />

                      🏆 Chicken

                    </label>

                    <label className="flex items-center gap-2">

                      <input
                        type="checkbox"
                        checked={
                          playerStats[player.id]?.penalty ||
                          false
                        }
                        onChange={(e) =>
                          updatePlayer(
                            player.id,
                            "penalty",
                            e.target.checked
                          )
                        }
                      />

                      ❌ No Notice Penalty

                    </label>

                  </div>

                </div>

              );

            })}

          </div>

        </div>

        <button
          onClick={saveMatch}
          className="mt-8 w-full rounded-lg bg-yellow-500 p-3 font-bold text-black hover:bg-yellow-400"
        >
          Save Match
        </button>

      </div>

    </div>
  );
}

export default MatchEntry;