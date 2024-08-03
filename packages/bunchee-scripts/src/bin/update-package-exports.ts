import { type PackageJson, getPackageJson } from "../getPackageJson";
import { getSrcFiles } from "../getSrcFiles";
import { writePackageJson } from "../writePackageJson";

const INDEX_FILE = "index.ts";

export const addExportMapsToPackageJson = async () => {
  const packageJson = await getPackageJson();
  let srcFiles = await getSrcFiles();

  const hasIndex = srcFiles.some((file) => file === INDEX_FILE);
  srcFiles = [
    hasIndex ? INDEX_FILE : undefined,
    ...srcFiles.filter((file) => file !== INDEX_FILE),
  ].filter(Boolean) as string[];

  const exports = srcFiles.reduce<PackageJson["exports"]>((exports, name) => {
    const fileNameWithoutExtension = name.split(".")[0];

    const key = name === INDEX_FILE ? "." : `./${fileNameWithoutExtension}`;

    exports[key] = {
      import: `./dist/es/${fileNameWithoutExtension}.mjs`,
      types: `./dist/es/${fileNameWithoutExtension}.d.ts`,
    };

    return exports;
  }, {});

  packageJson.exports = exports;

  await writePackageJson(packageJson);
};

addExportMapsToPackageJson();
