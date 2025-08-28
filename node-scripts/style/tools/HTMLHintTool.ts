import { promises } from "fs";
import { glob } from "glob";
import { HTMLHint } from "htmlhint";
import { Tool } from "../tool";
import IGNORED_FILES from "../../ignored-files";

class HTMLHintTool extends Tool {
  constructor() {
    super("HTMLHint");
  }

  async check(): Promise<boolean> {
    const ruleset = JSON.parse(
      await promises.readFile(".htmlhintrc.json", "utf-8"),
    );
    const failureMessages = (
      await Promise.all(
        (await glob("**/*.html", { ignore: IGNORED_FILES })).map(
          async (fileName) => {
            const messages = HTMLHint.verify(
              await promises.readFile(fileName, "utf-8"),
              ruleset,
            );
            if (messages.length) {
              return `${fileName}\n${messages
                .map(
                  (message) =>
                    `${message.line}:${message.col} ${message.evidence}\n${message.message}\n`,
                )
                .join("")}`;
            }
          },
        ),
      )
    ).filter(Boolean);

    this.addOutput(failureMessages.join("\n"));
    return failureMessages.length === 0;
  }
}

export default HTMLHintTool;
