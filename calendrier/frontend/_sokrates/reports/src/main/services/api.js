// src/services/api.js — safe createEvent that strips null fields
import { supabase } from "../supabaseClient";

export async function createEvent(payload) {
  const insertObj = {
    title: payload.title,
    start: payload.start,
    end: payload.end,
    user_id: payload.userId ?? undefined,
    category: payload.category ?? undefined,
    color: payload.color ?? undefined,
  };

  // remove undefined/null props so we don't reference columns that might not exist
  Object.keys(insertObj).forEach((k) => {
    if (insertObj[k] === undefined || insertObj[k] === null) {
      delete insertObj[k];
    }
  });

  const { data, error } = await supabase
    .from("events")
    .insert([insertObj])
    .select()
    .single();

  if (error) throw error;
  return data;
}
