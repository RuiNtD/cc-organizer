import { parse, path } from "../deps.ts";

export interface GamePaths {
  SkyrimSE?: string;
  Fallout4?: string;
}

const args = parse(Deno.args, {
  string: ["lib", "sse", "fo4"],
});

const lib: string = args.lib || path.join("C:", "Program Files (x86)", "Steam");
const common = path.join(lib, "steamapps", "common");

const ssePath = args.sse || path.join(common, "Skyrim Special Edition");
const fo4Path = args.fo4 || path.join(common, "Fallout 4");

const handleDef = !args.lib && !args.sse && !args.fo4;
if (handleDef) {
  console.log("No arguments provided. Assuming default install locations.");
}

const handleLib = !!(args.lib) || handleDef;
const handleSSE = handleLib || !!(args.sse);
const handleFO4 = handleLib || !!(args.fo4);

export async function checkReady(gamePath: string) {
  const status = await Deno.permissions.request({
    name: "read",
    path: gamePath,
  });
  if (status.state !== "granted") {
    throw "Permission denied. Skipping...";
  }
  try {
    await (Deno.stat(gamePath));
  } catch {
    throw "Failed to find game. Skipping...";
  }
}

export default function getGamePaths(): GamePaths {
  const ret: GamePaths = {};
  if (handleSSE) {
    ret.SkyrimSE = ssePath;
  }
  if (handleFO4) {
    ret.Fallout4 = fo4Path;
  }
  return ret;
}
