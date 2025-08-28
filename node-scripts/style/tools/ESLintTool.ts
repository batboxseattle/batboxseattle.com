import { ESLint } from "eslint";
import { FixableTool } from "../tool";

class ESLintTool extends FixableTool {
  constructor() {
    super("ESLint");
  }

  check() {
    return this.run(false);
  }

  fix() {
    return this.run(true);
  }

  private async run(fix: boolean) {
    const eslint = new ESLint({ fix });
    const lintResults = await eslint.lintFiles(["."]);

    if (fix) {
      await ESLint.outputFixes(lintResults);
    }

    this.addOutput(
      await (await eslint.loadFormatter("stylish")).format(lintResults),
    );

    return lintResults.every(
      (result) => result.errorCount === 0 && result.warningCount === 0,
    );
  }
}

export default ESLintTool;
