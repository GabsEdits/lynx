/// <reference lib="deno.unstable" />

import { Handlers } from "$fresh/server.ts";

const kv = await Deno.openKv();

export const handler = async (req: Request, ctx: Handlers) => {
  const { id } = ctx.params;

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const link = await kv.get(["links", id]);

  if (link && link.value) {
    return Response.redirect(link.value.originalUrl, 302);
  } else {
    return new Response("Link not found", { status: 404 });
  }
};
