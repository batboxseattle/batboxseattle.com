import { FIXABLE_TOOLS } from "./tools/tools";

async function main() {
  process.exit(
    (await Promise.all(FIXABLE_TOOLS.map((tool) => tool.runFix()))).every(
      Boolean,
    )
      ? 0
      : 1,
  );
}

await main();
