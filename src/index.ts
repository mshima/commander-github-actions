/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import { Command as CommanderCommand, Option as CommanderOption } from "commander";

const TRUE_VALUES = ["true", "True", "TRUE"];
const FALSE_VALUES = ["false", "False", "FALSE"];
const BOOLEAN_VALUES = [...TRUE_VALUES, ...FALSE_VALUES];

export function createOption(flags: string, description?: string | undefined): Option {
  return new Option(flags, description);
}

export function createCommand(name: string): Command {
  return new Command(name);
}

class Option extends CommanderOption {
  constructor(flags: string, description?: string) {
    super(flags, description);

    (this as any).envVar = `INPUT_${this.name().toUpperCase()}`;

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
  override env(): this {
    return this;
  }
}

export class Command extends CommanderCommand {
  override createOption(flags: string, description?: string | undefined): Option {
    return createOption(flags, description);
  }

  _parseOptionsEnv() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    (this as any).options.forEach((option: Option) => {
      const envVar = (option as any).envVar;
      const thisAny = this as any;
      if (envVar && envVar in process.env) {
        const optionKey: string = option.attributeName();
        if (this.getOptionValue(optionKey) === undefined || ["default", "config", "env"].includes(this.getOptionValueSource(optionKey))) {
          thisAny.emit(`optionEnv:${option.name()}`, process.env[envVar]);
        }
      }
    });
  }
}

export const program = new Command();
