import { readFile } from "fs/promises";

import { Command, Option } from "commander";

const toGitHubActionMetadata = (options: Option[]) =>
  Object.fromEntries(
    options.map((option) => [
      option.name(),
      {
        description: option.description,
        required: option.mandatory,
        default: typeof option.defaultValue === "boolean" ? `${option.defaultValue}` : option.defaultValue,
      },
    ])
  );

export async function generateActionsYml(command: Command, customizer = (data: any): any => data): Promise<string> {
  let json: any = {};
  try {
    json = JSON.parse((await readFile("./package.json")).toString());
  } catch (error) {
    let packageJsonFile;
    try {
      const { pkgUp } = await import("pkg-up");
      packageJsonFile = await pkgUp();
    } catch (error) {
      console.log("to find the nearest package.json run 'npm install pkg-up --save-dev'");
    }
    if (packageJsonFile) {
      json = JSON.parse((await readFile(packageJsonFile)).toString());
    } else {
      console.log("package.json not found in current path");
    }
  }
  const ymlStructure = customizer({
    name: (json.name as string) || "name",
    author: json.author as string,
    description: (json.description as string) || "description",
    runs: {
      using: "node16",
      main: "main.js",
    },
    inputs: toGitHubActionMetadata(command.createHelp().visibleOptions(command)),
  });
  try {
    const { stringify } = await import("yaml");
    return stringify(ymlStructure);
  } catch (error) {
    throw new Error("This module requires 'yaml' module run 'npm install yaml --save-dev'");
  }
}
