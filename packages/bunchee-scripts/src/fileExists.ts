import fs from "node:fs/promises";

export const fileExists = async (path: string) => {
  return await fs.stat(path).then(
    () => true,
    () => false,
  );
};
