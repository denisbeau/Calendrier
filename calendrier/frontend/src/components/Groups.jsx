// src/components/Groups.jsx
import React, { useEffect, useState } from "react";
import {
  createGroup,
  fetchUserGroups,
  inviteByEmail,
} from "../services/groups";
import { useAuth } from "./AuthContext";

export default function Groups({ onShowGroupCalendar }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
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
    if (!name.trim()) return setMsg("Nom requis");
    setLoading(true);
    try {
      await createGroup({
        name: name.trim(),
        description: description.trim() || null,
      });
      setName("");
      setDescription("");
      setMsg("Groupe créé.");
      await loadGroups();
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Erreur lors de la création du groupe");
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite(e) {
    e.preventDefault();
    setMsg(null);
    if (!selectedGroupId) return setMsg("Veuillez sélectionner un groupe.");
    if (!inviteEmail || !inviteEmail.includes("@"))
      return setMsg("Veuillez entrer une adresse e-mail valide.");
    setLoading(true);
    try {
      await inviteByEmail(selectedGroupId, inviteEmail.trim());
      setInviteEmail("");
      setMsg(
        "Invitation créée : le token a été enregistré dans la table `group_invites`. " +
          "L'envoi d'e-mail n'est pas encore automatisé (à implémenter côté serveur)."
      );
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Erreur lors de la création de l'invitation");
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
        </div>

        <div>
          <h3 className="font-medium">Inviter par e-mail</h3>
          <label className="text-sm text-gray-300 block mb-1">
            Choisir le groupe (destination de l'invitation)
          </label>
          <select
            className="simple-input mb-2"
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
          >
            <option value="">-- sélectionnez un groupe --</option>
            {groups.map((g) => (
              <option key={g.group.id} value={g.group.id}>
                {g.group.name}
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
            Remarque : pour l'instant l'envoi d'e-mail n'est pas automatisé — le
            token d'invitation est créé et stocké dans la table{" "}
            <code>group_invites</code>. Il faut déployer une fonction serveur
            pour envoyer réellement le courriel (SendGrid, Mailgun...).
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
