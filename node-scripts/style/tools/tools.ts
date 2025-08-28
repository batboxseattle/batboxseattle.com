import ESLintTool from "./ESLintTool";
import HTMLHintTool from "./HTMLHintTool";
import PrettierTool from "./PrettierTool";
import StylelintTool from "./StylelintTool";
import WebhintTool from "./WebhintTool";
import { Tool } from "../tool";

export const TOOLS: Tool[] = [
  new ESLintTool(),
  new HTMLHintTool(),
  new PrettierTool(),
  new StylelintTool(),
  new WebhintTool(),
];

export const FIXABLE_TOOLS = [
  new ESLintTool(),
  new PrettierTool(),
  new StylelintTool(),
];
