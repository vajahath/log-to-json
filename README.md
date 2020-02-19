# log-to-json

Yet another transform stream to convert `.log` files to `.json`.

![](https://github.com/vajahath/log-to-json/workflows/Build/badge.svg) [![](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## Install

Requires Node >=10.

From npm,

```sh
npm i log-to-json
```

From [Github Package Registry](https://github.com/vajahath/log-to-json/packages). ([Guide](https://help.github.com/en/github/managing-packages-with-github-packages/configuring-npm-for-use-with-github-packages)).

Type definitions are bundled with this package.

## Usage

This module uses streams, so you can handle large files.

```ts
const { LogToJSON } = require('log-to-json');
// or
import { LogToJSON } from 'log-to-json';

const converter = new LogToJSON();

fs.createReadStream('my.log')
  .pipe(converter)
  .pipe(fs.createWriteStream('my.log.json'));
```

`my.log`:

```log
{"my": 5, "log":9, "file": "fsadf"}
{"my": 5, "log":9, "file": "fsadf"}
{"my": 5, "log":9, "file": "fsadf"}
{"my": 5, "log":9, "file": "fsadf"}
```

`my.log.json`:

```json
[
  { "my": 5, "log": 9, "file": "fsadf" },
  { "my": 5, "log": 9, "file": "fsadf" },
  { "my": 5, "log": 9, "file": "fsadf" },
  { "my": 5, "log": 9, "file": "fsadf" }
]
```

**Do not use this module if your your log files are not JSON like.**

<br>

[![](https://img.shields.io/badge/built%20with-ts--np%203-lightgrey?style=flat-square)](https://github.com/vajahath/generator-ts-np) <!--(TSNP VERSION: 3.2.0)-->

## Licence

MIT &copy; [Vajahath Ahmed](https://twitter.com/vajahath7)
