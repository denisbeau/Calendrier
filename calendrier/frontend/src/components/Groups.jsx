// src/components/Groups.jsx
import React, { useEffect, useState } from "react";
import {
  createGroup,
  fetchUserGroups,
  joinGroupByCode,
} from "../services/groups";
import { useAuth } from "./AuthContext";

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
    <div className="simple-card" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '24px',
        color: 'var(--text-primary)'
      }}>
        👥 My Groups
      </h2>

      {msg && (
        <div style={{
          fontSize: '14px',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '8px',
          marginBottom: '24px',
          color: 'var(--text-secondary)'
        }}>
          {msg}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6" style={{ marginBottom: '32px' }}>
        <div className="simple-card" style={{
          backgroundColor: 'var(--bg-tertiary)',
          padding: '20px'
        }}>
          <h3 style={{
            fontWeight: '600',
            fontSize: '18px',
            marginBottom: '16px',
            color: 'var(--text-primary)'
          }}>
            ✨ Create a Group
          </h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              placeholder="Group name"
              className="simple-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Description (optional)"
              className="simple-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button className="simple-button" disabled={loading}>
              {loading ? "Creating..." : "Create Group"}
            </button>
          </form>

          {createdCode && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: 'var(--bg-primary)',
              border: '2px solid var(--accent-primary)',
              borderRadius: '8px'
            }}>
              <div style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                fontWeight: '500'
              }}>
                🎉 Invitation code generated:
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--accent-primary)',
                letterSpacing: '2px',
                marginBottom: '8px'
              }}>
                {createdCode}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-tertiary)'
              }}>
                Share this 6-letter code with people you want to invite.
              </div>
            </div>
          )}
        </div>

        <div className="simple-card" style={{
          backgroundColor: 'var(--bg-tertiary)',
          padding: '20px'
        }}>
          <h3 style={{
            fontWeight: '600',
            fontSize: '18px',
            marginBottom: '16px',
            color: 'var(--text-primary)'
          }}>
            🔗 Join a Group
          </h3>

          <form onSubmit={handleJoin} style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start',
            marginBottom: '12px'
          }}>
            <div style={{ flex: 1 }}>
              <input
                placeholder="Enter 6-letter code"
                className="simple-input"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}
              />
            </div>
            <button
              className="simple-button"
              disabled={loading}
              style={{ width: 'auto', padding: '12px 24px' }}
            >
              {loading ? "..." : "Join"}
            </button>
          </form>

          <p style={{
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            lineHeight: '1.5'
          }}>
            Enter the 6-letter group code. If valid, you'll be added to the group immediately.
          </p>
        </div>
      </div>

      <div>
        <h3 style={{
          fontWeight: '600',
          fontSize: '20px',
          marginBottom: '16px',
          color: 'var(--text-primary)'
        }}>
          Your Groups
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {groups.length === 0 && (
            <div style={{
              padding: '32px',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              fontSize: '14px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '8px',
              border: '1px dashed var(--border-primary)'
            }}>
              No groups yet. Create one or join using an invite code!
            </div>
          )}
          {groups.map((g) => (
            <div
              key={g.group.id}
              style={{
                padding: '20px',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{
                  fontWeight: '600',
                  fontSize: '18px',
                  marginBottom: '4px',
                  color: 'var(--text-primary)'
                }}>
                  {g.group.name}
                </div>
                {g.group.description && (
                  <div style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    marginBottom: '8px'
                  }}>
                    {g.group.description}
                  </div>
                )}
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-tertiary)',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {g.role === 'owner' ? '👑 Owner' : g.role === 'admin' ? '⭐ Admin' : '👤 Member'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="simple-button"
                  onClick={() =>
                    onShowGroupCalendar && onShowGroupCalendar(g.group.id)
                  }
                  style={{ width: 'auto', padding: '10px 20px' }}
                >
                  📅 View Calendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
