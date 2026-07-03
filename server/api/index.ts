import { handle } from "@hono/node-server/vercel";
import { app } from "../src/app.js";
import type { IncomingMessage, ServerResponse } from "node:http";

const listener = handle(app);

type VercelRequest = IncomingMessage & {
  body?: unknown;
  rawBody?: Buffer;
};

export default function handler(req: VercelRequest, res: ServerResponse) {
  if (req.body && !req.rawBody) {
    req.rawBody = Buffer.from(
      typeof req.body === "string" ? req.body : JSON.stringify(req.body)
    );
  }
  return listener(req, res);
}
