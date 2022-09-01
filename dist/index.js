import { Command as CommanderCommand } from "commander";
const TRUE_VALUES = ["true", "True", "TRUE"];
const FALSE_VALUES = ["false", "False", "FALSE"];
const BOOLEAN_VALUES = [...TRUE_VALUES, ...FALSE_VALUES];
const getGithubEnvVarName = (option) => `INPUT_${option.name().toUpperCase()}`;
const convertEnvValueToOptionValue = (option, rawValue) => {
    if (option.variadic) {
        return rawValue.split("\n").filter((val) => val !== "");
    }
    if (!option.isBoolean()) {
        return rawValue;
    }
    if (BOOLEAN_VALUES.includes(rawValue)) {
        return TRUE_VALUES.includes(rawValue);
    }
    throw new Error(`${rawValue} is not a valid value yml boolean`);
};
export function createCommand(name) {
    return new Command(name);
}
/* export if parseConfig event is accepted upstream */
function prepareCommand(command) {
    return command
        .helpOption(false)
        .exitOverride()
        .on("parseConfig", function () {
        this.options.forEach((option) => {
            const githubEnvVarName = getGithubEnvVarName(option);
            if (githubEnvVarName && githubEnvVarName in process.env) {
                const value = process.env[githubEnvVarName]?.trim();
                if (!value) {
                    return;
                }
                const optionKey = option.attributeName();
                if (this.getOptionValue(optionKey) === undefined ||
                    ["default", "config", "env"].includes(this.getOptionValueSource(optionKey))) {
                    this.setOptionValueWithSource(option.attributeName(), convertEnvValueToOptionValue(option, value), "env");
                }
            }
        });
    }.bind(command));
}
export class Command extends CommanderCommand {
    constructor(name) {
        super(name);
        prepareCommand(this);
    }
    _parseOptionsEnv() {
        super._parseOptionsEnv();
        this.emit("parseConfig");
    }
}
export const program = new Command();
//# sourceMappingURL=index.js.map