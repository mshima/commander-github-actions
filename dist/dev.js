/* eslint-disable @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
import { readFile } from "fs/promises";
import { stringify } from "yaml";
import lodash from "lodash";
const toGitHubActionMetadata = (options) => Object.fromEntries(options.map((option) => [
    option.name(),
    {
        description: option.description,
        required: option.mandatory,
        default: typeof option.defaultValue === "boolean" ? `${option.defaultValue}` : option.defaultValue,
    },
]));
export async function generateActionsYml(command, additionalStructure = {}) {
    let json = {};
    try {
        json = JSON.parse((await readFile("./package.json")).toString());
    }
    catch (error) {
        console.log("package.json not found in current path");
    }
    const ymlStructure = lodash.merge({
        name: json.name || "name",
        author: json.author,
        description: json.description || "description",
        runs: {
            using: "node16",
            main: "main.js",
        },
        inputs: toGitHubActionMetadata(command.createHelp().visibleOptions(command)),
    }, additionalStructure);
    return stringify(ymlStructure);
}
//# sourceMappingURL=dev.js.map