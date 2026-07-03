import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { flips } from "./routes/flips.js";
import { stats } from "./routes/stats.js";

const app = new Hono();

const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";
const allowedOrigins = corsOrigin.split(",").map((o) => o.trim());

app.use(
  "/*",
  cors({
    origin: (origin) => {
      if (!origin) return allowedOrigins[0];
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return origin;
      }
      return allowedOrigins[0];
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

app.route("/api/flips", flips);
app.route("/api/stats", stats);

const port = parseInt(process.env.PORT ?? "3001", 10);

console.log(`Server running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });

export default app;
