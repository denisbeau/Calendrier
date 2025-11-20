src/server/index.js [65:81]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  if (!transporter) {
    console.warn(
      "SMTP transporter not configured. Set SMTP_HOST and related env vars to actually send emails."
    );
    return res
      .status(201)
      .json({ ok: true, warn: "smtp-not-configured", acceptUrl });
  }

  try {
    await transporter.sendMail({ from, to: email, subject, text, html });
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error("Failed to send invite email:", err);
    return res.status(500).json({ error: "failed-to-send" });
  }
});
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



src/server/index.js [117:133]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  if (!transporter) {
    console.warn(
      "SMTP transporter not configured. Set SMTP_HOST and related env vars to actually send emails."
    );
    return res
      .status(201)
      .json({ ok: true, warn: "smtp-not-configured", acceptUrl });
  }

  try {
    await transporter.sendMail({ from, to: email, subject, text, html });
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error("Failed to send invite email:", err);
    return res.status(500).json({ error: "failed-to-send" });
  }
});
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



