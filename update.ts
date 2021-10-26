import { update } from "./lib/update.ts";
import { path } from "./deps.ts";
import getGamePaths, { checkReady } from "./lib/getGamePaths.ts";

const paths = getGamePaths();

if (paths.SkyrimSE) {
  console.log("Checking for Skyrim Special Edition...");
  try {
    await checkReady(path.join(paths.SkyrimSE, "Creations"));
    console.log("Game found. Starting update...");
    await update(paths.SkyrimSE, "skyrimse.json");
  } catch (e) {
    console.error(e);
  }
}

if (paths.Fallout4) {
  console.log("Checking for Fallout 4...");
  try {
    await checkReady(path.join(paths.Fallout4, "Creations"));
    console.log("Game found. Starting update...");
    await update(paths.Fallout4, "fallout4.json");
  } catch (e) {
    console.error(e);
  }
}

console.log("Finished");
