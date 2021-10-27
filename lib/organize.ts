import { grantOrThrow, path } from "../deps.ts";
import { CreationListData } from "./types.ts";

export default async function handle(
  gamePath: string,
  jsonPath: string,
  output: string,
) {
  const dataPath = path.join(gamePath, "Data");
  await grantOrThrow(
    { name: "read", path: dataPath },
    // { name: "write", path: dataPath },
    { name: "read", path: jsonPath },
    { name: "write", path: output },
  );
  let gameData: CreationListData;
  try {
    gameData = JSON.parse(
      await Deno.readTextFile(jsonPath),
    );
  } catch {
    throw new Error("Could not read JSON file. Try using the update command.");
  }
  for (const data of gameData) {
    const name = data.name.replace(/:/g, " -").trim();
    try {
      await Deno.mkdir(path.join(output, name), { recursive: true });
    } catch {
      // Prevent error if directory already exists
    }
    console.log(data.name);
    for (const file of data.data) {
      const basename = path.basename(file);
      const oldPath = path.join(dataPath, basename);
      const newPath = path.join(output, name, basename);
      // await Deno.rename(oldPath, newPath);
      await Deno.copyFile(oldPath, newPath);
    }
  }
}
