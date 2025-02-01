/// <reference lib="deno.unstable" />
import { Handlers } from "$fresh/server.ts";
import { nanoid } from "npm:nanoid";

interface Link {
  id: string;
  originalUrl: string;
}

const kv = await Deno.openKv();

async function readLinks(): Promise<Record<string, Link>> {
  const entries = kv.list<Link>({ prefix: ["links"] });
  const links: Record<string, Link> = {};

  for await (const entry of entries) {
    links[entry.key[1] as string] = entry.value;
  }

  return links;
}

async function saveLink(id: string, link: Link): Promise<void> {
  await kv.set(["links", id], link);
}

async function deleteLink(id: string): Promise<void> {
  await kv.delete(["links", id]);
}

export const handler: Handlers = {
  async POST(req: Request) {
    try {
      const body = await req.json();
      const { originalUrl } = body;

      if (!originalUrl) {
        return new Response(
          JSON.stringify({ error: "Original URL is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const newId = nanoid(4);
      const newLink: Link = { id: newId, originalUrl };

      await saveLink(newId, newLink);

      return new Response(
        JSON.stringify({
          shortUrl: `https://lynx.gxbs.dev/${newId}`,
          originalUrl: newLink.originalUrl,
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (_error) {
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
  async DELETE(req: Request) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const links = await readLinks();

    if (!links[id]) {
      return new Response(
        JSON.stringify({ error: "Link not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    await deleteLink(id);

    return new Response(
      JSON.stringify({ message: "Link deleted successfully" }),
      { headers: { "Content-Type": "application/json" } },
    );
  },
  GET() {
    return new Response("Method Not Allowed", { status: 405 });
  },
};
