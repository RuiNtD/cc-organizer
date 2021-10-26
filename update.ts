import { update } from "./lib/update.ts";
import { grantOrThrow, parse, path } from "./deps.ts";

const args = parse(Deno.args, {
  string: ["lib", "sse", "fo4"],
});
let lib: string = args.lib || path.join("C:", "Program Files (x86)", "Steam");
let common = path.join(lib, "steamapps", "common");
let ssePath = args.sse || path.join(common, "Skyrim Special Edition");
let fo4Path = args.fo4 || path.join(common, "Fallout 4");

const handleDef = !args.lib && !args.sse && !args.fo4;
if (handleDef) {
  console.log("No arguments provided. Assuming default install locations.");
}

const handleLib = !!(args.lib) || handleDef;
const handleSSE = handleLib || !!(args.sse);
const handleFO4 = handleLib || !!(args.fo4);

async function isReady(gamePath: string): Promise<boolean> {
  const maniPath = path.join(gamePath, "Creations");
  let status = await Deno.permissions.request({ name: "read", path: maniPath });
  if (status.state !== "granted") {
    console.log("Permission denied. Skipping...");
    return false;
  }
  try {
    await (Deno.stat(maniPath));
    console.log("Game found. Starting update...");
    return true;
  } catch {
    console.log("Failed to find game. Skipping...");
    return false;
  }
}

if (handleSSE) {
  console.log("Checking for Skyrim Special Edition...");
  if (await isReady(ssePath)) {
    await update(ssePath, "skyrimse.json");
  }
}

if (handleFO4) {
  console.log("Checking for Fallout 4...");
  if (await isReady(fo4Path)) {
    await update(fo4Path, "fallout4.json");
  }
}

console.log("Finished");
