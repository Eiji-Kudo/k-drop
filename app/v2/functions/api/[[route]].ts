import { handle } from "hono/cloudflare-pages";
import { app } from "../../src/lib/api/app";

export const onRequest = handle(app);
