# commander-github-actions

[![License][]](LICENSE)
[![Build Status]](https://github.com/mshima/commander-github-actions/actions/workflows/ci.yml)
[![NPM Package]](https://npmjs.org/package/commander-github-actions)
[![Code Coverage]](https://codecov.io/gh/mshima/commander-github-actions)
[![semantic-release]](https://github.com/semantic-release/semantic-release)

[license]: https://img.shields.io/badge/UNLICENSED-blue.svg
[build status]: https://github.com/mshima/commander-github-actions/actions/workflows/ci.yml/badge.svg
[npm package]: https://img.shields.io/npm/v/commander-github-actions.svg
[code coverage]: https://codecov.io/gh/mshima/commander-github-actions/branch/master/graph/badge.svg
[semantic-release]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

> Parse and generate GitHub Actions with commander

## Install

```shell
npm install commander-github-actions
```

`commander-github-actions/dev` is used to generate actions.yml. Given the development nature, dependencies are optional:

```shell
npm install yaml lodash --save-dev
```

## Use

program.js:

```js
export function buildCommand(command = new Command()) {
  return command.option(...).addOption(command.createOption(...));
}
```

cli.js (executable):

```js
import { buildCommand } from "./program.js";
const options = buildCommand().parse();
```

action.js (GitHub action entrypoint):

```js
import { Command } from "commander-github-actions";
import { buildCommand } from "./program.js";

const options = buildCommand(new Command()).parse();
```

drop in replacements for commander are provided:

```js
import { createCommand, createOption, Command, Option, program } from "commander-github-actions";
```

## Generate action.yml

dev/generate-action-yml.yml

```
#!/usr/bin/env node
import { writeFile } from 'fs/promises';

import { generateActionsYml } from 'commander-github-actions/dev';
import program from '../action/program.js';

await writeFile('action.yml', (await generateActionsYml(program, { runs: { main: 'action/main.js' } })));
```

## Related

https://github.com/tj/commander.js/issues/1787
