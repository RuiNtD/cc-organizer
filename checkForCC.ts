import { colors, grantOrThrow, parse, path } from "./deps.ts";
import getGamePaths, { checkReady } from "./lib/getGamePaths.ts";
import { pauseIfP } from "./lib/pause.ts";
const { red, green, bold, inverse } = colors;

const args = parse(Deno.args, {
  boolean: ["found", "missing"],
  default: { found: true, missing: true },
});

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
      if (args.found) {
        console.log(green(`Found ${line}`));
      }
    } catch {
      if (args.missing) {
        console.log(red(`${line} is missing`));
      }
    }
  }
}

const paths = getGamePaths();

async function handle(
  name: string,
  gamePath: string | undefined,
  cccName: string,
) {
  if (gamePath) {
    console.log(bold(inverse(`[ ${name} ]`)));
    try {
      await checkReady(path.join(gamePath, cccName));
      await check(gamePath, cccName);
      console.log();
    } catch (e) {
      console.error(red(e.toString()));
      console.log();
    }
  }
}

await handle("Skyrim Special Edition", paths.SkyrimSE, "Skyrim.ccc");
await handle("Fallout 4", paths.Fallout4, "Fallout4.ccc");

console.log(green(bold("Finished")));
await pauseIfP();
