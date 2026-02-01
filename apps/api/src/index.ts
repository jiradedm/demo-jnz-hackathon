import express from "express";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// For Vercel: app is used as serverless function via default export.
// For local dev: start HTTP server (skip on Vercel).
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

export default app;
