import { promises } from "fs";
import path from "path";
import postcss from "postcss";
import postcssLoadConfig from "postcss-load-config";
import { glob } from "glob";
import IGNORED_FILES from "../ignored-files";

async function buildFile(inputFile: string) {
  const outputFile = path.join("dist", inputFile);

  const { plugins, options } = await postcssLoadConfig();

  const result = await postcss(plugins).process(
    await promises.readFile(inputFile, "utf8"),
    {
      ...options,
      from: inputFile,
      to: outputFile,
    },
  );

  await promises.mkdir(path.dirname(outputFile), { recursive: true });
  await promises.writeFile(outputFile, result.css);

  if (result.map) {
    await promises.writeFile(`${outputFile}.map`, result.map.toString());
  }
}

async function main() {
  for (const fileName of await glob("**/*.css", {
    ignore: IGNORED_FILES,
  })) {
    await buildFile(fileName);
  }
}

await main();
