import { Hono } from "hono";
import { getStats } from "../services/flipService.js";

const stats = new Hono();

stats.get("/", (c) => {
  return c.json(getStats());
});

export { stats };
