/// <reference lib="deno.unstable" />

import { Handlers } from "$fresh/server.ts";

const kv = await Deno.openKv("https://api.deno.com/databases/086fcc69-2996-494a-9ebc-963085893ad7/connect");

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
