/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
import { readFile } from "fs/promises";

import { Command, Option } from "commander";
import { stringify } from "yaml";

const toGitHubActionMetadata = (options: Option[]) =>
  Object.fromEntries(
    options.map((option) => [
      option.name(),
      {
        description: option.description,
        required: option.required,
        default: option.defaultValue,
      },
    ])
  );

export async function generateActionsYml(command: Command, additionalStructure: object = {}): Promise<string> {
  let json: any = {};
  try {
    json = JSON.parse((await readFile("./package.json")).toString());
  } catch (error) {
    console.log("package.json not found in current path");
  }
  const ymlStructure = {
    name: (json.name as string) || "name",
    author: json.author as string,
    description: (json.description as string) || "description",
    runs: {
      using: "node16",
      main: "main.js",
    },
    inputs: toGitHubActionMetadata(command.createHelp().visibleOptions(command)),
    ...additionalStructure,
  };
  return stringify(ymlStructure);
}
