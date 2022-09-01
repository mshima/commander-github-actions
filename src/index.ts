import { Command as CommanderCommand } from "commander";
import type { Option } from "commander";

const TRUE_VALUES = ["true", "True", "TRUE"];
const FALSE_VALUES = ["false", "False", "FALSE"];
const BOOLEAN_VALUES = [...TRUE_VALUES, ...FALSE_VALUES];

declare module "commander" {
  export interface Command {
    _parseOptionsEnv(): void;
    options: Option[];
    emit(eventName: string | symbol, ...args: any[]): boolean;
  }
}

const getGithubEnvVarName = (option: Option): string => `INPUT_${option.name().toUpperCase()}`;

const convertEnvValueToOptionValue = (option: Option, rawValue: string): any => {
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

export function createCommand(name: string): Command {
  return new Command(name);
}

/* export if parseConfig event is accepted upstream */
function prepareCommand(command: Command): Command {
  return command
    .helpOption(false)
    .exitOverride()
    .on(
      "parseConfig",
      function (this: Command) {
        this.options.forEach((option: Option) => {
          const githubEnvVarName = getGithubEnvVarName(option);
          if (githubEnvVarName && githubEnvVarName in process.env) {
            const value = process.env[githubEnvVarName]?.trim();
            if (!value) {
              return;
            }
            const optionKey: string = option.attributeName();
            if (
              this.getOptionValue(optionKey) === undefined ||
              ["default", "config", "env"].includes(this.getOptionValueSource(optionKey))
            ) {
              this.setOptionValueWithSource(option.attributeName(), convertEnvValueToOptionValue(option, value), "env");
            }
          }
        });
      }.bind(command)
    );
}

export class Command extends CommanderCommand {
  constructor(name?: string) {
    super(name);
    prepareCommand(this);
  }

  override _parseOptionsEnv() {
    super._parseOptionsEnv();
    this.emit("parseConfig");
  }
}

export const program = new Command();
