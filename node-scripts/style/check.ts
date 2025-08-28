import { TOOLS } from "./tools/tools";

async function main() {
  process.exit(
    (await Promise.all(TOOLS.map((tool) => tool.runCheck()))).every(Boolean)
      ? 0
      : 1,
  );
}

await main();
