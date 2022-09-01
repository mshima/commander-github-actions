import { Command as CommanderCommand } from "commander";
declare module "commander" {
    interface Command {
        _parseOptionsEnv(): void;
        options: Option[];
        emit(eventName: string | symbol, ...args: any[]): boolean;
    }
}
export declare function createCommand(name: string): Command;
export declare class Command extends CommanderCommand {
    constructor(name?: string);
    _parseOptionsEnv(): void;
}
export declare const program: Command;
//# sourceMappingURL=index.d.ts.map