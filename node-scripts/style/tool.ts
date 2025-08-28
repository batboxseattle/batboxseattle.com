export abstract class Tool {
  protected readonly output: string[] = [];
  protected readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  async runCheck(): Promise<boolean> {
    this.clearOutput();
    try {
      const success = await this.check();
      this.printResult(success);
      return success;
    } catch (error) {
      this.addOutput(`Error while checking ${this.name}:\n${error}`);
      this.printResult(false);
      return false;
    }
  }

  abstract check(): Promise<boolean>;

  protected clearOutput() {
    this.output.splice(0, this.output.length);
  }

  protected addOutput(message: string) {
    this.output.push(message);
  }

  protected printResult(success: boolean) {
    console.log(
      `\n=== ${this.name} ===\n${success ? "PASS" : "FAIL"}\n${this.output.join("\n")}\n`,
    );
  }
}

export abstract class FixableTool extends Tool {
  async runFix(): Promise<boolean> {
    this.clearOutput();
    try {
      const success = await this.fix();
      this.printResult(success);
      return success;
    } catch (error) {
      this.addOutput(`Error while fixing ${this.name}: ${error}`);
      this.printResult(false);
      return false;
    }
  }

  abstract fix(): Promise<boolean>;
}
