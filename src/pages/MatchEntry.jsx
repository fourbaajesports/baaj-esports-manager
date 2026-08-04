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

  const [playerKills, setPlayerKills] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleKillChange = (playerId, value) => {
    setPlayerKills((prev) => ({
      ...prev,
      [playerId]: Number(value),
    }));
  };

  const saveMatch = () => {
    if (
      !form.tournament ||
      !form.map ||
      !form.placement ||
      !form.teamKills
    ) {
      alert("Please fill all fields");
      return;
    }

    const newMatch = {
      id: Date.now(),
      tournament: form.tournament,
      map: form.map,
      placement: Number(form.placement),
      teamKills: Number(form.teamKills),
      date: new Date().toLocaleDateString(),
      playerKills,
    };

    addMatch(newMatch);

    alert("✅ Match Saved");

    navigate("/history");
  };

  return (
    <div className="p-8 text-white">

      <h1 className="mb-8 text-4xl font-bold text-yellow-400">
        🎮 Add Match
      </h1>

      <div className="max-w-3xl rounded-2xl bg-slate-800 p-8">

        <div className="space-y-5">

          <input
            className="w-full rounded-lg bg-slate-700 p-3"
            placeholder="Tournament Name"
            name="tournament"
            value={form.tournament}
            onChange={handleChange}
          />

          <input
            className="w-full rounded-lg bg-slate-700 p-3"
            placeholder="Map"
            name="map"
            value={form.map}
            onChange={handleChange}
          />

          <input
            type="number"
            className="w-full rounded-lg bg-slate-700 p-3"
            placeholder="Placement"
            name="placement"
            value={form.placement}
            onChange={handleChange}
          />

          <input
            type="number"
            className="w-full rounded-lg bg-slate-700 p-3"
            placeholder="Team Kills"
            name="teamKills"
            value={form.teamKills}
            onChange={handleChange}
          />

        </div>

        <div className="mt-8">

          <h2 className="mb-4 text-2xl font-bold text-yellow-400">
            👥 Player Kills
          </h2>

          <div className="space-y-3">

            {players.map((player) => (

              <div
                key={player.id}
                className="flex items-center justify-between rounded-lg bg-slate-700 p-3"
              >

                <div>
                  <p className="font-semibold">
                    {player.name}
                  </p>

                  <p className="text-sm text-gray-400">
                    {player.role}
                  </p>
                </div>

                <input
                  type="number"
                  min="0"
                  value={playerKills[player.id] || ""}
                  onChange={(e) =>
                    handleKillChange(player.id, e.target.value)
                  }
                  className="w-24 rounded-lg bg-slate-900 p-2 text-center"
                  placeholder="0"
                />

              </div>

            ))}

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