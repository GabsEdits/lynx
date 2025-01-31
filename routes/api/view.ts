import { Handlers } from "$fresh/server.ts";
import { nanoid } from "npm:nanoid";
import { readJsonFile, writeJsonFile } from "../../utils.ts";

interface Link {
  id: string;
  originalUrl: string;
}

const filePath = "./links.json";

async function readLinksFromFile(): Promise<Record<string, Link>> {
  try {
    const data = await readJsonFile(filePath);
    return data || {};
  } catch (_e) {
    return {};
  }
}

async function saveLinksToFile(links: Record<string, Link>): Promise<void> {
  await writeJsonFile(filePath, links);
}

export const handler: Handlers = {
  async POST(req: Request) {
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

    const links = await readLinksFromFile();

    links[newId] = newLink;

    await saveLinksToFile(links);

    return new Response(
      JSON.stringify({ shortUrl: `https://lynx.gxbs.dev/${newId}` }),
      { headers: { "Content-Type": "application/json" } },
    );
  },
  async GET(req: Request) {
    const url = new URL(req.url);
    if (url.pathname === "/api/view") {
      const links = await readLinksFromFile();
      return new Response(JSON.stringify(links), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
