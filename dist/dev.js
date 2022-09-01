import { readFile } from "fs/promises";
const toGitHubActionMetadata = (options) => Object.fromEntries(options.map((option) => [
    option.name(),
    {
        description: option.description,
        required: option.mandatory,
        default: typeof option.defaultValue === "boolean" ? `${option.defaultValue}` : option.defaultValue,
    },
]));
export async function generateActionsYml(command, customizer = (data) => data) {
    let json = {};
    try {
        json = JSON.parse((await readFile("./package.json")).toString());
    }
    catch (error) {
        let packageJsonFile;
        try {
            const { pkgUp } = await import("pkg-up");
            packageJsonFile = await pkgUp();
        }
        catch (error) {
            console.log("to find the nearest package.json run 'npm install pkg-up --save-dev'");
        }
        if (packageJsonFile) {
            json = JSON.parse((await readFile(packageJsonFile)).toString());
        }
        else {
            console.log("package.json not found in current path");
        }
    }
    const ymlStructure = customizer({
        name: json.name || "name",
        author: json.author,
        description: json.description || "description",
        runs: {
            using: "node16",
            main: "main.js",
        },
        inputs: toGitHubActionMetadata(command.createHelp().visibleOptions(command)),
    });
    try {
        const { stringify } = await import("yaml");
        return stringify(ymlStructure);
    }
    catch (error) {
        throw new Error("This module requires 'yaml' module run 'npm install yaml --save-dev'");
    }
}
//# sourceMappingURL=dev.js.map