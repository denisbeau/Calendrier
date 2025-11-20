src/Calendar.jsx [103:112]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          const evs = await fetchGroupEvents(groupId);
          const mapped = (evs || []).map((ev) => ({
            id: `g-${ev.id}`,
            title: ev.title,
            start: new Date(ev.start_at),
            end: new Date(ev.end_at),
            allDay: !!ev.all_day,
            isGroupEvent: true,
            groupId: ev.group_id,
          }));
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



src/Calendar.jsx [392:401]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        const evs = await fetchGroupEvents(groupId);
        const mapped = (evs || []).map((ev) => ({
          id: `g-${ev.id}`,
          title: ev.title,
          start: new Date(ev.start_at),
          end: new Date(ev.end_at),
          allDay: !!ev.all_day,
          isGroupEvent: true,
          groupId: ev.group_id,
        }));
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



