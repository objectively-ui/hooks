import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

export interface PackageJson {
  name: string;
  version: string;
  exports: Record<string, { types: string; import: string }>;
}

export const getPackageJson = async () => {
  const packagePath = path.join(process.cwd(), "package.json");
  return JSON.parse(await fs.readFile(packagePath, { encoding: "utf-8" })) as PackageJson;
};
