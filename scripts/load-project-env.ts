import { config } from "dotenv";

export function loadProjectEnv({
  cwd = process.cwd(),
  env = process.env,
}: {
  cwd?: string;
  env?: Record<string, string | undefined>;
} = {}) {
  config({
    path: [`${cwd}/.env.local`, `${cwd}/.env`],
    processEnv: env,
    override: false,
    quiet: true,
  });
}
