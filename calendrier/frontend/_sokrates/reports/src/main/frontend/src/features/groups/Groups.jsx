// src/features/groups/Groups.jsx
import React, { useEffect, useState } from "react";
import {
  createGroup,
  fetchUserGroups,
  joinGroupByCode,
} from "../../services/groups";
import { useAuth } from "../../context/AuthContext";
import PropTypes from "prop-types";

export default function Groups({ onShowGroupCalendar }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [createdCode, setCreatedCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!user) return;
    loadGroups();
  }, [user]);

  async function loadGroups() {
    try {
      const data = await fetchUserGroups();
      setGroups(data || []);
    } catch (err) {
      console.error("Failed to load groups:", err);
      setMsg("Erreur lors du chargement des groupes.");
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setMsg(null);
    setCreatedCode(null);
    if (!name.trim()) return setMsg("Nom requis");
    setLoading(true);
    try {
      const group = await createGroup({
        name: name.trim(),
        description: description.trim() || null,
      });
      setName("");
      setDescription("");
      setMsg("Groupe créé.");
      // show the invite code if server returned it
      if (group?.invite_code) {
        setCreatedCode(group.invite_code);
      } else {
        setCreatedCode(null);
      }
      await loadGroups();
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Erreur lors de la création du groupe");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(e) {
    e.preventDefault();
    setMsg(null);
    const code = (joinCode || "").trim().toUpperCase();
    if (!code || code.length !== 6)
      return setMsg("Entrez un code à 6 lettres.");
    setLoading(true);
    try {
      await joinGroupByCode(code);
      setJoinCode("");
      setMsg("Vous avez rejoint le groupe !");
      await loadGroups();
    } catch (err) {
      console.error("joinGroupByCode:", err);
      setMsg(err.message || "Impossible de rejoindre le groupe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="simple-card max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Mes groupes</h2>

      {msg && (
        <div className="text-sm text-gray-300 p-2 bg-gray-900/20 rounded">
          {msg}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium">Créer un groupe</h3>
          <form onSubmit={handleCreate} className="space-y-2">
            <input
              placeholder="Nom du groupe"
              className="simple-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Description (facultatif)"
              className="simple-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button className="simple-button" disabled={loading}>
              {loading ? "Création..." : "Créer"}
            </button>
          </form>

          {createdCode && (
            <div className="mt-2 text-sm">
              Code d'invitation généré :{" "}
              <strong className="font-mono text-lg">{createdCode}</strong>
              <div className="text-xs text-gray-400 mt-1">
                Partagez ce code (6 lettres) avec les personnes que vous voulez
                inviter.
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-medium">Rejoindre un groupe (par code)</h3>

          <form onSubmit={handleJoin} className="mt-2 flex gap-2 items-center">
            <input
              placeholder="Entrez le code (6 lettres)"
              className="simple-input flex-1"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              maxLength={6}
            />
            <button className="simple-button" disabled={loading}>
              {loading ? "..." : "Rejoindre"}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-2">
            Entrez le code à 6 lettres du groupe. Si le code est valide, vous
            serez ajouté directement au groupe.
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-medium">Groupes dont vous faites partie</h3>
        <ul className="space-y-2">
          {groups.length === 0 && (
            <li className="text-sm text-gray-400">Aucun groupe</li>
          )}
          {groups.map((g) => (
            <li
              key={g.group.id}
              className="p-2 border rounded bg-gray-900/40 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold">{g.group.name}</div>
                <div className="text-sm text-gray-400">
                  {g.group.description}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="simple-button"
                  onClick={() =>
                    onShowGroupCalendar && onShowGroupCalendar(g.group.id)
                  }
                >
                  Voir calendrier
                </button>
                <div className="text-sm text-gray-300 self-center">
                  {g.role}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

Groups.propTypes = {
  onShowGroupCalendar: PropTypes.func,
};

