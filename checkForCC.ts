import { grantOrThrow, path } from "./deps.ts";
import getGamePaths, { checkReady } from "./lib/getGamePaths.ts";
import { colors } from "./deps.ts";
const { red, green } = colors;

// Utility script to check for missing CC files
// Does not account for placeholder filenames

async function check(gamePath: string, cccName: string) {
  const cccPath = path.join(gamePath, cccName);
  const dataPath = path.join(gamePath, "Data");
  grantOrThrow(
    { name: "read", path: cccPath },
    { name: "read", path: dataPath },
  );
  const cccText = await Deno.readTextFile(cccPath);
  const cccLines = cccText.split(/\r?\n/).filter(Boolean);
  for (const line of cccLines) {
    try {
      await Deno.stat(path.join(dataPath, line));
      console.log(green(`Found ${line}`));
    } catch (_) {
      console.log(red(`${line} is missing`));
    }
  }
}

const paths = getGamePaths();

if (paths.SkyrimSE) {
  console.log("Checking for Skyrim Special Edition...");
  try {
    await checkReady(path.join(paths.SkyrimSE, "Skyrim.ccc"));
    console.log("Game found. Starting check...");
    await check(paths.SkyrimSE, "Skyrim.ccc");
  } catch (e) {
    console.error(e);
  }
}

if (paths.Fallout4) {
  console.log("Checking for Fallout 4...");
  try {
    await checkReady(path.join(paths.Fallout4, "Fallout4.ccc"));
    console.log("Game found. Starting check...");
    await check(paths.Fallout4, "Fallout4.ccc");
  } catch (e) {
    console.error(e);
  }
}

console.log("Finished");
