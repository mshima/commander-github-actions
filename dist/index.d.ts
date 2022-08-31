import { Command as CommanderCommand, Option as CommanderOption } from "commander";
export declare function createOption(flags: string, description?: string | undefined): Option;
export declare function createCommand(name: string): Command;
declare class Option extends CommanderOption {
    constructor(flags: string, description?: string);
    env(): this;
}
export declare class Command extends CommanderCommand {
    createOption(flags: string, description?: string | undefined): Option;
    _parseOptionsEnv(): void;
}
export declare const program: Command;
export {};
//# sourceMappingURL=index.d.ts.map