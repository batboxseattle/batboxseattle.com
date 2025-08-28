import { glob } from "glob";
import prettier from "prettier";
import { promises } from "fs";
import { FixableTool } from "../tool";
import IGNORED_FILES from "../../ignored-files";

class PrettierTool extends FixableTool {
  constructor() {
    super("Prettier");
  }

  async check() {
    const failingFileNames = (
      await Promise.all(
        (await this.getFileNames()).map(async (fileName) =>
          (await prettier.check(await promises.readFile(fileName, "utf-8"), {
            ...(await prettier.resolveConfig(fileName)),
            filepath: fileName,
          }))
            ? null
            : fileName,
        ),
      )
    ).filter(Boolean);

    failingFileNames.forEach((fileName) =>
      this.addOutput(`File ${fileName} is not formatted correctly.`),
    );

    return failingFileNames.length === 0;
  }

  async fix() {
    const fixedFileNames = (
      await Promise.all(
        (await this.getFileNames()).map(async (fileName) => {
          const originalFileContent = await promises.readFile(
            fileName,
            "utf-8",
          );
          const formattedFileContent = await prettier.format(
            originalFileContent,
            {
              ...(await prettier.resolveConfig(fileName)),
              filepath: fileName,
            },
          );
          await promises.writeFile(fileName, formattedFileContent);
          return formattedFileContent === originalFileContent ? null : fileName;
        }),
      )
    ).filter(Boolean);

    fixedFileNames.forEach((fileName) => this.addOutput(`Fixed ${fileName}`));

    return fixedFileNames.length === 0;
  }

  private async getFileNames() {
    return await glob("**/*.{css,html,js,json,md,mjs,ts,yml}", {
      ignore: IGNORED_FILES,
    });
  }
}

export default PrettierTool;
