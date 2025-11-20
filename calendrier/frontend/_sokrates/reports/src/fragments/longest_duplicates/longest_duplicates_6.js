src/server/index.js [46:51]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    process.env.FRONTEND_URL ||
    process.env.VITE_FRONTEND_URL ||
    "http://localhost:5173";
  const acceptUrl = `${frontend.replace(
    /\/$/,
    ""
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



src/server/index.js [96:102]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    process.env.FRONTEND_URL ||
    process.env.VITE_FRONTEND_URL ||
    "http://localhost:5173";

  const acceptUrl = `${frontend.replace(
    /\/$/,
    ""
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



