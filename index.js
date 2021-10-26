// deno-lint-ignore-file

const path = require("path");
const fs = require("fs");

async function handle(gameName, game) {
  const gameData = JSON.parse(fs.readFileSync(game + "Data.json"));
  const gamePath = fs
    .readFileSync(game + "Path.txt")
    .toString()
    .trim();
  if (!fs.existsSync(gamePath)) {
    console.log(`[${gameName}]`, "GAME NOT FOUND");
    return;
  }
  const maniPath = path.join(gamePath, "Creations");
  for (const data of gameData) {
    let name = data.name.replace(/:/g, " -").trim();
    fs.mkdirSync(path.join(maniPath, name));
    for (const file of data.data) {
      const oldPath = path.join(gamePath, file);
      const newPath = path.join(maniPath, name, path.basename(file));
      fs.renameSync(oldPath, newPath);
    }
  }
}

handle("Skyrim SE", "Skyrim");
handle("Fallout 4", "Fallout");
