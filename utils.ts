export async function readJsonFile(filePath: string): Promise<any> {
  try {
    const data = await Deno.readTextFile(filePath);
    return JSON.parse(data);
  } catch (e) {
    // If there's an error (e.g., file not found or empty), return null or an empty object
    return null;
  }
}

export async function writeJsonFile(
  filePath: string,
  data: any,
): Promise<void> {
  const jsonData = JSON.stringify(data, null, 2);
  await Deno.writeTextFile(filePath, jsonData);
}
