import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileExists } from "./fileExists";

export const getSrcFiles = async () => {
  const srcPath = path.join(process.cwd(), "src");
  const files = await fs.readdir(srcPath, { recursive: false, withFileTypes: true });
  const toplevelFiles: string[] = [];

  for (const file of files) {
    if (file.isDirectory()) {
      const hasIndex = await fileExists(path.join(file.path, "index.ts"));
      if (hasIndex) {
        toplevelFiles.push(file.name);
      }
    }

    if (!file.isFile()) {
      continue;
    }

    toplevelFiles.push(file.name);
  }

  return toplevelFiles;
};
