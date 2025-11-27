import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Create a nodemailer transporter using SMTP settings from env
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT
    ? Number(process.env.SMTP_PORT)
    : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: user && pass ? { user, pass } : undefined,
  });
}

const transporter = createTransporter();

app.get("/api/health", (req, res) => res.json({ ok: true }));

// POST /api/invite
// body: { groupId, email }
app.post("/api/invite", async (req, res) => {
  const { groupId, email } = req.body || {};
  if (!groupId || !email) {
    return res.status(400).json({ error: "groupId and email are required" });
  }

  const frontend =
    process.env.FRONTEND_URL ||
    process.env.VITE_FRONTEND_URL ||
    "http://localhost:5173";
  const acceptUrl = `${frontend.replace(
    /\/$/,
    ""
  )}/accept-invite?group=${encodeURIComponent(
    groupId
  )}&email=${encodeURIComponent(email)}`;

  // Compose email
  const from =
    process.env.FROM_EMAIL ||
    `no-reply@${process.env.SMTP_HOST || "localhost"}`;
  const subject = `Invitation à rejoindre le groupe (${groupId})`;
  const text = `Vous êtes invité(e) à rejoindre le groupe. Acceptez l'invitation : ${acceptUrl}`;
  const html = `<p>Vous êtes invité(e) à rejoindre le groupe.</p><p><a href="${acceptUrl}">Accepter l'invitation</a></p>`;

  // If transporter is not configured, return created but with warning
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

// compatibility with frontend `inviteByEmail` which calls /api/send-invite
app.post("/api/send-invite", async (req, res) => {
  const { email, groupId, token, groupName, inviterEmail, acceptUrlBase } =
    req.body || {};

  if (!email || !groupId || !token) {
    return res
      .status(400)
      .json({ error: "email, groupId and token are required" });
  }

  const frontend =
    acceptUrlBase ||
    process.env.FRONTEND_URL ||
    process.env.VITE_FRONTEND_URL ||
    "http://localhost:5173";

  const acceptUrl = `${frontend.replace(
    /\/$/,
    ""
  )}/accept-invite?token=${encodeURIComponent(token)}`;

  const from =
    process.env.FROM_EMAIL ||
    `no-reply@${process.env.SMTP_HOST || "localhost"}`;
  const subject = `Invitation à rejoindre ${groupName || "un groupe"}`;
  const text = `Vous êtes invité(e) à rejoindre ${
    groupName || "un groupe"
  }. Acceptez : ${acceptUrl}`;
  const html = `<p>${
    inviterEmail ? `${inviterEmail} ` : ""
  }vous invite à rejoindre <strong>$
  {groupName || "le groupe"}</strong>.</p><p><a href="${acceptUrl}">Accepter l'invitation</a></p>`;

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

app.listen(PORT, () => {
  console.log(`Invite server listening on http://localhost:${PORT}`);
});
