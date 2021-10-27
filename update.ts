import update from "./lib/update.ts";
import { colors, grantOrThrow, path } from "./deps.ts";
import getGamePaths, { checkReady } from "./lib/getGamePaths.ts";
import { pauseIfP } from "./lib/pause.ts";
const { bold, inverse, red, green, yellow } = colors;

async function handle(
  name: string,
  gamePath: string | undefined,
  output: string,
) {
  if (gamePath) {
    console.log(bold(inverse(`[ ${name} ]`)));
    try {
      await checkReady(path.join(gamePath, "Creations"));
      await update(gamePath, output);
      console.log(green("Done. Data file saved."));
      console.log();
    } catch (e) {
      console.error(red(e.toString()));
      console.log();
    }
  }
}

const paths = getGamePaths();
try {
  console.log(
    `${
      inverse(bold("[ INFO ]"))
    } ${(`If you encounter any ${
      red("TypeError")
    }s, just try updating again.`)}`,
  );
  await grantOrThrow({ name: "net", host: "api.bethesda.net" });
  console.log();
} catch (e) {
  console.error(red(e.toString()));
  await pauseIfP();
  Deno.exit(1);
}

await handle("Skyrim SE", paths.SkyrimSE, "SkyrimSE.json");
await handle("Fallout 4", paths.Fallout4, "Fallout4.json");

console.log(green(bold("Finished")));
await pauseIfP();
