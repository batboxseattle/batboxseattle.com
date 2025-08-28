import { ChildProcess, spawn } from "child_process";
import puppeteer, { Browser } from "puppeteer";
import treeKill from "tree-kill";
import axios from "axios";
import { Tool } from "../tool";

class WebhintTool extends Tool {
  readonly SERVER_STARTUP_TIMEOUT_SECONDS = 60;
  readonly SERVER_PING_TIMEOUT_SECONDS = 60;
  readonly SERVER_URL = "http://localhost:8080";
  readonly SERVER_EPK_URL = "http://localhost:8080/epk.html";

  constructor() {
    super("Webhint");
  }

  async check(): Promise<boolean> {
    const serverProcess = await this.startServer();
    try {
      const urls = await this.findUrlsOnServer();

      return await new Promise<boolean>((resolve) => {
        const hintArgs = ["hint", ...urls];

        const webhintProcess = spawn("npx", hintArgs, {
          stdio: "ignore",
          shell: true,
        });

        webhintProcess.on("exit", async (code) => {
          this.addOutput("View the reports in the hint-report directory.");
          resolve(code === 0);
        });

        webhintProcess.on("error", async (error) => {
          this.addOutput(`Failed to run Webhint: ${error.message}`);
          if (error.stack) this.addOutput(error.stack);
          resolve(false);
        });
      });
    } finally {
      await this.stopServer(serverProcess);
    }
  }

  private async startServer(): Promise<ChildProcess> {
    this.addOutput("Starting server...");

    return new Promise((resolve, reject) => {
      const serverProcess = spawn("npm run start", {
        stdio: ["ignore", "pipe", "pipe"],
        shell: true,
      });

      const serverProcessOutputChunks: string[] = [];

      const serverStartedSignal = (() => {
        let resolver: () => void;
        const promise = new Promise<void>((resolve) => {
          resolver = resolve;
        });
        return { promise, resolve: resolver! };
      })();

      [serverProcess.stdout, serverProcess.stderr].forEach((readable) => {
        readable.on("data", (data: Buffer) => {
          const outputChunk = data.toString();
          serverProcessOutputChunks.push(outputChunk);
          if (outputChunk.includes("Project is running at:")) {
            serverStartedSignal.resolve();
          }
        });
      });

      serverProcess.on("error", (error) => {
        reject(new Error(`Server process failed to start: ${error.message}`));
      });

      serverProcess.on("exit", (code, signal) => {
        reject(
          new Error(
            `Server process exited prematurely with code ${code} and signal ${signal}.`,
          ),
        );
      });

      (async (): Promise<void> => {
        const startupAbortController = new AbortController();
        const startupTimeout = setTimeout(() => {
          startupAbortController.abort(
            new Error(
              `Timeout: Server did not start within ${this.SERVER_STARTUP_TIMEOUT_SECONDS} seconds.`,
            ),
          );
        }, this.SERVER_STARTUP_TIMEOUT_SECONDS * 1000);

        try {
          await serverStartedSignal.promise;

          const pingAbortController = new AbortController();
          const pingTimeout = setTimeout(() => {
            pingAbortController.abort(
              new Error(
                `Timeout: Server did not respond to ping within ${this.SERVER_PING_TIMEOUT_SECONDS} seconds.`,
              ),
            );
          }, this.SERVER_PING_TIMEOUT_SECONDS * 1000);

          try {
            while (true) {
              try {
                await axios.get(this.SERVER_URL, {
                  signal: pingAbortController.signal,
                });
                this.addOutput("Server started.");
                return;
              } catch {
                if (pingAbortController.signal.aborted)
                  throw pingAbortController.signal.reason;
                await this.sleep(1000, pingAbortController.signal);
              }
            }
          } finally {
            clearTimeout(pingTimeout);
          }
        } finally {
          clearTimeout(startupTimeout);
        }
      })()
        .then(() => resolve(serverProcess))
        .catch(async (error) => {
          this.addOutput(serverProcessOutputChunks.join(""));
          await this.stopServer(serverProcess);
          reject(error);
        });
    });
  }

  private async stopServer(serverProcess: ChildProcess): Promise<void> {
    this.addOutput("Stopping server...");
    return new Promise((resolve, reject) => {
      treeKill(serverProcess.pid!, "SIGKILL", (error) => {
        if (error) {
          this.addOutput(`Failed to stop server process: ${error}`);
          return reject(error);
        }
        this.addOutput("Server stopped.");
        resolve();
      });
    });
  }

  private sleep(
    sleepTimeMilliseconds: number,
    abortSignal: AbortSignal,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (abortSignal.aborted) {
        return reject(abortSignal.reason);
      }

      const timeout = setTimeout(() => {
        cleanUp();
        resolve();
      }, sleepTimeMilliseconds);

      const onAbort = () => {
        cleanUp();
        reject(abortSignal.reason);
      };

      const cleanUp = () => {
        clearTimeout(timeout);
        abortSignal.removeEventListener("abort", onAbort);
      };

      abortSignal.addEventListener("abort", onAbort, { once: true });
    });
  }

  private async findUrlsOnServer() {
    const browser = await puppeteer.launch();

    try {
      return new Set(
        (
          await Promise.all(
            [this.SERVER_URL, this.SERVER_EPK_URL].map((url) =>
              this.crawlUrlOnServer(browser, url),
            ),
          )
        ).flatMap((urls) => [...urls]),
      );
    } finally {
      await browser.close();
    }
  }

  private async crawlUrlOnServer(browser: Browser, startingUrl: string) {
    const page = await browser.newPage();

    try {
      const urlQueue: string[] = [startingUrl];
      const visitedUrls = new Set<string>();

      while (urlQueue.length > 0) {
        const url = urlQueue.shift()!;
        if (visitedUrls.has(url)) continue;
        visitedUrls.add(url);

        await page.goto(url, { waitUntil: "networkidle0" });

        urlQueue.push(
          ...(
            await page.$$eval("a", (anchors) =>
              anchors.map((a) =>
                a.href.includes("#") ? a.href.split("#")[0] : a.href,
              ),
            )
          ).filter(
            (urlOnPage) =>
              urlOnPage.startsWith(this.SERVER_URL) &&
              !visitedUrls.has(urlOnPage),
          ),
        );
      }
      return visitedUrls;
    } finally {
      await page.close();
    }
  }
}

export default WebhintTool;
