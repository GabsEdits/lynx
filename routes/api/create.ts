import { Handlers } from "$fresh/server.ts";
import { nanoid } from "npm:nanoid";
import { readJsonFile, writeJsonFile } from "../../utils.ts";

interface Link {
  id: string;
  originalUrl: string;
}

const filePath = "./links.json";

async function readLinks(): Promise<Record<string, Link>> {
  try {
    const data = await readJsonFile(filePath);
    return data || {};
  } catch (_e) {
    return {};
  }
}

async function saveLinks(links: Record<string, Link>): Promise<void> {
  await writeJsonFile(filePath, links);
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

      const links = await readLinks();

      links[newId] = newLink;

      await saveLinks(links);

      return new Response(
        JSON.stringify({
          shortUrl: `https://lynx.gxbs.dev/${newId}`,
          originalUrl: newLink.originalUrl,
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
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

    delete links[id];

    await saveLinks(links);

    return new Response(
      JSON.stringify({ message: "Link deleted successfully" }),
      { headers: { "Content-Type": "application/json" } },
    );
  },
  GET() {
    return new Response("Method Not Allowed", { status: 405 });
  },
};
