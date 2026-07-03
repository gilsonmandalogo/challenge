import { serve } from "@hono/node-server";
import { app } from "./app.js";

const port = parseInt(process.env.PORT ?? "3001", 10);

console.log(`Server running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });
