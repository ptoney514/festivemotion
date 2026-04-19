import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadProjectEnv } from "@/scripts/load-project-env";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

function makeTempDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "festivemotion-env-"));
  tempDirs.push(dir);
  return dir;
}

describe("loadProjectEnv", () => {
  it("loads DATABASE_URL from .env.local when no .env file exists", () => {
    const cwd = makeTempDir();
    fs.writeFileSync(path.join(cwd, ".env.local"), "DATABASE_URL=from-local\n");

    const env: Record<string, string | undefined> = {};
    loadProjectEnv({ cwd, env });

    expect(env.DATABASE_URL).toBe("from-local");
  });

  it("prefers .env.local over .env when both files exist", () => {
    const cwd = makeTempDir();
    fs.writeFileSync(path.join(cwd, ".env"), "DATABASE_URL=from-env\n");
    fs.writeFileSync(path.join(cwd, ".env.local"), "DATABASE_URL=from-local\n");

    const env: Record<string, string | undefined> = {};
    loadProjectEnv({ cwd, env });

    expect(env.DATABASE_URL).toBe("from-local");
  });
});
