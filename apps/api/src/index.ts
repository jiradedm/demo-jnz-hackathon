import express, { type Express } from "express";
import cors from "cors";

const app: Express = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "API is running",
    health: "/health",
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/form", (req, res) => {
  res.json({ received: req.body });
});

// For Vercel: app is used as serverless function via default export.
// For local dev: start HTTP server (skip on Vercel).
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

export default app as Express;
