const https = require("https");
const path = require("path");
const fs = require("fs");

function getApiData(id) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      {
        hostname: "api.bethesda.net",
        path: `/mods/ugc-workshop/content/get?content_id=${id}`,
      },
      function (res) {
        let chunks = [];

        res.on("data", (chunk) => chunks.push(chunk));

        res.on("end", () => {
          let body = Buffer.concat(chunks);
          const data = JSON.parse(body.toString());
          const details = data.platform.response.content;
          resolve(details);
        });
      }
    );

    req.on("error", (e) => reject(e));

    req.end();
  });
}

async function handle(gameName, game) {
  let files, maniPath;
  try {
    const gamePath = fs
      .readFileSync(game + "Path.txt")
      .toString()
      .trim();
    maniPath = path.join(gamePath, "Creations");
    files = fs.readdirSync(maniPath);
  } catch {
    console.log(`[${gameName}]`, "GAME NOT FOUND");
    return;
  }
  let datas = [];
  let promises = [];
  for (let file of files)
    promises.push(
      getApiData(file.match(/^(\d+)/)[1]).then((contents) => {
        console.log(contents);
        let name = contents.name.trim();
        file = path.join(maniPath, file);
        const data = fs
          .readFileSync(file)
          .toString()
          .split(/.\0/)
          .filter(Boolean);
        console.log(`[${gameName}]`, name);
        //for (const fileB of data) console.log("    " + fileB);
        datas.push({ name, data });
      })
    );
  await Promise.all(promises);
  fs.writeFileSync(
    game + "Data.json",
    JSON.stringify(datas, null, "  ") + "\n"
  );
  console.log(`[${gameName}]`, "DONE");
}

Promise.all([
  handle("Skyrim SE", "Skyrim"),
  handle("Fallout 4", "Fallout"),
]).then(() => {
  console.log("Finished");
});
