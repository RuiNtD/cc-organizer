import { grantOrThrow, path } from "./deps.ts";

async function getApiData(id: string) {
  grantOrThrow({ name: "net", host: "api.bethesda.net" });
  let req = await fetch(
    `https://api.bethesda.net/mods/ugc-workshop/content/get?content_id=${id}`,
  );
  let data = await req.json();
  return data.platform.response.content;
}

export async function update(gamePath: string, outputPath: string) {
  if (!path.extname(outputPath)) {
    outputPath += ".json";
  }
  const maniPath = path.join(gamePath, "Creations");
  await grantOrThrow({ name: "read", path: maniPath });
  let files;
  try {
    files = Deno.readDirSync(maniPath);
  } catch (e) {
    console.error("Game not found.");
    return;
  }

  let datas = [];
  for (let file of files) {
    let match = file.name.match(/^(\d+)/) as RegExpMatchArray;
    let contents = await getApiData(match[1]);
    // console.log(contents);
    let name = contents.name.trim();
    let filePath = path.join(maniPath, file.name);
    const data = (await Deno.readTextFile(filePath))
      .split(/.\0/)
      .filter(Boolean);
    console.info(name);
    //for (const fileB of data) console.log("    " + fileB);
    datas.push({ name, data });
  }
  await grantOrThrow({ name: "write", path: outputPath });
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