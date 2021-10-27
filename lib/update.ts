import { grantOrThrow, path } from "../deps.ts";

async function getApiData(id: string) {
  grantOrThrow({ name: "net", host: "api.bethesda.net" });
  const req = await fetch(
    `https://api.bethesda.net/mods/ugc-workshop/content/get?content_id=${id}`,
  );
  const data = await req.json();
  return data.platform.response.content;
}

export async function update(gamePath: string, outputPath: string) {
  if (!path.extname(outputPath)) {
    outputPath += ".json";
  }
  const maniPath = path.join(gamePath, "Creations");
  await grantOrThrow(
    { name: "read", path: maniPath },
    { name: "write", path: outputPath },
  );
  let files;
  try {
    files = Deno.readDirSync(maniPath);
  } catch (_) {
    console.error("Game not found.");
    return;
  }

  const datas = [];
  for (const file of files) {
    if (path.extname(file.name) != ".manifest") {
      continue;
    }
    const match = file.name.match(/^(\d+)/) as RegExpMatchArray;
    const contents = await getApiData(match[1]);
    // console.log(contents);
    const name = contents.name.trim();
    const filePath = path.join(maniPath, file.name);
    const data = (await Deno.readTextFile(filePath))
      .split(/.\0/)
      .filter(Boolean);
    console.info(name);
    //for (const fileB of data) console.log("    " + fileB);
    datas.push({ name, data });
  }
  await Deno.writeTextFile(outputPath, JSON.stringify(datas, null, 2) + "\n");
  console.info("Done. Saved data file");
}

if (import.meta.main) {
  const args = Deno.args;
  if (args.length < 2) {
    console.error("Invalid usage.");
    console.log("  Usage: update <gamePath> <outputPath>");
    console.log('  Example: update "C:\\SkyrimSE" skyrim.json');
  } else await update(args[0], args[1]);
}
