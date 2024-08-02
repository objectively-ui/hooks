import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import type { PackageJson } from "./getPackageJson";

export const writePackageJson = async (packageJson: PackageJson) => {
  const packagePath = path.join(process.cwd(), "package.json");

  await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
};
