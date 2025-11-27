frontend/src/server/index.js [92:98]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  try {
    const result = await sendInviteEmail({ to: email, subject, text, html, acceptUrl });
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



frontend/src/server/index.js [132:138]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  try {
    const result = await sendInviteEmail({ to: email, subject, text, html, acceptUrl });
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



