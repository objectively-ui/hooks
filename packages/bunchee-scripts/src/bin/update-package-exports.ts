import { type PackageJson, getPackageJson } from "../getPackageJson";
import { getSrcFiles } from "../getSrcFiles";
import { writePackageJson } from "../writePackageJson";

export const addExportMapsToPackageJson = async () => {
  const packageJson = await getPackageJson();
  const srcFiles = await getSrcFiles();

  const exports = srcFiles.reduce<PackageJson["exports"]>((exports, name) => {
    const fileNameWithoutExtension = name.split(".")[0];

    const key = name === "index.ts" ? "." : `./${fileNameWithoutExtension}`;

    exports[key] = {
      import: `./dist/es/${fileNameWithoutExtension}.d.mjs`,
      types: `./dist/es/${fileNameWithoutExtension}.mjs`,
    };

    return exports;
  }, {});

  packageJson.exports = exports;

  await writePackageJson(packageJson);
};
