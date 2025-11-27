# Server Directory

This directory contains a standalone Express server for handling email invitations.

## Purpose

The server in `src/server/index.js` is a separate Node.js/Express application that handles:
- Email invitations for group memberships
- SMTP email sending via nodemailer

## Note

This is **not** part of the React frontend application. It should be run separately using:

```bash
npm run start:server
```

## Future Consideration

If this server grows or needs to be deployed separately, consider moving it to a root-level `backend/` or `server/` directory outside of the `frontend/src/` folder to better separate concerns.

