// deno-lint-ignore-file

const path = require("path");
const fs = require("fs");

async function handle(gameName, game) {
  const gamePath = fs
    .readFileSync(game + "Path.txt")
    .toString()
    .trim();
  if (!fs.existsSync(gamePath)) {
    console.log(`[${gameName}]`, "GAME NOT FOUND");
    return;
  }
  const maniPath = path.join(gamePath, "Creations");
  const dataPath = path.join(gamePath, "Data");
  for (const folder of fs.readdirSync(maniPath)) {
    const folderPath = path.join(maniPath, folder);
    if (fs.statSync(folderPath).isDirectory()) {
      for (const file of fs.readdirSync(folderPath)) {
        const oldPath = path.join(folderPath, file);
        const newPath = path.join(dataPath, path.basename(file));
        fs.renameSync(oldPath, newPath);
      }
      fs.rmdirSync(folderPath);
    }
  }
}

handle("Skyrim SE", "Skyrim");
handle("Fallout 4", "Fallout");
