import { setFailed, debug } from "@actions/core";

import program from "./program.js";

try {
  const options = program.parse().opts();

  debug("parsed options:");
  debug(options);

  console.log(program);
  if (!options.foo) {
    throw new Error("Foo is not set");
  }
} catch (error) {
  setFailed(error.message);
  process.exit(1);
}
