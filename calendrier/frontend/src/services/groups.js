// src/services/groups.js
import { supabase } from "../supabaseClient";

/**
 * createGroup({ name, description })
 * - creator becomes owner and admin
 */
export async function createGroup({ name, description }) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) throw new Error("Not authenticated");

  // insert group
  const { data: group, error: groupErr } = await supabase
    .from("groups")
    .insert([{ name, description, owner_id: user.id }])
    .select()
    .single();

  if (groupErr) throw groupErr;

  // add creator as admin in group_members
  const { error: memberErr } = await supabase.from("group_members").insert([
    {
      group_id: group.id,
      user_id: user.id,
      role: "admin",
    },
  ]);

  if (memberErr) throw memberErr;

  return group;
}

/**
 * fetchUserGroups() - returns groups where current user is member
 */
export async function fetchUserGroups() {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from("group_members")
    .select("group_id, role, groups(name, description, owner_id, created_at)")
    .eq("user_id", user.id);

  if (error) throw error;

  // normalize return: each item contains group & role
  return (data || []).map((row) => ({
    group: row.groups,
    role: row.role,
  }));
}

/**
 * inviteByEmail(groupId, email, expiresAt) - create invite token
 */
export async function inviteByEmail(groupId, email, expiresAt = null) {
  // generate token client-side (simple random) — you may prefer server-side for security
  const token = `${Math.random().toString(36).slice(2)}${Date.now().toString(
    36
  )}`;

  const insert = {
    group_id: groupId,
    email,
    token,
    expires_at: expiresAt,
  };

  const { data, error } = await supabase
    .from("group_invites")
    .insert([insert])
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * acceptInvite(token) - current authenticated user accepts an invite with token
 */
export async function acceptInvite(token) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) throw new Error("Not authenticated");

  // fetch invite
  const { data: invite, error: invErr } = await supabase
    .from("group_invites")
    .select("*")
    .eq("token", token)
    .single();

  if (invErr) throw invErr;
  if (!invite) throw new Error("Invite not found");

  // check expiration
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    throw new Error("Invite expired");
  }

  // check member count (enforce 10 members max)
  const { data: members, error: memErr } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", invite.group_id);

  if (memErr) throw memErr;
  if ((members || []).length >= 10) {
    throw new Error("Group is full (max 10 members).");
  }

  // insert membership
  const { data: membership, error: addErr } = await supabase
    .from("group_members")
    .insert([
      {
        group_id: invite.group_id,
        user_id: user.id,
        role: "member",
      },
    ])
    .select()
    .single();

  if (addErr) throw addErr;

  // optionally delete invite after consumption
  const { error: delErr } = await supabase
    .from("group_invites")
    .delete()
    .eq("id", invite.id);

  if (delErr) {
    // non-blocking: log but don't fail
    console.warn("Failed removing invite after accept:", delErr);
  }

  return membership;
}

/**
 * fetchGroupEvents(groupId) - returns group events
 */
export async function fetchGroupEvents(groupId) {
  const { data, error } = await supabase
    .from("group_events")
    .select("*")
    .eq("group_id", groupId)
    .order("start_at", { ascending: true });

  if (error) throw error;
  return data || [];
}
