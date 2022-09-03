import { program } from "../../dist/index.js";

program.requiredOption("--foo").option("--undefined");

export default program;
