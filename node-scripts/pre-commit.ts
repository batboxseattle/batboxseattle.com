import { execFileSync, spawnSync } from "child_process";

class PreCommitError extends Error {
  constructor(command: string, status: number | null) {
    super(`Command '${command}' failed with status ${status}.`);
  }
}

async function main() {
  const stagedFileNames = execFileSync(
    "git",
    ["diff", "--name-only", "--cached", "--diff-filter=d"],
    { encoding: "utf-8" },
  )
    .trim()
    .split("\n")
    .filter(Boolean);

  const stashCreated = (() => {
    if (spawnSync("git", ["diff", "--quiet"]).status !== 0) {
      console.log("Stashing unstaged changes...");
      execFileSync(
        "git",
        ["stash", "push", "--keep-index", "-m", "pre-commit-stash"],
        { stdio: "inherit" },
      );
      return true;
    }
    return false;
  })();

  try {
    runNpmCommand("update-collage-images");
    runNpmCommand("update-collage-images");
    runNpmCommand("style:fix", true);

    if (stagedFileNames.length > 0) {
      execFileSync("git", ["add", ...stagedFileNames], { stdio: "inherit" });
    }

    runNpmCommand("build");
    runNpmCommand("style:check");
  } finally {
    if (stashCreated) {
      console.log("Restoring unstaged changes...");
      execFileSync("git", ["stash", "pop", "--quiet"], { stdio: "inherit" });
    }
  }
}

function runNpmCommand(command: string, ignoreResult = false) {
  const result = spawnSync("npm", ["run", command], { stdio: "inherit" });
  if (!ignoreResult && result.status !== 0) {
    throw new PreCommitError(`npm run ${command}`, result.status);
  }
}

await main();
