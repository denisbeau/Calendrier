src/Calendar.jsx [117:126]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          const personal = await fetchPersonalEventsFromDb();
          const personalMapped = (personal || []).map((ev) => ({
            id: ev.id,
            title: ev.title,
            start: new Date(ev.start),
            end: new Date(ev.end),
            allDay: !!ev.all_day,
            isGroupEvent: false,
            userId: ev.user_id,
          }));
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



src/Calendar.jsx [409:418]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        const personal = await fetchPersonalEventsFromDb();
        const personalMapped = (personal || []).map((ev) => ({
          id: ev.id,
          title: ev.title,
          start: new Date(ev.start),
          end: new Date(ev.end),
          allDay: !!ev.all_day,
          isGroupEvent: false,
          userId: ev.user_id,
        }));
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



