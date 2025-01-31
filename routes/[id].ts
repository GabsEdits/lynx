import { Handlers } from "$fresh/server.ts";
import { readJsonFile } from "../utils.ts";

const filePath = "./links.json";

export const handler = async (req: Request, ctx: Handlers) => {
  const { id } = ctx.params;

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const links = await readJsonFile(filePath);

  if (links && links[id]) {
    return Response.redirect(links[id].originalUrl, 302);
  } else {
    return new Response("Link not found", { status: 404 });
  }
};
