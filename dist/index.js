/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import { Command as CommanderCommand, Option as CommanderOption } from "commander";
const TRUE_VALUES = ["true", "True", "TRUE"];
const FALSE_VALUES = ["false", "False", "FALSE"];
const BOOLEAN_VALUES = [...TRUE_VALUES, ...FALSE_VALUES];
export function createOption(flags, description) {
    return new Option(flags, description);
}
export function createCommand(name) {
    return new Command(name);
}
class Option extends CommanderOption {
    constructor(flags, description) {
        super(flags, description);
        this.envVar = `INPUT_${this.name().toUpperCase()}`;
        this.argParser((value) => {
            if (value == null) {
                return value;
            }
            value = value.trim();
            if (this.variadic) {
                return value.split("\n").filter((val) => val !== "");
            }
            if (!this.isBoolean()) {
                return value;
            }
            if (!BOOLEAN_VALUES.includes(value)) {
                throw new Error(`${value} is not a valid value yml boolean`);
            }
            return TRUE_VALUES.includes(value);
        });
    }
    // NOOP, we use github env variables.
    env() {
        return this;
    }
}
export class Command extends CommanderCommand {
    createOption(flags, description) {
        return createOption(flags, description);
    }
    _parseOptionsEnv() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.options.forEach((option) => {
            const envVar = option.envVar;
            if (envVar && envVar in process.env) {
                const value = process.env[envVar];
                if (value === "") {
                    return;
                }
                const optionKey = option.attributeName();
                if (this.getOptionValue(optionKey) === undefined || ["default", "config", "env"].includes(this.getOptionValueSource(optionKey))) {
                    const thisAny = this;
                    thisAny.emit(`optionEnv:${option.name()}`, value);
                }
            }
        });
    }
}
export const program = new Command();
//# sourceMappingURL=index.js.map