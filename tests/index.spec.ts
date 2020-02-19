/**
 * Loading from /dist because this actually
 * gives you the ability to test the exact
 * code getting published. You can also check the typings this way.
 */
const { LogToJSON } = require('../dist/index');

import { join as pathJoin } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { unlink } from 'fs';

const SRC_PATH = pathJoin(__dirname, 'sample._log');
const DEST_PATH = pathJoin(__dirname, 'sample.log.json');

describe('testing add sample log file', () => {
  test('5 + 6 = 11', async () => {
    const converter = new LogToJSON();
    const reader = createReadStream(SRC_PATH);
    const writer = createWriteStream(DEST_PATH);

    await new Promise((resolve, reject) => {
      reader
        .pipe(converter)
        .pipe(writer)
        .on('end', resolve)
        .on('close', resolve)
        .on('error', (err: any) => reject(err));
    });

    try {
      require(DEST_PATH);
    } catch (err) {
      console.error(err);

      throw new Error('destination is not proper JSON');
    }
  }, 10000);
});

afterAll(done => unlink(DEST_PATH, done));
