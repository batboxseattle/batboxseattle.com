import stylelint from "stylelint";
import { glob } from "glob";
import { FixableTool } from "../tool";
import IGNORED_FILES from "../../ignored-files";

class StylelintTool extends FixableTool {
  constructor() {
    super("Stylelint");
  }

  async check() {
    return this.run(false);
  }

  async fix() {
    return this.run(true);
  }

  private async run(fix: boolean) {
    const { errored, report } = await stylelint.lint({
      files: await this.getFileNames(),
      formatter: "string",
      fix,
    });
    this.addOutput(report);
    return !errored;
  }

  private async getFileNames() {
    return await glob("**/*.css", {
      ignore: IGNORED_FILES,
    });
  }
}

export default StylelintTool;
