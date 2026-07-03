import { Hono } from "hono";
import {
  createFlip,
  getFlip,
  getRecentFlips,
  getWalletStreak,
} from "../services/flipService.js";
import type { CreateFlipRequest } from "../types.js";

const flips = new Hono();

flips.post("/", async (c) => {
  const body = await c.req.json<CreateFlipRequest>();
  const result = await createFlip(body);

  if ("error" in result) {
    return c.json({ error: result.error }, 400);
  }

  return c.json(result, 201);
});

flips.get("/recent", (c) => {
  const limit = Math.min(parseInt(c.req.query("limit") ?? "20", 10), 50);
  const flipsList = getRecentFlips(limit);
  return c.json({ flips: flipsList });
});

flips.get("/wallet/:address/streak", (c) => {
  const address = c.req.param("address");
  const streak = getWalletStreak(address);
  return c.json(streak);
});

flips.get("/:id", (c) => {
  const id = c.req.param("id");
  const flip = getFlip(id);

  if (!flip) {
    return c.json({ error: "Flip not found" }, 404);
  }

  return c.json(flip);
});

export { flips };
