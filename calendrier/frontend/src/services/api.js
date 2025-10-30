// src/services/api.js
import { supabase } from "../supabaseClient";

/**
 * createEvent(payload)
 * payload fields:
 *  - title (string) (required)
 *  - start (ISO string or Date)  // for personal events -> inserted into events.start
 *  - end (ISO string or Date)    // for personal events -> events.end
 *  - groupId (uuid) (optional)   // if provided -> insert into group_events (start_at/end_at)
 *  - userId (uuid) (optional)
 *  - allDay (boolean) (optional)
 *  - category, color (optional)
 */
export async function createEvent(payload) {
  if (!payload || !payload.title) {
    throw new Error("createEvent: payload.title is required");
  }

  const startIso =
    payload.start instanceof Date
      ? payload.start.toISOString()
      : String(payload.start);
  const endIso =
    payload.end instanceof Date
      ? payload.end.toISOString()
      : String(payload.end);

  if (payload.groupId) {
    const insertObj = {
      title: payload.title,
      start_at: startIso,
      end_at: endIso,
      group_id: payload.groupId,
    };

    if (typeof payload.userId !== "undefined")
      insertObj.created_by = payload.userId;
    if (typeof payload.allDay !== "undefined")
      insertObj.all_day = payload.allDay;
    if (payload.category) insertObj.category = payload.category;
    if (payload.color) insertObj.color = payload.color;

    const { data, error } = await supabase
      .from("group_events")
      .insert([insertObj]);
    // debug: évite .select() si PostgREST a un souci de schéma
    if (error) {
      console.error("createEvent group_events insert error:", error);
      throw error;
    }
    return data;
  } else {
    // insert into personal events table
    const insertObj = {
      title: payload.title,
      start: startIso,
      end: endIso,
      user_id: payload.userId ?? undefined,
      all_day: payload.allDay ?? undefined,
      category: payload.category ?? undefined,
      color: payload.color ?? undefined,
    };

    Object.keys(insertObj).forEach((k) => {
      if (insertObj[k] === undefined || insertObj[k] === null)
        delete insertObj[k];
    });

    const { data, error } = await supabase
      .from("events")
      .insert([insertObj])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
