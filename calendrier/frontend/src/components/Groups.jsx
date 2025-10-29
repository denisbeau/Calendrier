// src/components/Groups.jsx
import React, { useEffect, useState } from "react";
import {
  createGroup,
  fetchUserGroups,
  inviteByEmail,
} from "../services/groups";
import { useAuth } from "./AuthContext";

export default function Groups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!user) return;
    loadGroups();
  }, [user]);

  async function loadGroups() {
    try {
      const data = await fetchUserGroups();
      setGroups(data);
    } catch (err) {
      console.error("Failed to load groups:", err);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return setMsg("Nom requis");
    setLoading(true);
    try {
      await createGroup({
        name: name.trim(),
        description: description.trim() || null,
      });
      setName("");
      setDescription("");
      setMsg("Groupe créé");
      await loadGroups();
    } catch (err) {
      setMsg(err.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite(e) {
    e.preventDefault();
    if (!selectedGroup || !inviteEmail)
      return setMsg("Sélectionner un groupe et un email");
    setLoading(true);
    try {
      await inviteByEmail(selectedGroup.group.id, inviteEmail.trim());
      setInviteEmail("");
      setMsg(
        "Invitation créée (token stocké). Envoie e-mail à implémenter côté serveur."
      );
    } catch (err) {
      setMsg(err.message || "Erreur invitation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="simple-card max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Mes groupes</h2>
      {msg && <div className="text-sm text-gray-300">{msg}</div>}

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
        </div>

        <div>
          <h3 className="font-medium">Inviter par email</h3>
          <div>
            <label className="text-sm text-gray-300">Choisir un groupe</label>
            <select
              className="simple-input"
              value={selectedGroup ? selectedGroup.group.id : ""}
              onChange={(e) => {
                const g = groups.find((x) => x.group.id === e.target.value);
                setSelectedGroup(g || null);
              }}
            >
              <option value="">-- sélectionnez --</option>
              {groups.map((g) => (
                <option key={g.group.id} value={g.group.id}>
                  {g.group.name} ({g.role})
                </option>
              ))}
            </select>

            <form onSubmit={handleInvite} className="mt-2 flex gap-2">
              <input
                placeholder="invite@example.com"
                className="simple-input flex-1"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <button className="simple-button" disabled={loading}>
                Inviter
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-2">
              Actuellement l'envoi d'email n'est pas automisé — le token est
              créé dans la table group_invites.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium">Groupes dont vous faites partie</h3>
        <ul className="space-y-2">
          {groups.length === 0 && (
            <li className="text-sm text-gray-400">Aucun groupe</li>
          )}
          {groups.map((g) => (
            <li key={g.group.id} className="p-2 border rounded bg-gray-900/40">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{g.group.name}</div>
                  <div className="text-sm text-gray-400">
                    {g.group.description}
                  </div>
                </div>
                <div className="text-sm text-gray-300">{g.role}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
