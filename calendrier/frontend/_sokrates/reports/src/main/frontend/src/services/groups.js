// src/services/groups.js
import { supabase } from "../supabaseClient";

/** utils */
function generate6CharCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let s = "";
  for (let i = 0; i < 6; i++)
    s += letters[Math.floor(Math.random() * letters.length)];
  return s;
}

/**
 * createGroup({ name, description })
 * - creator becomes owner and admin
 * - generates a 6-letter invite_code stored in groups.invite_code
 */
export async function createGroup({ name, description }) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) throw new Error("Not authenticated");

  // generate code (naive loop to avoid collision in the VERY rare case)
  let invite_code = generate6CharCode();
  // attempt up to a few times to avoid unique constraint collision
  let attempts = 0;
  let group = null;
  while (attempts < 5) {
    const { data: inserted, error } = await supabase
      .from("groups")
      .insert([
        {
          name,
          description,
          owner_id: user.id,
          invite_code,
        },
      ])
      .select()
      .single();

    if (!error) {
      // Handle both array (from intercept) and object (from real API) responses
      // .single() should extract first element, but intercepts might return array
      group = Array.isArray(inserted) ? inserted[0] : inserted;
      break;
    }

    // If unique index collision on invite_code, generate a new code and retry
    // Supabase returns constraint errors with message including 'duplicate key' or similar.
    attempts += 1;
    invite_code = generate6CharCode();
  }

  if (!group) {
    throw new Error("Failed to create group (code generation collision?)");
  }

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
    .select(
      "group_id, role, groups(id, name, description, owner_id, created_at, invite_code)"
    )
    .eq("user_id", user.id);

  if (error) throw error;

  return (data || []).map((row) => ({
    group: row.groups,
    role: row.role,
  }));
}

/**
 * joinGroupByCode(code) - current authenticated user joins the group matching invite_code
 */
export async function joinGroupByCode(code) {
  if (!code || typeof code !== "string" || code.trim().length !== 6) {
    throw new Error("Code must be 6 letters.");
  }

  const normalized = code.trim().toUpperCase();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) throw new Error("Not authenticated");

  // find group by invite_code
  const { data: group, error: groupErr } = await supabase
    .from("groups")
    .select("id, name")
    .eq("invite_code", normalized)
    .maybeSingle();

  if (groupErr) throw groupErr;
  if (!group) throw new Error("Invalid group code.");

  // check if already a member
  const { data: existing, error: exErr } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", group.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (exErr) throw exErr;
  if (existing) return existing; // already a member — return it silently

  // check members count (max 10 as your previous rule)
  const { data: members, error: memErr } = await supabase
    .from("group_members")
    .select("id", { count: "exact" })
    .eq("group_id", group.id);

  if (memErr) throw memErr;
  const currentCount = (members && members.length) || 0;
  if (currentCount >= 10) {
    throw new Error("Group is full (max 10 members).");
  }

  // insert membership as 'member'
  const { data: membership, error: addErr } = await supabase
    .from("group_members")
    .insert([
      {
        group_id: group.id,
        user_id: user.id,
        role: "member",
      },
    ])
    .select()
    .single();

  if (addErr) throw addErr;

  return membership;
}

/**
 * (optional) fetchGroupEvents(groupId) - unchanged
 */
export async function fetchGroupEvents(groupId) {
  if (!groupId) return [];

  const { data, error } = await supabase
    .from("group_events")
    .select("*")
    .eq("group_id", groupId)
    .order("start_at", { ascending: true });

  if (error) throw error;
  return data || [];
}
