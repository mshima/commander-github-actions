#!/usr/bin/env node
import { writeFile } from "fs/promises";

import { generateActionsYml } from "../../dist/dev.js";
import program from "./program.js";

await writeFile(
  "action.yml",
  await generateActionsYml(program, (data) => {
    data.runs.main = "action.js";
    return data;
  })
);
