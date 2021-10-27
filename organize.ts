import organize from "./lib/organize.ts";
import { colors, path } from "./deps.ts";
import getGamePaths, { checkReady } from "./lib/getGamePaths.ts";
import { pauseIfP } from "./lib/pause.ts";
const { bold, inverse, red, green } = colors;

async function handle(
  name: string,
  gamePath: string | undefined,
  jsonPath: string,
) {
  if (gamePath) {
    console.log(bold(inverse(`[ ${name} ]`)));
    try {
      await checkReady(path.join(gamePath, "Data"));
      await organize(gamePath, jsonPath, name);
      console.log(green("Done."));
      console.log();
    } catch (e) {
      console.error(red(e.toString()));
      console.log();
    }
  }
}

const paths = getGamePaths();

await handle("Skyrim SE", paths.SkyrimSE, "SkyrimSE.json");
await handle("Fallout 4", paths.Fallout4, "Fallout4.json");

console.log(green(bold("Finished")));
await pauseIfP();
