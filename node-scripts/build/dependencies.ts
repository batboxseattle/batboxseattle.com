import fsExtra from "fs-extra";
import path from "path";

const SOURCE = "node_modules";
const DESTINATION = path.join("dist", "node_modules");

async function main() {
  await fsExtra.emptyDir(DESTINATION);
  await fsExtra.copy(SOURCE, DESTINATION, { overwrite: true });
}

await main();
