import { update } from "./update.ts";
import { grantOrThrow, parse, path } from "./deps.ts";

const args = parse(Deno.args, {
  string: ["lib", "sse", "fo4"],
  boolean: ["help"],
});

if (args.help) {
  console.log(`Game installation paths can be specified in two ways:`);
  console.log("  --lib <libraryPath>");
  console.log("    Specify a path containing a steamapps folder.");
  console.log("  --sse <ssePath> --fo4 <fo4Path>");
  console.log("    Specify the path to SSE and/or FO4.");
  console.log("    One or both paths can be specified.");
  Deno.exit(0);
}

let lib: string = args.lib || path.join("C:", "Program Files (x86)", "Steam");
let common = path.join(lib, "steamapps", "common");
let ssePath = args.sse || path.join(common, "Skyrim Special Edition");
let fo4Path = args.fo4 || path.join(common, "Fallout 4");

const handleDef = !args.lib && !args.sse && !args.fo4;
if (handleDef) {
  console.warn("No arguments provided. Assuming default install locations.");
  console.log("  Use --help for usage information.");
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

grantOrThrow({ name: "write", path: "out" });
try {
  await Deno.mkdir("out");
} catch {}

if (handleSSE) {
  console.log("Checking for Skyrim Special Edition...");
  if (await isReady(ssePath)) {
    await update(ssePath, "out/sse.json");
  }
}

if (handleFO4) {
  console.log("Checking for Fallout 4...");
  if (await isReady(fo4Path)) {
    await update(fo4Path, "out/fo4.json");
  }
}

console.log("Finished");
